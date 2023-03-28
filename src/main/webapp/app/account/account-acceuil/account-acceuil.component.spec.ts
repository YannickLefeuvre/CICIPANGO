import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAcceuilComponent } from './account-acceuil.component';

describe('AccountAcceuilComponent', () => {
  let component: AccountAcceuilComponent;
  let fixture: ComponentFixture<AccountAcceuilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountAcceuilComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAcceuilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
