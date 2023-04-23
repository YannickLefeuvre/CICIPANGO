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
  ccreations = '#ffffff';
  cvoyages = '#ffffff';
  cnouveau = '#ffffff';
  creationactifs = true;
  voyagesactifs = false;

  private readonly destroy$ = new Subject<void>();

  constructor(protected accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  swithLaccreations(): void {
    this.ccreations = '#c71d1d';
    this.cvoyages = '#ffffff';
    this.cnouveau = '#ffffff';
    this.creationactifs = true;
    this.voyagesactifs = false;
  }

  swithLacvoyages(): void {
    this.ccreations = '#ffffff';
    this.cvoyages = '#c71d1d';
    this.cnouveau = '#ffffff';
    this.creationactifs = false;
    this.voyagesactifs = true;
  }

  swithLacnouveau(): void {
    this.ccreations = '#ffffff';
    this.cvoyages = '#ffffff';
    this.cnouveau = '#c71d1d';
  }
}
