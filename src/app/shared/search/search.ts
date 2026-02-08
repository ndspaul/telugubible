import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BibleService, SearchResult, BibleBook } from '../../core/services/bible.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, finalize } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-overlay" (click)="closeSearch()">
      <div class="search-container" (click)="$event.stopPropagation()">
        <header class="search-header">
          <div class="input-wrapper">
            <span class="material-icons search-icon">search</span>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (ngModelChange)="onSearchInput($event)"
              placeholder="search..." 
              class="search-input"
              autoFocus>
            <button *ngIf="searchQuery" class="clear-btn" (click)="clearSearch()">
              <span class="material-icons">close</span>
            </button>
          </div>
          <button class="close-btn" (click)="closeSearch()">
            cancel
          </button>
        </header>
        
        <!-- Testament tabs - show when not searching -->
        <div class="testament-tabs" *ngIf="!searchQuery && !isSimilarSearch">
          <button 
            [class.active]="activeTab === 'Old'"
            (click)="activeTab = 'Old'"
            class="tab-btn">
            Old Testament
          </button>
          <button 
            [class.active]="activeTab === 'New'"
            (click)="activeTab = 'New'"
            class="tab-btn">
            New Testament
          </button>
        </div>

        <!-- Book grid - show when not searching -->
        <div class="book-grid" *ngIf="!searchQuery && !isSimilarSearch">
          <button 
            *ngFor="let book of (activeTab === 'Old' ? oldTestamentBooks : newTestamentBooks)"
            (click)="selectBook(book)"
            class="book-grid-item">
            {{ book.teluguName }}
          </button>
        </div>
        
        <div class="search-context" *ngIf="isSimilarSearch && searchQuery">
          <!-- <p class="context-info">సారూప్య వచనాలు (Similar Verses) - 50% పదాల ఎంపిక</p> -->
        </div>

        <!-- Search results - show when searching -->
        <div class="search-results" *ngIf="searchQuery && (results.length > 0 || loading || searchQuery.length >= 2)">
          <div *ngIf="loading" class="loading-state">
            <div class="spinner"></div>
            <p>searching...</p>
          </div>

          <div *ngIf="!loading && results.length === 0 && searchQuery.length >= 2" class="no-results">
            ఫలితాలు కనుగొనబడలేదు (No results found)
          </div>

          <div *ngIf="!loading && results.length > 0" class="results-list">
            <div 
              *ngFor="let result of results" 
              class="result-item"
              (click)="selectResult(result)">
              <div class="result-header">
                <span class="book-ref">{{ result.book.teluguName }} {{ result.chapterIndex + 1 }}:{{ result.verseIndex }}</span>
              </div>
              <div class="result-text" [innerHTML]="highlightText(result.verseText)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './search.scss'
})
export class SearchComponent implements OnInit {
  @Input() initialQuery: string = '';
  @Input() isSimilarSearch: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() resultSelected = new EventEmitter<SearchResult>();
  @Output() bookSelected = new EventEmitter<BibleBook>();

  searchQuery = '';
  results: SearchResult[] = [];
  loading = false;
  private searchSubject = new Subject<string>();

  // Book selection
  activeTab: 'Old' | 'New' = 'Old';
  oldTestamentBooks: BibleBook[] = [];
  newTestamentBooks: BibleBook[] = [];

  constructor(private bibleService: BibleService) {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.length < 2) {
          this.results = [];
          return [];
        }
        this.loading = true;
        
        let searchObs;
        if (this.isSimilarSearch) {
          searchObs = this.bibleService.findSimilar(query);
        } else {
          searchObs = this.bibleService.search(query);
        }

        return searchObs.pipe(
          finalize(() => this.loading = false)
        );
      })
    ).subscribe(results => {
      this.results = results;
    });
  }

  ngOnInit() {
    // Load books for selection
    this.bibleService.books$.subscribe(books => {
      this.oldTestamentBooks = books.filter(b => b.testament === 'Old');
      this.newTestamentBooks = books.filter(b => b.testament === 'New');
    });

    if (this.initialQuery) {
      this.searchQuery = this.initialQuery;
      this.onSearchInput(this.initialQuery);
    }
  }

  onSearchInput(query: string) {
    this.searchSubject.next(query);
  }

  clearSearch() {
    this.searchQuery = '';
    this.results = [];
  }

  closeSearch() {
    this.close.emit();
  }

  selectResult(result: SearchResult) {
    this.resultSelected.emit(result);
  }

  selectBook(book: BibleBook) {
    this.bookSelected.emit(book);
    this.close.emit();
  }

  highlightText(text: string): string {
    if (!this.searchQuery || this.isSimilarSearch) return text;
    const regex = new RegExp(`(${this.searchQuery})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }
}
