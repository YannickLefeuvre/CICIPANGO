import { Component, OnInit } from '@angular/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { Contenant } from 'app/entities/contenant/contenant.model';
import { Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-account-acceuil',
  templateUrl: './account-acceuil.component.html',
  styleUrls: ['./account-acceuil.component.scss'],
})
export class AccountAcceuilComponent implements OnInit {
  account: Account | null = null;
  contenants: Contenant[] | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(protected accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }
}
