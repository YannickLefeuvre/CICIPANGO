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
import { AlbumPhoto, IAlbumPhoto } from '../album-photo.model';
import { AlbumPhotoService } from '../service/album-photo.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-creation-album-photo',
  templateUrl: './creation-album-photo.component.html',
  styleUrls: ['./creation-album-photo.component.scss'],
})
export class CreationAlbumPhotoComponent implements OnInit {
  selectedFiles?: FileList;
  isSaving = false;
  contenanto = new Contenant();
  contenantsSharedCollection: IContenant[] = [];
  fichiasse = [new Fichiay(10)];
  nbSecret?: number;
  albibo?: IAlbumPhoto | null;
  nbFilesup = 0;
  fichiayto = new Fichiay();
  account: Account | null = null;

  editForm = this.fb.group({
    id: [],
    nom: [],
    description: [],
    urls: [],
    icone: [],
    iconeContentType: [],
    absisce: [],
    ordonnee: [],
    arriereplan: [],
    arriereplanContentType: [],
    contenant: [],
  });

  private readonly destroy$ = new Subject<void>();

  constructor(
    protected accountService: AccountService,
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected albumPhotoService: AlbumPhotoService,
    protected contenantService: ContenantService,
    protected activatedRoute: ActivatedRoute,
    protected elementRef: ElementRef,
    protected fb: FormBuilder,
    protected http: HttpClient
  ) {}

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

  public onFilechange(event: any): void {
    // this.file = event.target.files[0];
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

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFilesData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFichiayToFichiasse(event, this.fichiasse).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('cipangoApp.error', { ...err, key: 'error.file.' + err.key })),
    });
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

  trackContenantById(_index: number, item: IContenant): number {
    return item.id!;
  }

  sleep(ms): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async uploadFiles(): Promise<void> {
    const album = this.createFromForm();

    await this.subscribeToSaveResponso(this.albumPhotoService.create(album));

    for (let i = 0; i < this.fichiasse.length; i++) {
      this.fichiasse[i].nbSecret = this.nbSecret;
      //                  alert(this.fichiasse.length);
      const coupay = this.fichiasse[i].ext;
      if (coupay != null) {
        this.fichiasse[i].ext = coupay;
      }

      while (this.albibo?.id == null) {
        await this.sleep(100); // pause for 100 milliseconds before checking again
      }
      while (this.nbFilesup < i) {
        await this.sleep(100); // pause for 100 milliseconds before checking again
      }

      await this.subscribeToSaveResponse(this.albumPhotoService.uploadFile(this.fichiasse[i], this.albibo.id));
    }
    while (this.nbFilesup < this.fichiasse.length) {
      await this.sleep(100); // pause for 100 milliseconds before checking again
    }
    //             alert(this.nbFilesup);
    //        await this.sleep(10000);
    this.previousState();
  }

  save(): void {
    let ext = '';

    for (let i = 0; i < this.fichiasse.length; i++) {
      this.fichiasse[i].nbSecret = this.nbSecret;

      //     if(this.fichiasse[i].fichierContentType != null ){
      const coupay = this.fichiasse[i].ext;
      if (coupay != null) {
        ext += coupay + ',';
      }
      //      alert(ext);
    }
    ext += ' ';

    //      alert(ext);

    this.isSaving = true;
    //    const album = this.createFromForm();
    //    album.ext = ext;
    //   alert("HUUUUU")
    //   const albu =  this.albumPhotoService.create(album);
    //   this.subscribeToSaveResponso(this.albumPhotoService.create(album));
    //    alert("  YOUP YOUP ");
    this.uploadFiles();
  }

  getRandomInt(max): number {
    return Math.floor(Math.random() * max);
  }

  protected updateForm(albumPhoto: AlbumPhoto): void {
    this.editForm.patchValue({
      id: albumPhoto.id,
      nom: albumPhoto.nom,
      description: albumPhoto.description,
      icone: albumPhoto.icone,
      iconeContentType: albumPhoto.iconeContentType,
      absisce: albumPhoto.absisce,
      ordonnee: albumPhoto.ordonnee,
      arriereplan: albumPhoto.arriereplan,
      arriereplanContentType: albumPhoto.arriereplanContentType,
      contenant: albumPhoto.contenant,
    });
    this.contenantsSharedCollection = this.contenantService.addContenantToCollectionIfMissing(
      this.contenantsSharedCollection,
      albumPhoto.contenant
    );
  }

  protected subscribeToSaveResponso(result: Observable<HttpResponse<IAlbumPhoto>>): any {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      //     next: () => this.onSaveSuccess(),
      next: (res: HttpResponse<IAlbumPhoto>) => {
        this.albibo = res.body;

        //      alert("HAAA");
        //  this.remplissageArray();
        // this.onSaveSuccesso()
      },
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFichiay>>): any {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: (res: HttpResponse<IFichiay>) => (this.nbFilesup = this.nbFilesup + 1),
      //      alert("HAAA");
      //  this.remplissageArray();
      //},
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccesso(): void {
    this.uploadFiles();
    // this.previousState();
  }

  protected onSaveSuccess(): void {
    //   this.uploadFiles();
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
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

  protected createFromForm(): IAlbumPhoto {
    return {
      ...new AlbumPhoto(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      description: this.editForm.get(['description'])!.value,
      iconeContentType: this.editForm.get(['iconeContentType'])!.value,
      icone: this.editForm.get(['icone'])!.value,
      absisce: this.editForm.get(['absisce'])!.value,
      ordonnee: this.editForm.get(['ordonnee'])!.value,
      arriereplanContentType: this.editForm.get(['arriereplanContentType'])!.value,
      arriereplan: this.editForm.get(['arriereplan'])!.value,
      contenant: this.contenanto,
      type: 'ALBUMPHOTO',
      nbPhotos: this.fichiasse.length,
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
