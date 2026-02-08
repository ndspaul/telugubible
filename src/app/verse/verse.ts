import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verse',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="verse" 
      [class.active]="isActive"
      (mousedown)="startPress($event)"
      (touchstart)="startPress($event)"
      (mouseup)="endPress()"
      (touchend)="endPress()"
      (mouseleave)="endPress()"
      (touchcancel)="endPress()">
      <span class="verse-number">{{ verseIndex }}</span>
      <span class="verse-text">{{ verseData?.Verse }}</span>
    </div>
  `,
  styleUrl: './verse.scss',
})
export class VerseComponent {
  @Input() verseData: any;
  @Input() verseIndex: number = 0;
  @Input() bookName: string = '';
  @Input() chapter: number = 0;

  @Output() longPress = new EventEmitter<void>();

  isActive = false;
  private pressTimer: any;

  startPress(event: Event) {
    this.isActive = true;
    this.pressTimer = setTimeout(() => {
      this.longPress.emit();
      this.isActive = false; // Reset after emit
    }, 800); 
  }

  endPress() {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
    this.isActive = false;
  }
}
