import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoContemplationComponent } from './photo-contemplation.component';

describe('PhotoContemplationComponent', () => {
  let component: PhotoContemplationComponent;
  let fixture: ComponentFixture<PhotoContemplationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhotoContemplationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoContemplationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
