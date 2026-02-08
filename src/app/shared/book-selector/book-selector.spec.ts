import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSelector } from './book-selector';

describe('BookSelector', () => {
  let component: BookSelector;
  let fixture: ComponentFixture<BookSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
