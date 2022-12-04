import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationAlbumPhotoComponent } from './creation-album-photo.component';

describe('CreationAlbumPhotoComponent', () => {
  let component: CreationAlbumPhotoComponent;
  let fixture: ComponentFixture<CreationAlbumPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreationAlbumPhotoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationAlbumPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
