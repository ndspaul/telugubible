import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibleService, BibleBook } from '../../core/services/bible.service';

@Component({
  selector: 'app-book-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="book-selector-overlay" (click)="closeSelector()">
      <div class="selector-container" (click)="$event.stopPropagation()">
        <header class="selector-header">
          <div class="tabs">
            <button 
              [class.active]="activeTab === 'Old'"
              (click)="activeTab = 'Old'"
              class="tab-btn">
              పాత నిబంధన
            </button>
            <button 
              [class.active]="activeTab === 'New'"
              (click)="activeTab = 'New'"
              class="tab-btn">
              కొత్త నిబంధన
            </button>
          </div>
          <button class="close-btn" (click)="closeSelector()">
            <span class="material-icons">close</span>
          </button>
        </header>

        <div class="book-list">
          <button 
            *ngFor="let book of (activeTab === 'Old' ? oldTestamentBooks : newTestamentBooks)"
            (click)="selectBook(book)"
            class="book-item">
            {{ book.teluguName }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './book-selector.scss'
})
export class BookSelectorComponent {
  @Output() close = new EventEmitter<void>();
  
  @Input() initialTestament: 'Old' | 'New' = 'Old';
  activeTab: 'Old' | 'New' = 'Old';
  oldTestamentBooks: BibleBook[] = [];
  newTestamentBooks: BibleBook[] = [];

  @Output() bookSelected = new EventEmitter<BibleBook>();

  constructor(private bibleService: BibleService) {
    this.bibleService.books$.subscribe(books => {
      this.oldTestamentBooks = books.filter(b => b.testament === 'Old');
      this.newTestamentBooks = books.filter(b => b.testament === 'New');
    });
  }

  ngOnInit() {
    this.activeTab = this.initialTestament;
  }

  selectBook(book: BibleBook) {
    this.bookSelected.emit(book);
  }

  closeSelector() {
    this.close.emit();
  }
}
