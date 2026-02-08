import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export interface BibleBook {
  id: number;
  name: string;
  teluguName: string;
  testament: 'Old' | 'New';
  fileName: string;
}

export interface SearchResult {
  book: BibleBook;
  chapterIndex: number;
  verseIndex: number;
  verseText: string;
  verseId: string;
}

@Injectable({
  providedIn: 'root'
})
export class BibleService {
  private booksSubject = new BehaviorSubject<BibleBook[]>([]);
  books$ = this.booksSubject.asObservable();

  private currentBookSubject = new BehaviorSubject<BibleBook | null>(null);
  currentBook$ = this.currentBookSubject.asObservable();

  private currentChapterIndexSubject = new BehaviorSubject<number>(0);
  currentChapterIndex$ = this.currentChapterIndexSubject.asObservable();

  private currentChapterVersesSubject = new BehaviorSubject<any[]>([]);
  currentChapterVerses$ = this.currentChapterVersesSubject.asObservable();

  private chaptersCountSubject = new BehaviorSubject<number>(0);
  chaptersCount$ = this.chaptersCountSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private bookData: any = null; // Holds the full data of current book

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.loadBooks();
  }

  private loadBooks() {
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<BibleBook[]>('assets/books.json').subscribe({
        next: (books) => {
          this.booksSubject.next(books);
          if (books.length > 0) {
            this.setBook(books[0]); // Default to Genesis
          }
        },
        error: (err) => console.error('Failed to load books.json', err)
      });
    }
  }

  setBook(book: BibleBook) {
    if (this.currentBookSubject.value?.id === book.id) return;
    
    this.currentBookSubject.next(book);
    this.currentChapterIndexSubject.next(0);
    this.loadBookData(book.fileName);
  }

  private loadBookData(fileName: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadingSubject.next(true);
      this.http.get<any>(`assets/bible/${fileName}.json`).subscribe({
        next: (data) => {
          if (data && data.Book && data.Book.length > 0) {
            this.bookData = data.Book[0];
            this.chaptersCountSubject.next(this.bookData.Chapter ? this.bookData.Chapter.length : 0);
            this.loadChapter(0);
          }
          this.loadingSubject.next(false);
        },
        error: (err) => {
          this.loadingSubject.next(false);
          console.error(`Failed to load book data: ${fileName}`, err);
        }
      });
    }
  }

  loadChapter(index: number) {
    if (this.bookData && this.bookData.Chapter && this.bookData.Chapter.length > index) {
      this.currentChapterIndexSubject.next(index);
      this.currentChapterVersesSubject.next(this.bookData.Chapter[index].Verse);
    }
  }

  nextChapter() {
    const currentIndex = this.currentChapterIndexSubject.value;
    if (this.bookData && this.bookData.Chapter && currentIndex < this.bookData.Chapter.length - 1) {
      this.loadChapter(currentIndex + 1);
    } else {
      // Logic for next book could go here
    }
  }

  previousChapter() {
    const currentIndex = this.currentChapterIndexSubject.value;
    if (currentIndex > 0) {
      this.loadChapter(currentIndex - 1);
    } else {
      // Logic for previous book could go here
    }
  }

  getCurrentBook(): BibleBook | null {
    return this.currentBookSubject.value;
  }

  search(query: string): Observable<SearchResult[]> {
    if (!query || query.trim().length < 2) return of([]);
    
    const term = query.toLowerCase();
    const books = this.booksSubject.value;
    
    if (!books.length) return of([]);

    const requests = books.map(book => 
      this.http.get<any>(`assets/bible/${book.fileName}.json`).pipe(
        map(data => {
          const results: SearchResult[] = [];
          if (data && data.Book && data.Book.length > 0) {
            const bookData = data.Book[0];
            if (bookData.Chapter) {
              bookData.Chapter.forEach((chapter: any, cIndex: number) => {
                if (chapter.Verse) {
                  chapter.Verse.forEach((verse: any, vIndex: number) => {
                    if (verse.Verse && verse.Verse.toLowerCase().includes(term)) {
                      results.push({
                        book: book,
                        chapterIndex: cIndex,
                        verseIndex: vIndex + 1,
                        verseText: verse.Verse,
                        verseId: verse.Verseid
                      });
                    }
                  });
                }
              });
            }
          }
          return results;
        })
      )
    );

    return forkJoin(requests).pipe(
      map(resultsArrays => resultsArrays.flat())
    );
  }

  findSimilar(sourceVerse: string): Observable<SearchResult[]> {
    if (!sourceVerse) return of([]);
    
    // 1. Tokenize source verse
    const sourceWords = new Set(
      sourceVerse.toLowerCase()
        .replace(/[^\w\s\u0C00-\u0C7F]/g, '') // Keep Telugu chars and whitespace
        .split(/\s+/)
        .filter(w => w.length > 2) // Filter out very short words
    );

    if (sourceWords.size === 0) return of([]);

    const threshold = Math.ceil(sourceWords.size * 0.5);
    const books = this.booksSubject.value;

    if (!books.length) return of([]);

    const requests = books.map(book => 
      this.http.get<any>(`assets/bible/${book.fileName}.json`).pipe(
        map(data => {
          const results: SearchResult[] = [];
          if (data && data.Book && data.Book.length > 0) {
            const bookData = data.Book[0];
            if (bookData.Chapter) {
              bookData.Chapter.forEach((chapter: any, cIndex: number) => {
                if (chapter.Verse) {
                  chapter.Verse.forEach((verse: any, vIndex: number) => {
                    if (verse.Verse) {
                      // 2. Tokenize target verse
                      const targetWords = new Set(
                        verse.Verse.toLowerCase()
                          .replace(/[^\w\s\u0C00-\u0C7F]/g, '')
                          .split(/\s+/)
                          .filter((w: string) => w.length > 2)
                      );

                      // 3. Count intersection
                      let matchCount = 0;
                      sourceWords.forEach(word => {
                        if (targetWords.has(word)) matchCount++;
                      });

                      // 4. Check threshold
                      if (matchCount >= threshold) {
                         // Avoid exact self-match if desirable, but user might want to see it too.
                         // Let's include it.
                         results.push({
                          book: book,
                          chapterIndex: cIndex,
                          verseIndex: vIndex + 1,
                          verseText: verse.Verse,
                          verseId: verse.Verseid
                        });
                      }
                    }
                  });
                }
              });
            }
          }
          return results;
        })
      )
    );

    return forkJoin(requests).pipe(
      map(resultsArrays => resultsArrays.flat())
    );
  }
}
