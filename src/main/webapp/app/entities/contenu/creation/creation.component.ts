import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
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
import { Contenant, IContenant } from 'app/entities/contenant/contenant.model';
import { IContenu } from '../contenu.model';
import { ContenantService } from 'app/entities/contenant/service/contenant.service';

@Component({
  selector: 'jhi-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss'],
})
export class CreationComponent implements OnInit {
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
  contenanto = new Contenant();
  contenantsSharedCollection: IContenant[] = [];

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
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected albumPhotoService: AlbumPhotoService,
    protected audioservice: AudioService,
    protected photoservice: PhotoService,
    protected filmservice: FilmService,
    protected contenantService: ContenantService,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
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

  changetruc(type: string): void {
    this.washForm();
    if (this.radioOptionSelected === type) {
      this.radioOptionSelected = '';
    } else {
      this.radioOptionSelected = type;
    }
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

  washForm(): void {
    this.contenuForm.get('texte')?.reset();
    this.contenuForm.get('idFichier')?.reset();
    this.contenuForm.get('fichier')?.reset();
    this.contenuForm.get('fichierContentType')?.reset();
    this.contenuForm.get('fichierExt')?.reset();
    this.fichiasse = [new Fichiay(10)];
  }

  NgsetAudioFileData(event: NgxDropzoneChangeEvent, field: string, fichiayForm: FormGroup): void {
    this.dataUtils.NgLoadFileAudioToForm(event, fichiayForm, field).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('cipangoApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

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
    if (this.countCharacterContenuDescri() || this.countCharacterContenuTexte()) {
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

  saveContenu(): void {
    switch (this.radioOptionSelected) {
      case 'Texte': {
        this.filmservice.saveTexte(this.contenanto, this.contenuForm, this.account);
        break;
      }
      case 'Audio': {
        this.audioservice.saveAudioMieux(this.contenanto, this.contenuForm, this.account);
        break;
      }
      case 'Image': {
        this.photoservice.savePhotoMieux(this.contenanto, this.contenuForm, this.account);
        break;
      }
      case 'Album': {
        this.albumPhotoService.saveAlbum(this.contenanto, this.fichiasse, this.contenuForm, this.account);
        break;
      }
      default: {
        break;
      }
    }
  }

  protected updateForm(contenu: IContenu): void {
    this.contenuForm.patchValue({
      id: contenu.id,
      nom: contenu.nom,
      //      url: audio.url,
      icone: contenu.icone,
      iconeContentType: contenu.iconeContentType,
      absisce: contenu.absisce,
      ordonnee: contenu.ordonnee,
      arriereplan: contenu.arriereplan,
      arriereplanContentType: contenu.arriereplanContentType,
      contenant: contenu.contenant,
    });
    this.contenantsSharedCollection = this.contenantService.addContenantToCollectionIfMissing(
      this.contenantsSharedCollection,
      contenu.contenant
    );
  }

  protected loadRelationshipsOptions(): void {
    this.contenantService
      .query()
      .pipe(map((res: HttpResponse<IContenant[]>) => res.body ?? []))
      .pipe(
        map((contenants: IContenant[]) =>
          this.contenantService.addContenantToCollectionIfMissing(contenants, this.contenuForm.get('contenant')!.value)
        )
      )
      .subscribe((contenants: IContenant[]) => (this.contenantsSharedCollection = contenants));
  }
}
