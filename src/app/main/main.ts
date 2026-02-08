import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header';
import { FooterComponent } from '../shared/footer/footer';
import { BookSelectorComponent } from '../shared/book-selector/book-selector';
import { VerseComponent } from '../verse/verse';
import { GestureService } from '../core/services/gesture.service';
import { ChapterSelectorComponent } from '../shared/chapter-selector/chapter-selector';
import { SearchComponent } from '../shared/search/search';
import { BibleService, BibleBook, SearchResult } from '../core/services/bible.service';
import { Observable, combineLatest } from 'rxjs';
import { VerseMenuComponent } from '../shared/verse-menu/verse-menu';
import { Title, Meta } from '@angular/platform-browser';
// import { ThemeToggleComponent } from '../shared/theme-toggle/theme-toggle'; // Hidden for now

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    FooterComponent, 
    BookSelectorComponent, 
    ChapterSelectorComponent,
    VerseComponent,
    SearchComponent,
    VerseMenuComponent,
    // ThemeToggleComponent // Hidden for now
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class MainComponent implements OnInit {
  currentBook$: Observable<BibleBook | null>;
  currentChapterIndex$: Observable<number>;
  currentVerses$: Observable<any[]>;
  chaptersCount$: Observable<number>;
  loading$: Observable<boolean>;
  
  showSelector = false;
  showChapterSelector = false;
  showSearch = false;
  
  selectedVerse: any = null;
  selectedVerseBook = '';
  selectedVerseChapter = 0;
  selectedVerseIndex = 0;
  searchInitialQuery = '';

  constructor(
    private gestureService: GestureService,
    private bibleService: BibleService,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.currentBook$ = this.bibleService.currentBook$;
    this.currentChapterIndex$ = this.bibleService.currentChapterIndex$;
    this.currentVerses$ = this.bibleService.currentChapterVerses$;
    this.chaptersCount$ = this.bibleService.chaptersCount$;
    this.loading$ = this.bibleService.loading$;
  }

  ngOnInit() {
    this.gestureService.swipeLeft$.subscribe(() => {
      this.bibleService.nextChapter();
    });

    this.gestureService.swipeRight$.subscribe(() => {
      this.bibleService.previousChapter();
    });

    // SEO Updates & Scroll to top on chapter change
    combineLatest([this.currentBook$, this.currentChapterIndex$]).subscribe(([book, chapterIndex]) => {
      if (book) {
        const chapter = chapterIndex + 1;
        const pageTitle = `${book.teluguName} ${chapter} - తెలుగు బైబిల్ (Telugu Bible)`;
        this.titleService.setTitle(pageTitle);

        const desc = `చదవండి ${book.teluguName} అధ్యాయం ${chapter}. Read ${book.name} Chapter ${chapter} in Telugu. Free online Telugu Bible.`;
        this.metaService.updateTag({ name: 'description', content: desc });
        this.metaService.updateTag({ name: 'keywords', content: `Telugu Bible, ${book.teluguName}, ${book.name}, Bible online, Christian, Telugu scripture, ${book.teluguName} ${chapter}` });
        
        // Open Graph
        this.metaService.updateTag({ property: 'og:title', content: pageTitle });
        this.metaService.updateTag({ property: 'og:description', content: desc });
        this.metaService.updateTag({ property: 'og:type', content: 'book' });

        // Scroll to top when chapter changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  toggleSelector() {
    this.showSelector = !this.showSelector;
  }

  openChapterSelector() {
    this.showChapterSelector = true;
  }

  onBookSelected(book: BibleBook) {
    this.bibleService.setBook(book);
    this.showSelector = false;
    this.showChapterSelector = true;
  }

  onChapterSelected(chapterNum: number) {
    this.bibleService.loadChapter(chapterNum - 1);
    this.showChapterSelector = false;
  }

  onChangeBook() {
    this.showChapterSelector = false;
    this.showSelector = true;
  }

  searchIsSimilar = false;

  openSearch() {
    this.searchInitialQuery = '';
    this.searchIsSimilar = false;
    this.showSearch = true;
  }
  onSearchResult(result: SearchResult) {
    this.bibleService.setBook(result.book);
    setTimeout(() => {
      this.bibleService.loadChapter(result.chapterIndex);
    }, 100);
    this.showSearch = false;
  }

  handleVerseLongPress(verse: any, index: number, bookName: string, chapter: number) {
    this.selectedVerse = verse;
    this.selectedVerseBook = bookName;
    this.selectedVerseChapter = chapter;
    this.selectedVerseIndex = index;
  }

  closeVerseMenu() {
    this.selectedVerse = null;
  }

  onShareVerse() {
    if (!this.selectedVerse) return;
    
    const text = `${this.selectedVerse.Verse}\n\n- ${this.selectedVerseBook} ${this.selectedVerseChapter}:${this.selectedVerseIndex}\n(Telugu Bible App)`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Telugu Bible Verse',
        text: text,
      }).catch((error) => {
         console.error('Error sharing', error);
         this.openWhatsApp(text);
      });
    } else {
      this.openWhatsApp(text);
    }
    this.closeVerseMenu();
  }

  openWhatsApp(text: string) {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  onFindSimilar() {
    if (!this.selectedVerse) return;
    this.searchInitialQuery = this.selectedVerse.Verse;
    this.searchIsSimilar = true;
    this.showSearch = true;
    this.closeVerseMenu();
  }
}


