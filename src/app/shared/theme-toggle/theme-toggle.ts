import { Component, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="theme-toggle-btn" (click)="toggleTheme()" [title]="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
      <span class="material-icons">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
    </button>
  `,
  styles: [`
    .theme-toggle-btn {
      position: fixed;
      bottom: 90px; /* Above the footer/navigation */
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: var(--primary-color, #d35400);
      color: white;
      border: none;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 14px rgba(0,0,0,0.4);
      }

      &:active {
        transform: scale(0.95);
      }

      .material-icons {
        font-size: 24px;
      }
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  isDark = false;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.enableDark();
      } else if (savedTheme === 'light') {
        this.enableLight();
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.enableDark();
      }
    }
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      this.enableDark();
    } else {
      this.enableLight();
    }
  }

  private enableDark() {
    this.isDark = true;
    this.renderer.addClass(document.body, 'dark-theme');
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', 'dark');
    }
  }

  private enableLight() {
    this.isDark = false;
    this.renderer.removeClass(document.body, 'dark-theme');
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', 'light');
    }
  }
}
