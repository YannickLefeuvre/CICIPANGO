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
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { Fichiay, IAudio, IFichiay } from 'app/entities/audio/audio.model';
import { AlbumPhoto, IAlbumPhoto } from 'app/entities/album-photo/album-photo.model';
import { AlbumPhotoService } from 'app/entities/album-photo/service/album-photo.service';
import { AudioService } from 'app/entities/audio/service/audio.service';

@Component({
  selector: 'jhi-contenant-update',
  templateUrl: './contenant-update.component.html',
  styleUrls: ['./contenant-update.component.scss'],
})
export class ContenantUpdateComponent implements OnInit {
  isSaving = false;
  account: Account | null = null;
  squareLeft = 0;
  ajout = false;
  intervalId: any;
  radioOptionSelected = '';
  typeContenu = ['Audio', 'Image', 'Texte', 'Album'];
  fichiasse = [new Fichiay(10)];
  albibo?: IAlbumPhoto | null;
  nbFilesup = 0;
  contenant: Contenant | null = null;

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

  contenuForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    description: [],
    icone: [],
    iconeContentType: [],
    arriereplan: [],
    arriereplanContentType: [],
    texte: [],
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
    protected contenantService: ContenantService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected albumPhotoService: AlbumPhotoService,
    protected audioservice: AudioService,
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

  NgsetFileData(event: NgxDropzoneChangeEvent, field: string, isImage: boolean): void {
    this.dataUtils.ngLoadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('cipangoApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  NgsetContenuFileData(event: NgxDropzoneChangeEvent, field: string, isImage: boolean): void {
    this.dataUtils.ngLoadFileToForm(event, this.contenuForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('cipangoApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  NgsetAudioFileData(event: NgxDropzoneChangeEvent, field: string, isImage: boolean): void {
    this.dataUtils.NgLoadFileAudioToForm(event, this.contenuForm, field, isImage).subscribe({
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
    this.subscribeToSaveResponse(this.contenantService.create(contenant));
  }

  trackContenantById(_index: number, item: IContenant): number {
    return item.id!;
  }

  saveContenu(contenantu: Contenant | null): void {
    if (contenantu == null) {
      return;
    }

    switch (this.radioOptionSelected) {
      //      case "Texte": {
      //         return "Ton truc c'est l'écriture ? Entre ta nouvelle, essaie, poésie, ...";
      //         break;
      //      }
      case 'Audio': {
        this.audioservice.saveAudio(contenantu, this.contenuForm, this.account);
        break;
      }
      //      case "Image": {
      //        return "Photographe dans l'âme ? Montre ton plus grand chef d'oeuvre";
      //        break;
      //    }
      case 'Album': {
        this.albumPhotoService.saveAlbum(contenantu, this.fichiasse, this.contenuForm, this.account);
        break;
      }
      default: {
        break;
      }
    }
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

  onFileSelected(event: any): void {
    const files: File[] = event.addedFiles;
    // Faites quelque chose avec les fichiers sélectionnés, comme les télécharger sur un serveur
  }

  startMoving(): void {
    let total = 0;

    this.intervalId = setInterval(() => {
      this.squareLeft -= 70; // déplacement de 10 pixels vers la droite à chaque itération
      total -= 400;
      //      if(total<=2000){
      //        this.stopMoving();
      //      }
    }, 10); // délai de 50 millisecondes entre chaque itération
  }

  stopMoving(): void {
    clearInterval(this.intervalId);
  }

  ajoutContenant(): void {
    this.ajout = true;
  }

  optionChoisie(): string {
    switch (this.radioOptionSelected) {
      case 'Texte': {
        return "Ton truc c'est l'écriture ? Entre ta nouvelle, essaie, poésie, ...";
        break;
      }
      case 'Audio': {
        return "Une voix d'ange ? Fais en profiter tous le monde";
        break;
      }
      case 'Image': {
        return "Photographe dans l'âme ? Montre ton plus grand chef d'oeuvre";
        break;
      }
      case 'Album': {
        return "Une inséparable collection d'image ?";
        break;
      }
      default: {
        return '';
        break;
      }
    }
  }

  //drag&drop

  setFilesData(event: NgxDropzoneChangeEvent, field: string, isImage: boolean): void {
    this.dataUtils.NgLoadFichiayToFichiasse(event, this.fichiasse).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('cipangoApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  protected subscribeToSaveResponso(result: Observable<HttpResponse<IAlbumPhoto>>): any {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      //     next: () => this.onSaveSuccess(),
      next: (res: HttpResponse<IAlbumPhoto>) => {
        this.albibo = res.body;
      },
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponseAlbum(result: Observable<HttpResponse<IFichiay>>): any {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: (res: HttpResponse<IFichiay>) => (this.nbFilesup = this.nbFilesup + 1),

      error: () => this.onSaveError(),
    });
  }

  protected createFileFromForm(): IFichiay {
    return {
      ...new Fichiay(),
      id: this.contenuForm.get(['idFichier'])!.value,
      nom: ' YEUUUUUSH ',
      fichier: this.contenuForm.get(['fichier'])!.value,
      fichierContentType: this.contenuForm.get(['fichierContentType'])!.value,
      ext: this.contenuForm.get(['fichierExt'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContenant>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      //YAYA

      next: (res: HttpResponse<IContenant>) => this.saveContenu(res.body),
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
