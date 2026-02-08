import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chapter-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chapter-selector-overlay" (click)="closeSelector()">
      <div class="selector-container" (click)="$event.stopPropagation()">
        <header class="selector-header">
          <div class="header-title">
            <span *ngIf="bookName" class="book-name">{{ bookName }}</span>
            <span class="subtitle">అధ్యాయం ఎంచుకోండి</span> <!-- Select Chapter -->
          </div>
          <button class="change-book-btn" (click)="requestBookChange()">
            పుస్తకాన్ని మార్చండి
          </button>
          <button class="close-btn" (click)="closeSelector()">
            <span class="material-icons">close</span>
          </button>
        </header>

        <div class="chapter-list">
          <div *ngIf="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading Chapters...</p>
          </div>
          <ng-container *ngIf="!loading">
            <button 
              *ngFor="let chapter of chapters"
              (click)="selectChapter(chapter)"
              class="chapter-item">
              {{ chapter }}
            </button>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styleUrl: './chapter-selector.scss'
})
export class ChapterSelectorComponent implements OnChanges {
  @Input() chaptersCount: number = 0;
  @Input() loading: boolean = false;
  @Input() bookName: string = '';
  @Output() chapterSelected = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();
  @Output() changeBook = new EventEmitter<void>();

  chapters: number[] = [];

  requestBookChange() {
    this.changeBook.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chaptersCount']) {
      this.chapters = Array.from({ length: this.chaptersCount }, (_, i) => i + 1);
    }
  }

  selectChapter(chapter: number) {
    this.chapterSelected.emit(chapter);
  }

  closeSelector() {
    this.close.emit();
  }
}
