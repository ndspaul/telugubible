import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="app-header">
      <button class="icon-btn">
        <span class="material-icons">menu</span>
      </button>
      <div class="title">Telugu Bible</div>
      <button class="icon-btn" (click)="onSearch()">
        <span class="material-icons">search</span>
      </button>
    </header>
  `,
  // ... existing styles ...
  styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 100;
      width: 100%;
    }
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      height: 60px;
    }
    .title {
      font-size: 1.2rem;
      font-weight: 500;
      color: #2c3e50;
      font-family: 'Ramabhadra', sans-serif;
    }
    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #5f6368;
      padding: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-btn:hover {
      background-color: rgba(0,0,0,0.05);
    }
    .material-icons {
      font-size: 24px;
    }
  `]
})
export class HeaderComponent {
  @Output() searchClick = new EventEmitter<void>();

  onSearch() {
    this.searchClick.emit();
  }
}
