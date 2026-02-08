import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="app-footer" (click)="onOpenSelector()">
      <div class="book-info">
        <span class="book-name">{{ bookName }}</span>
        <span class="chapter-number">{{ chapter }}</span>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 56px;
      background-color: #fff;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 -2px 4px rgba(0,0,0,0.05);
      z-index: 1000;
      transition: background-color 0.2s;
    }
    .app-footer:active {
      background-color: #f5f5f5;
    }
    .book-info {
      font-family: 'Ramabhadra', sans-serif;
      font-size: 1.1rem;
      color: #333;
      display: flex;
      gap: 8px;
    }
    .chapter-number {
      font-weight: bold;
      color: #d35400;
    }
  `]
})
export class FooterComponent {
  @Input() bookName: string = '';
  @Input() chapter: number = 0;
  @Output() openSelector = new EventEmitter<void>();

  onOpenSelector() {
    this.openSelector.emit();
  }
}
