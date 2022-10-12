import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioContemplationComponent } from './audio-contemplation.component';

describe('AudioContemplationComponent', () => {
  let component: AudioContemplationComponent;
  let fixture: ComponentFixture<AudioContemplationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioContemplationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioContemplationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
