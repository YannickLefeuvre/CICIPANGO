import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LienCreationComponent } from './lien-creation.component';

describe('LienCreationComponent', () => {
  let component: LienCreationComponent;
  let fixture: ComponentFixture<LienCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LienCreationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LienCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
