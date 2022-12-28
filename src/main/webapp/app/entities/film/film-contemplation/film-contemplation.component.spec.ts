import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmContemplationComponent } from './film-contemplation.component';

describe('FilmContemplationComponent', () => {
  let component: FilmContemplationComponent;
  let fixture: ComponentFixture<FilmContemplationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilmContemplationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilmContemplationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
