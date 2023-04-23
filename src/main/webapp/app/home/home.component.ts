import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Contenant, IContenant } from '../entities/contenant/contenant.model';
import { ContenantService } from '../entities/contenant/service/contenant.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataUtils } from 'app/core/util/data-util.service';
import { HttpResponse } from '@angular/common/http';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { MatDialog } from '@angular/material/dialog';
import { AudioContemplationComponent } from '../entities/audio/audio-contemplation/audio-contemplation.component';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  count = 0;
  account: Account | null = null;
  contenants?: IContenant[];
  contenantaffichay?: IContenant[];
  isLoading = false;
  arrX = [300, 700, 1100, 1200];
  arrY = [200, 800, 200, 500];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    protected contenantsService: ContenantService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected dialogref: MatDialog,
    protected contenantService: ContenantService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadAllContenant();
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  addContenantVue(concon: Contenant): void {
    this.subscribeToSaveResponse(this.contenantService.addVues(concon));
  }

  showVues(concon: Contenant): string {
    if (concon.vues != null) {
      return concon.vues.toString();
    } else {
      return '-1';
    }
  }

  loadAllContenant(): void {
    this.isLoading = true;
    this.contenantsService.query('contenant-is-null').subscribe({
      next: (res: HttpResponse<IContenant[]>) => {
        this.isLoading = false;
        this.contenants = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  openDialog(): void {
    //    alert("CHIOOOOTE");
    //    this.dialogref.open(AudioContemplationComponent)
    this.dialogref.open(AudioContemplationComponent);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clickCount(): void {
    this.count = this.count + 1;
  }

  siContenantAContenant(contenant: Contenant): boolean {
    if (contenant.contenant == null) {
      return true;
    } else {
      return false;
    }
  }

  nomAccount(): string {
    return this.account?.firstName ?? '';
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContenant>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveFinalize(): void {
    //      alert("Passay !!");
  }

  protected onSaveSuccess(): void {
    //      alert("YOUPI");
  }

  protected onSaveError(): void {
    //      alert("TROP NAZE");
  }
}
