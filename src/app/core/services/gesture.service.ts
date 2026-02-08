import { Injectable, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';

declare var Hammer: any;

@Injectable({
  providedIn: 'root'
})
export class GestureService implements OnDestroy {
  private swipeLeftSubject = new Subject<void>();
  private swipeRightSubject = new Subject<void>();

  swipeLeft$ = this.swipeLeftSubject.asObservable();
  swipeRight$ = this.swipeRightSubject.asObservable();

  private hammer: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initHammer();
    }
  }

  private initHammer() {
    try {
      const element = document.body;
      
      this.hammer = new Hammer(element, {
        cssProps: {
          userSelect: 'auto',
        },
        touchAction: 'pan-y'
      });
      
      // Configure Swipe
      this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
      
      this.hammer.on('swipeleft', (ev: any) => {
        this.swipeLeftSubject.next();
      });
      
      this.hammer.on('swiperight', (ev: any) => {
        this.swipeRightSubject.next();
      });
    } catch (e) {
      console.error('HammerJS init failed', e);
    }
  }

  ngOnDestroy() {
    if (this.hammer) {
      this.hammer.destroy();
    }
  }
}
