import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemeGestionComponent } from './systeme-gestion.component';

describe('SystemeGestionComponent', () => {
  let component: SystemeGestionComponent;
  let fixture: ComponentFixture<SystemeGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SystemeGestionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemeGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
