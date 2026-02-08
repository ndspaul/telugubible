import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verse-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="menu-overlay" (click)="close.emit()">
      <div class="menu-container" (click)="$event.stopPropagation()">
        <header class="menu-header">
          <span class="verse-ref">{{ bookName }} {{ chapter }}:{{ verseIndex }}</span>
          <button class="close-btn" (click)="close.emit()">
            <span class="material-icons">close</span>
          </button>
        </header>
        
        <div class="menu-options">
          <button class="menu-item" (click)="onShare()">
            <span class="material-icons">share</span>
            <span class="label">WhatsApp ద్వారా భాగస్వామ్యం</span> <!-- Share via WhatsApp -->
          </button>
          
          <button class="menu-item" (click)="onFindSimilar()">
            <span class="material-icons">search</span>
            <span class="label">సారూప్య వచనాన్ని కనుగొనండి</span> <!-- Find similar verse -->
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './verse-menu.scss'
})
export class VerseMenuComponent {
  @Input() bookName: string = '';
  @Input() chapter: number = 0;
  @Input() verseIndex: number = 0;
  
  @Output() close = new EventEmitter<void>();
  @Output() share = new EventEmitter<void>();
  @Output() findSimilar = new EventEmitter<void>();

  onShare() {
    this.share.emit();
    this.close.emit();
  }

  onFindSimilar() {
    this.findSimilar.emit();
    this.close.emit();
  }
}
