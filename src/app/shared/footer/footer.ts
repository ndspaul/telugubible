import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="app-footer" (click)="onOpenSelector()">
      <div class="footer-content">
        <span class="material-icons chevron-icon">expand_less</span>
        <div class="book-info">
          <span class="book-name">{{ bookName }}</span>
          <span class="chapter-number">Chapter {{ chapter }}</span>
        </div>
        <span class="tap-hint">Tap to change</span>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: linear-gradient(to top, #ffffff, #f8f9fa);
      border-top: 2px solid #d35400;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 -4px 12px rgba(211, 84, 0, 0.15);
      z-index: 1000;
      transition: all 0.3s ease;
      /* Safe area for mobile devices */
      padding-bottom: env(safe-area-inset-bottom);
      padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
    }
    
    .app-footer:hover {
      background: linear-gradient(to top, #f8f9fa, #ffffff);
      box-shadow: 0 -6px 16px rgba(211, 84, 0, 0.25);
      transform: translateY(-2px);
    }
    
    .app-footer:active {
      background-color: #f0f0f0;
      transform: translateY(0);
    }
    
    .footer-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding-bottom: 4px;
    }
    
    .chevron-icon {
      color: #d35400;
      font-size: 20px;
      animation: bounce 2s infinite;
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    
    .book-info {
      font-family: 'Ramabhadra', sans-serif;
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .book-name {
      font-size: 1.1rem;
      color: #2c3e50;
      font-weight: 500;
    }
    
    .chapter-number {
      font-size: 1rem;
      font-weight: bold;
      color: #d35400;
      background-color: rgba(211, 84, 0, 0.1);
      padding: 2px 8px;
      border-radius: 12px;
    }
    
    .tap-hint {
      font-size: 0.7rem;
      color: #7f8c8d;
      font-family: 'Mandali', sans-serif;
    }

    /* Mobile responsive adjustments */
    @media (max-height: 667px) {
      .app-footer {
        height: 56px;
      }
      
      .chevron-icon {
        font-size: 16px;
      }
      
      .book-name {
        font-size: 1rem;
      }
      
      .chapter-number {
        font-size: 0.9rem;
      }
      
      .tap-hint {
        font-size: 0.65rem;
      }
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
