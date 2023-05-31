import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

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
import { PhotoService } from 'app/entities/photo/service/photo.service';
import { FilmService } from 'app/entities/film/service/film.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'jhi-contenant-update',
  templateUrl: './contenant-update.component.html',
  styleUrls: ['./contenant-update.component.scss'],
})
export class ContenantUpdateComponent implements OnInit {
  @ViewChild('conteneur') conteneurRef!: ElementRef;
  @ViewChild('contenu') contenuRef!: ElementRef;

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
  scrollPosition = 0;
  seuilMaxiTexte = 60000;
  erreurFichiasse = false;

  contenantsSharedCollection: IContenant[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    description: [],
    icone: [],
    iconeContentType: [],
    arriereplan: [],
    arriereplanContentType: [],

    idFichierarriereplan: [],
    fichierarriereplan: [],
    fichierarriereplanContentType: [],
    fichierarriereplanExt: [],

    idFichiericone: [],
    fichiericone: [],
    fichiericoneContentType: [],
    fichiericoneExt: [],
  });

  contenuForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    description: [],
    texte: [],
    contenant: [],
    idFichier: [],
    fichier: [],
    fichierNom: [],
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
    protected photoservice: PhotoService,
    protected filmservice: FilmService,
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

  NgsetFileData(event: NgxDropzoneChangeEvent, field: string, isImage: boolean, fichiayForm: FormGroup): void {
    this.dataUtils.ngLoadFileToForm(event, fichiayForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('cipangoApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  NgsetAudioFileData(event: NgxDropzoneChangeEvent, field: string, fichiayForm: FormGroup): void {
    this.dataUtils.NgLoadFileAudioToForm(event, fichiayForm, field).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('cipangoApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  changetruc(type: string): void {
    this.washForm();
    if (this.radioOptionSelected === type) {
      this.radioOptionSelected = '';
    } else {
      this.radioOptionSelected = type;
    }
  }

  washForm(): void {
    this.contenuForm.get('texte')?.reset();
    this.contenuForm.get('idFichier')?.reset();
    this.contenuForm.get('fichier')?.reset();
    this.contenuForm.get('fichierContentType')?.reset();
    this.contenuForm.get('fichierExt')?.reset();
    this.fichiasse = [new Fichiay(10)];
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

  isNomnull(): boolean {
    if (this.ajout === true) {
      return false;
    }

    if (this.editForm.get(['nom'])!.value === '' || this.editForm.get(['nom'])!.value === undefined) {
      return true;
    } else {
      return false;
    }
  }

  sleep(ms): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async saveOld(): Promise<void> {
    const contenant = this.createFromForm();
    const filuAP = this.createFileFromForm('arriereplan', this.editForm);
    const filuI = this.createFileFromForm('icone', this.editForm);
    this.subscribeToSaveResponse(this.contenantService.create(contenant));
    while (this.contenant?.id == null) {
      await this.sleep(100); // pause for 100 milliseconds before checking again
    }
    this.uploadFichiayAP(this.contenant.id, filuAP);
    this.uploadFichiayI(this.contenant.id, filuI);
  }

  deplacerContenu(): void {
    const contenu = document.getElementById('contenuti');
    //  contenu?.classList.toggle("deplace-gauche");
    if (contenu?.scrollLeft !== undefined) {
      contenu.scrollLeft += 800;
    }
  }

  scrollHorizontal(): void {
    //   const conteneurElement = this.conteneur.nativeElement;
    const conteneurElement = document.getElementById('contenuti');
    const distance = 1800; // Distance de défilement en pixels
    const duration = 5; // Durée du défilement en millisecondes
    const fps = 30; // Nombre de frames par seconde pour une animation fluide
    const interval = duration / fps;
    const increment = distance / (duration / interval);
    let elapsedTime = 0;
    if (conteneurElement?.scrollLeft !== undefined) {
      let currentScrollLeft = conteneurElement.scrollLeft;

      const scrolltrankill = (): void => {
        if (elapsedTime < duration) {
          elapsedTime += interval;
          currentScrollLeft += increment;
          conteneurElement.scrollLeft = currentScrollLeft;
          setTimeout(scrolltrankill, interval);
        }
      };

      scrolltrankill();
    }
  }

  defilerVersDroite(): void {
    const conteneur: HTMLElement = this.conteneurRef.nativeElement;
    const contenu: HTMLElement = this.contenuRef.nativeElement;

    const deplacement: number = contenu.offsetWidth - conteneur.offsetWidth;
    alert(deplacement);
    if (deplacement > 0) {
      const position: number = conteneur.scrollLeft + deplacement;
      alert('position');
      alert(position);
      conteneur.scrollTo({
        left: position,
        behavior: 'smooth',
      });
    }
  }

  save(): void {
    const contenant = this.createFromForm();
    this.subscribeToSaveContenant(this.contenantService.create(contenant));
  }

  uploadleReste(contenant: Contenant | null): void {
    if (contenant?.id == null) {
      return;
    }
    if (this.editForm.get('fichierarriereplan')?.value != null) {
      const filuAP = this.createFileFromForm('arriereplan', this.editForm);
      this.uploadFichiayAP(contenant.id, filuAP);
    }

    if (this.editForm.get('fichiericone')?.value != null) {
      const filuI = this.createFileFromForm('icone', this.editForm);
      this.uploadFichiayI(contenant.id, filuI);
    }

    this.saveContenu(contenant);
  }

  uploadFichiayAP(id: number, file: IFichiay): void {
    //    alert(file.fichierContentType?.toString());
    this.subscribeToSaveResponse(this.contenantService.uploadFileAP(file, id));
  }

  uploadFichiayI(id: number, file: IFichiay): void {
    //    alert(file.fichierContentType?.toString());
    this.subscribeToSaveResponse(this.contenantService.uploadFileI(file, id));
  }

  saveContenant(): void {
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
      case 'Texte': {
        this.filmservice.saveTexte(contenantu, this.contenuForm, this.account);
        break;
      }
      case 'Audio': {
        this.audioservice.saveAudioMieux(contenantu, this.contenuForm, this.account);
        break;
      }
      case 'Image': {
        this.photoservice.savePhotoMieux(contenantu, this.contenuForm, this.account);
        break;
      }
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

  ajoutContenant(): void {
    this.ajout = true;
    //    this.deplacerContenu();
    this.scrollHorizontal();
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
    const files: File[] = event.addedFiles;
    if (files.length > 10) {
      this.erreurFichiasse = true;
    } else {
      this.erreurFichiasse = false;
      this.dataUtils.NgLoadFichiayToFichiasse(event, this.fichiasse).subscribe({
        error: (err: FileLoadError) =>
          this.eventManager.broadcast(new EventWithContent<AlertError>('cipangoApp.error', { ...err, key: 'error.file.' + err.key })),
      });
    }
  }

  contenuIsNotNull(): boolean {
    if (this.countCharacterContenuDescri() || this.countCharacterContenuTexte() || this.countCharactersContenant()) {
      return false;
    }

    if (this.contenuForm.get('nom')?.value === null) {
      return false;
    }

    switch (this.radioOptionSelected) {
      case '': {
        return false;
      }
      case 'Texte': {
        if (this.contenuForm.get('texte')?.value !== null) {
          return true;
        }
        break;
      }
      case 'Album': {
        if (this.fichiasse[0].fichierContentType !== undefined) {
          return true;
        }
        break;
      }
      default: {
        if (this.contenuForm.get('fichierContentType')?.value !== null) {
          return true;
        }
      }
    }
    return false;
  }

  countCharactersContenant(): boolean {
    if ((this.editForm.get('description')?.value?.length ?? 0) > this.seuilMaxiTexte) {
      return true;
    } else {
      return false;
    }
  }

  countCharacterContenuDescri(): boolean {
    if ((this.contenuForm.get('description')?.value?.length ?? 0) > this.seuilMaxiTexte) {
      return true;
    }
    return false;
  }

  countCharacterContenuTexte(): boolean {
    if ((this.contenuForm.get('texte')?.value?.length ?? 0) > this.seuilMaxiTexte) {
      return true;
    }
    return false;
  }

  protected subscribeToSaveFichiayI(result: Observable<HttpResponse<IContenant>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      //YAYA

      next: (res: HttpResponse<IContenant>) => this.saveContenu(res.body),
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveFichiayAP(result: Observable<HttpResponse<IContenant>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      //YAYA

      next: (res: HttpResponse<IContenant>) => this.saveContenu(res.body),
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveContenant(result: Observable<HttpResponse<IContenant>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      //YAYA
      next: (res: HttpResponse<IContenant>) => this.uploadleReste(res.body),
      error: () => this.onSaveError(),
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

  protected createFileFromForm(type: string, form: FormGroup): IFichiay {
    return {
      //YAYA verif form
      ...new Fichiay(),
      id: form.get(['idFichier' + type])!.value,
      nom: ' YEUUUUUSH ',
      fichier: form.get(['fichier' + type])!.value,
      fichierContentType: form.get(['fichier' + type + 'ContentType'])!.value,
      ext: form.get(['fichier' + type + 'Ext'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContenant>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      //YAYA

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
      iconeContentType: this.editForm.get(['fichiericoneExt'])!.value,
      arriereplanContentType: this.editForm.get(['fichierarriereplanExt'])!.value,
      proprietaire: this.account,
    };
  }
}
