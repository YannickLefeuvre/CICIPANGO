import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationAudioComponent } from './creation-audio.component';

describe('CreationAudioComponent', () => {
  let component: CreationAudioComponent;
  let fixture: ComponentFixture<CreationAudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreationAudioComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
