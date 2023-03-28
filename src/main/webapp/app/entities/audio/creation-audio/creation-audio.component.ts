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
import { UploadService } from './post-audio-service.service';
import { IAudio, Audio, IFichiay, Fichiay } from '../audio.model';
import { AudioService } from '../service/audio.service';
import { IPhoto, Photo } from 'app/entities/photo/photo.model';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-creation-audio',
  templateUrl: './creation-audio.component.html',
  styleUrls: ['./creation-audio.component.scss'],
})
export class CreationAudioComponent implements OnInit {
  isSaving = false;
  contenanto = new Contenant();
  contenantsSharedCollection: IContenant[] = [];
  file: any = null;
  nbSecret?: number;
  ext?: string;
  audius?: IAudio | null;
  account: Account | null = null;

  editForm = this.fb.group({
    id: [],
    nom: [],
    description: [],
    url: [],
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
    protected audioService: AudioService,
    protected contenantService: ContenantService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected http: HttpClient,
    private uploadService: UploadService
  ) {}

  public onFilechange(event: any): void {
    this.file = event.target.files[0];

    // new
    // this.filename = event.target.files[0].name;
    // this.filecontent = await event.target.files[0].content;
  }

  //  upload():void {
  //   alert(this.file.name);
  //   if (this.file) {
  //     alert(" YEUUUUUUUUUUSH 2");
  //    this.audioService.uploadfile(this.file).subscribe(resp => {
  //       alert("Uploaded")
  //     })
  //   } else {
  //     alert("Please select a file first")
  //   }
  //  }

  //  uploadFile():void {

  //  let savefileName = this.filename + ".jpg";
  //  let saveFileContent = this.filecontent;

  //  alert(this.filename);
  //  if (this.file) {
  //    alert(" YEUUUUUUUUUUSH 2");
  //    this.audioService.uploadfile(this.file).subscribe(resp => {
  //      alert("Uploaded")
  //    })
  //  } else {
  //    alert("Please select a file first")
  //  }
  //  }

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

  sleep(ms): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async save(): Promise<void> {
    this.isSaving = true;
    const audio = this.createFromForm();
    const filu = this.createFileFromForm();
    if (filu.ext != null) {
      audio.ext = filu.ext;
    }
    //   alert("YOOOK");
    this.subscribeToSaveResponso(this.audioService.create(audio));
    while (this.audius?.id == null) {
      await this.sleep(100); // pause for 100 milliseconds before checking again
    }
    //   alert(this.photus.id);
    this.uploadFile(this.audius.id);
  }

  uploadFile(id: number): void {
    const file = this.createFileFromForm();
    file.nbSecret = this.nbSecret;
    //    alert(file.fichierContentType?.toString());
    this.subscribeToSaveResponse(this.audioService.uploadFile(file, id));
  }

  trackContenantById(_index: number, item: IContenant): number {
    return item.id!;
  }

  getRandomInt(max): number {
    return Math.floor(Math.random() * max);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAudio>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponso(result: Observable<HttpResponse<IAudio>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: (res: HttpResponse<IPhoto>) => {
        this.audius = res.body;
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

  protected updateForm(audio: IAudio): void {
    this.editForm.patchValue({
      id: audio.id,
      nom: audio.nom,
      description: audio.description,
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
      description: this.editForm.get(['description'])!.value,
      url: this.editForm.get(['url'])!.value,
      iconeContentType: this.editForm.get(['iconeContentType'])!.value,
      icone: this.editForm.get(['icone'])!.value,
      absisce: this.editForm.get(['absisce'])!.value,
      ordonnee: this.editForm.get(['ordonnee'])!.value,
      arriereplanContentType: this.editForm.get(['arriereplanContentType'])!.value,
      arriereplan: this.editForm.get(['arriereplan'])!.value,
      contenant: this.contenanto,
      type: 'AUDIO',
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
