import { Component, OnInit, ElementRef } from '@angular/core';
import { Contenant, IContenant } from 'app/entities/contenant/contenant.model';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ContenantService } from 'app/entities/contenant/service/contenant.service';

import { IAudio, Audio } from '../audio.model';
import { AudioService } from '../service/audio.service';

@Component({
  selector: 'jhi-creation-audio',
  templateUrl: './creation-audio.component.html',
  styleUrls: ['./creation-audio.component.scss'],
})
export class CreationAudioComponent implements OnInit {
  isSaving = false;
  contenanto = new Contenant();
  contenantsSharedCollection: IContenant[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [],
    url: [],
    icone: [],
    iconeContentType: [],
    absisce: [],
    ordonnee: [],
    arriereplan: [],
    arriereplanContentType: [],
    contenant: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected audioService: AudioService,
    protected contenantService: ContenantService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contenant }) => {
      this.contenanto = contenant;
      contenant = null;

      this.updateForm(contenant);

      this.loadRelationshipsOptions();
    });
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
    const audio = this.createFromForm();

    this.subscribeToSaveResponse(this.audioService.create(audio));
  }

  trackContenantById(_index: number, item: IContenant): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAudio>>): void {
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

  protected updateForm(audio: IAudio): void {
    this.editForm.patchValue({
      id: audio.id,
      nom: audio.nom,
      url: audio.url,
      icone: audio.icone,
      iconeContentType: audio.iconeContentType,
      absisce: audio.absisce,
      ordonnee: audio.ordonnee,
      arriereplan: audio.arriereplan,
      arriereplanContentType: audio.arriereplanContentType,
      contenant: audio.contenant,
    });
    this.contenantsSharedCollection = this.contenantService.addContenantToCollectionIfMissing(
      this.contenantsSharedCollection,
      audio.contenant
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

  protected createFromForm(): IAudio {
    return {
      ...new Audio(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      url: this.editForm.get(['url'])!.value,
      iconeContentType: this.editForm.get(['iconeContentType'])!.value,
      icone: this.editForm.get(['icone'])!.value,
      absisce: this.editForm.get(['absisce'])!.value,
      ordonnee: this.editForm.get(['ordonnee'])!.value,
      arriereplanContentType: this.editForm.get(['arriereplanContentType'])!.value,
      arriereplan: this.editForm.get(['arriereplan'])!.value,
      contenant: this.contenanto,
    };
  }
}
