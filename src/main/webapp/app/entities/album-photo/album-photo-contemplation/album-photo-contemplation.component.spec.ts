import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumPhotoContemplationComponent } from './album-photo-contemplation.component';

describe('AlbumPhotoContemplationComponent', () => {
  let component: AlbumPhotoContemplationComponent;
  let fixture: ComponentFixture<AlbumPhotoContemplationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlbumPhotoContemplationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumPhotoContemplationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
