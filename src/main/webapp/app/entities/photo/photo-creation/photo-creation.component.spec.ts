import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoCreationComponent } from './photo-creation.component';

describe('AudioCreationComponent', () => {
  let component: PhotoCreationComponent;
  let fixture: ComponentFixture<PhotoCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhotoCreationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
