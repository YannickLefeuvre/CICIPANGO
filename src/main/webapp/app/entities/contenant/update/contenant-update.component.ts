import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';

import { IContenant, Contenant } from '../contenant.model';
import { ContenantService } from '../service/contenant.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-contenant-update',
  templateUrl: './contenant-update.component.html',
  styleUrls: ['./contenant-update.component.scss'],
})
export class ContenantUpdateComponent implements OnInit {
  isSaving = false;
  account: Account | null = null;

  contenantsSharedCollection: IContenant[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    description: [],
    icone: [],
    iconeContentType: [],
    arriereplan: [],
    arriereplanContentType: [],
  });

  private readonly destroy$ = new Subject<void>();

  constructor(
    protected accountService: AccountService,
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected contenantService: ContenantService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contenant }) => {
      this.updateForm(contenant);

      this.loadRelationshipsOptions();
    });

    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.loadRelationshipsOptions();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('cipangoApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contenant = this.createFromForm();
    if (contenant.id !== undefined) {
      this.subscribeToSaveResponse(this.contenantService.update(contenant));
    } else {
      this.subscribeToSaveResponse(this.contenantService.create(contenant));
    }
  }

  trackContenantById(_index: number, item: IContenant): number {
    return item.id!;
  }

  //drag&drop

  allowDrop(ev): void {
    ev.preventDefault();
  }

  drag(ev): void {
    ev.dataTransfer.setData('text', ev.target.id);
  }

  drop(ev): void {
    ev.preventDefault();
    const data = ev.dataTransfer.getData('text');
    ev.target.appendChild(document.getElementById(data));
  }

  //drag&drop

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContenant>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(contenant: IContenant): void {
    this.editForm.patchValue({
      id: contenant.id,
      nom: contenant.nom,
      isCapital: contenant.isCapital,
      icone: contenant.icone,
      iconeContentType: contenant.iconeContentType,
      absisce: contenant.absisce,
      ordonnee: contenant.ordonnee,
      arriereplan: contenant.arriereplan,
      arriereplanContentType: contenant.arriereplanContentType,
    });

    this.contenantsSharedCollection = this.contenantService.addContenantToCollectionIfMissing(
      this.contenantsSharedCollection,
      contenant.contenant
    );
  }

  protected loadRelationshipsOptions(): void {
    this.contenantService
      .query()
      .pipe(map((res: HttpResponse<IContenant[]>) => res.body ?? []))
      .pipe(
        map((contenants: IContenant[]) =>
          this.contenantService.addContenantToCollectionIfMissing(contenants, this.editForm.get('contenant')!.value)
        )
      )
      .subscribe((contenants: IContenant[]) => (this.contenantsSharedCollection = contenants));
  }

  protected createFromForm(): IContenant {
    return {
      ...new Contenant(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      iconeContentType: this.editForm.get(['iconeContentType'])!.value,
      icone: this.editForm.get(['icone'])!.value,
      arriereplanContentType: this.editForm.get(['arriereplanContentType'])!.value,
      arriereplan: this.editForm.get(['arriereplan'])!.value,
      proprietaire: this.account,
    };
  }
}
