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
      [class.selected]="isSelected"
      (mousedown)="startPress($event)"
      (touchstart)="startPress($event)"
      (mousemove)="onMove($event)"
      (touchmove)="onMove($event)"
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
  @Input() isSelected: boolean = false;

  @Output() tap = new EventEmitter<void>();
  @Output() longPress = new EventEmitter<void>();

  isActive = false;
  private pressTimer: any;
  private hasMoved = false;
  private startX = 0;
  private startY = 0;
  private readonly MOVE_THRESHOLD = 10; // pixels

  startPress(event: any) {
    this.isActive = true;
    this.hasMoved = false;
    
    // Store initial touch/click position
    if (event.touches && event.touches[0]) {
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    } else {
      this.startX = event.clientX;
      this.startY = event.clientY;
    }
    
    // Long press timer
    this.pressTimer = setTimeout(() => {
      if (!this.hasMoved) {
        this.longPress.emit();
      }
      this.isActive = false;
    }, 500);
  }

  onMove(event: any) {
    if (!this.isActive) return;

    let currentX = 0;
    let currentY = 0;

    if (event.touches && event.touches[0]) {
      currentX = event.touches[0].clientX;
      currentY = event.touches[0].clientY;
    } else {
      currentX = event.clientX;
      currentY = event.clientY;
    }

    const deltaX = Math.abs(currentX - this.startX);
    const deltaY = Math.abs(currentY - this.startY);

    // If moved more than threshold, it's scrolling
    if (deltaX > this.MOVE_THRESHOLD || deltaY > this.MOVE_THRESHOLD) {
      this.hasMoved = true;
      this.isActive = false;
      if (this.pressTimer) {
        clearTimeout(this.pressTimer);
        this.pressTimer = null;
      }
    }
  }

  endPress() {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      
      // Only emit tap if it's a true tap (no movement)
      if (!this.hasMoved) {
        this.tap.emit();
      }
      
      this.pressTimer = null;
    }
    this.isActive = false;
  }
}
