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

  startPress(event: Event) {
    this.isActive = true;
    this.hasMoved = false;
    
    // Long press timer
    this.pressTimer = setTimeout(() => {
      this.longPress.emit();
      this.isActive = false;
    }, 500); // Reduced to 500ms for better UX
  }

  endPress() {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      
      // If timer is still active, it's a tap (not a long press)
      if (!this.hasMoved) {
        this.tap.emit();
      }
      
      this.pressTimer = null;
    }
    this.isActive = false;
  }
}
