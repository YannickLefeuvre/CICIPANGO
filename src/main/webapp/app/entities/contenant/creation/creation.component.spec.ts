import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenantCreationComponent } from './creation.component';

describe('ContenantCreationComponent', () => {
  let component: ContenantCreationComponent;
  let fixture: ComponentFixture<ContenantCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContenantCreationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContenantCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
