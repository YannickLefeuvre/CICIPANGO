import { Component, OnInit, ElementRef } from '@angular/core';
import { Contenant, IContenant } from 'app/entities/contenant/contenant.model';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ContenantService } from 'app/entities/contenant/service/contenant.service';
import { IFichiay, Fichiay } from '../../audio/audio.model';
import { PhotoService } from '../service/photo.service';
import { IPhoto, Photo } from '../photo.model';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-photo-creation',
  templateUrl: './photo-creation.component.html',
  styleUrls: ['./photo-creation.component.scss'],
})
export class PhotoCreationComponent implements OnInit {
  isSaving = false;
  contenanto = new Contenant();
  contenantsSharedCollection: IContenant[] = [];
  file: any = null;
  nbSecret?: number;
  ext?: string;
  photus?: IPhoto | null;
  account: Account | null = null;

  editForm = this.fb.group({
    id: [],
    nom: [],
    url: [],
    description: [],
    icone: [],
    iconeContentType: [],
    absisce: [],
    ordonnee: [],
    arriereplan: [],
    arriereplanContentType: [],
    contenant: [],
    idFichier: [],
    fichier: [],
    fichierContentType: [],
    fichierExt: [],
  });

  private readonly destroy$ = new Subject<void>();

  constructor(
    protected accountService: AccountService,
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected photoService: PhotoService,
    protected contenantService: ContenantService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected http: HttpClient
  ) {}

  public onFilechange(event: any): void {
    //    alert("huhk");
    this.file = event.target.files[0];
    //      this.ext = this.file.ext;
    //      alert(this.ext);
  }

  ngOnInit(): void {
    this.nbSecret = this.getRandomInt(100000000);
    this.activatedRoute.data.subscribe(({ contenant }) => {
      this.contenanto = contenant;
      contenant = null;

      this.updateForm(contenant);
      this.loadRelationshipsOptions();
    });

    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileAudioToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('cipangoApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  setFileDota(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileAudioToForm(event, this.editForm, field, isImage).subscribe({
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

  getRandomInt(max): number {
    return Math.floor(Math.random() * max);
  }

  previousState(): void {
    window.history.back();
  }

  sleep(ms): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async save(): Promise<void> {
    this.isSaving = true;
    const photo = this.createFromForm();
    const filu = this.createFileFromForm();
    if (filu.ext != null) {
      photo.ext = filu.ext;
    }

    //  this.subscribeToSaveResponse(this.photoService.create(photo));
    this.subscribeToSaveResponso(this.photoService.create(photo));
    while (this.photus?.id == null) {
      await this.sleep(100); // pause for 100 milliseconds before checking again
    }

    this.uploadFile(this.photus.id);
  }

  uploadFile(id: number): void {
    const filu = this.createFileFromForm();
    filu.nbSecret = this.nbSecret;

    //    alert(file.fichierContentType?.toString());
    this.subscribeFileToSaveResponse(this.photoService.uploadFile(filu, id));
  }

  trackContenantById(_index: number, item: IContenant): number {
    return item.id!;
  }

  protected subscribeFileToSaveResponse(result: Observable<HttpResponse<IFichiay>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPhoto>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponso(result: Observable<HttpResponse<IPhoto>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: (res: HttpResponse<IPhoto>) => {
        this.photus = res.body;
      },
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

  protected updateForm(photo: IPhoto): void {
    this.editForm.patchValue({
      id: photo.id,
      nom: photo.nom,
      //      url: audio.url,
      icone: photo.icone,
      iconeContentType: photo.iconeContentType,
      absisce: photo.absisce,
      ordonnee: photo.ordonnee,
      arriereplan: photo.arriereplan,
      arriereplanContentType: photo.arriereplanContentType,
      contenant: photo.contenant,
    });
    this.contenantsSharedCollection = this.contenantService.addContenantToCollectionIfMissing(
      this.contenantsSharedCollection,
      photo.contenant
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

  protected createFromForm(): IPhoto {
    return {
      ...new Photo(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      //      url: this.editForm.get(['url'])!.value,
      description: this.editForm.get(['description'])!.value,
      iconeContentType: this.editForm.get(['iconeContentType'])!.value,
      icone: this.editForm.get(['icone'])!.value,
      absisce: this.editForm.get(['absisce'])!.value,
      ordonnee: this.editForm.get(['ordonnee'])!.value,
      arriereplanContentType: this.editForm.get(['arriereplanContentType'])!.value,
      arriereplan: this.editForm.get(['arriereplan'])!.value,
      contenant: this.contenanto,
      type: 'PHOTO',
      nbSecret: this.nbSecret,
      createur: this.account,
    };
  }

  protected createFileFromForm(): IFichiay {
    return {
      ...new Fichiay(),
      id: this.editForm.get(['idFichier'])!.value,
      nom: ' YEUUUUUSH ',
      fichier: this.editForm.get(['fichier'])!.value,
      fichierContentType: this.editForm.get(['fichierContentType'])!.value,
      ext: this.editForm.get(['fichierExt'])!.value,
    };
  }
}
