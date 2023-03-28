import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataUtils } from 'app/core/util/data-util.service';
import { Contenant, IContenant } from '../contenant.model';
import { FormBuilder, Validators } from '@angular/forms';
import { IContenu, Contenu } from '../../contenu/contenu.model';
import { ContenuService } from '../../contenu/service/contenu.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';
import { AudioContemplationComponent } from '../../audio/audio-contemplation/audio-contemplation.component';
import { AlbumPhotoContemplationComponent } from 'app/entities/album-photo/album-photo-contemplation/album-photo-contemplation.component';
import { ContenantDetailComponent } from '../detail/contenant-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Audio } from 'app/entities/audio/audio.model';
import { AlbumPhoto, IListeFichiers, ListeFichiers } from 'app/entities/album-photo/album-photo.model';
import { MatButtonModule } from '@angular/material/button';
import { Photo } from 'app/entities/photo/photo.model';
import { PhotoContemplationComponent } from 'app/entities/photo/photo-contemplation/photo-contemplation.component';
import { Film } from 'app/entities/film/film.model';
import { FilmContemplationComponent } from 'app/entities/film/film-contemplation/film-contemplation.component';
import { ILien, Lien } from 'app/entities/lien/lien.model';
import { LienService } from 'app/entities/lien/service/lien.service';
import { AlbumPhotoService } from 'app/entities/album-photo/service/album-photo.service';

@Component({
  selector: 'jhi-systeme',
  templateUrl: './systeme.component.html',
  styleUrls: ['./systeme.component.scss'],
})
export class SystemeComponent implements OnInit {
  // @Input() audio;
  // @Input() yuyu  = " frdes";
  contenant: IContenant | null = null;
  isSaving = false;
  @Input() monInput: any;

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
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
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected contenuService: ContenuService,
    protected lienService: LienService,
    //    protected dialogref: MatDialog,
    //    public dialog: MatDialog,
    protected albumPhotoService: AlbumPhotoService,
    private modalService: NgbModal //    protected activeModal: NgbActiveModal,
  ) {
    //  activatedRoute.params.subscribe(val => {
    //    alert(val);
    activatedRoute.data.subscribe(({ contenant }) => {
      this.contenant = contenant;
      //    });
      this.loadLiens();
    });
  }

  ngOnInit(): void {
    //    alert("YO");
    this.activatedRoute.data.subscribe(({ contenant }) => {
      this.contenant = contenant;
    });
    this.loadLiens();
    this.loadToff();
  }

  ngOnChanges(): void {
    // Récupération des données à chaque fois que l'input "monInput" est modifié
    this.loadLiens();
  }

  loadLiens(): void {
    //    alert("KIKI");
    if (this.contenant?.liens != null) {
      //      alert("COUCOU");
      for (let i = 0; i < this.contenant.liens.length; i++) {
        //     this.contenant.liens[i] = this.lienService.
        this.lienService.find(this.contenant.liens[i].id ?? 0).subscribe({
          next: (res: HttpResponse<ILien>) => {
            if (this.contenant?.liens != null) {
              this.contenant.liens[i] = res.body as ILien;
            }
          },
          error: () => {
            this.isSaving = false;
          },
        });
      }
    }
  }

  save(): void {
    this.isSaving = true;
    const contenu = this.createFromForm();
    if (contenu.id !== undefined) {
      this.subscribeToSaveResponse(this.contenuService.update(contenu));
    } else {
      this.subscribeToSaveResponse(this.contenuService.create(contenu));
    }
  }

  type(contenu: Contenu): string {
    if (contenu.type != null) {
      return contenu.type;
    } else {
      return '';
    }
  }

  nomContenant(): string {
    if (this.contenant != null) {
      if (this.contenant.nom != null) {
        return this.contenant.nom;
      }
    }
    return '';
  }

  proprioContenant(): string {
    return this.contenant?.proprietaire?.firstName ?? '';
  }

  nomContenantDuContenant(): string {
    if (this.contenant != null) {
      if (this.contenant.contenant != null) {
        return this.contenant.contenant.nom ?? '';
      }
    }
    return '';
  }

  idContenantDuContenant(): number {
    if (this.contenant != null) {
      if (this.contenant.contenant != null) {
        return this.contenant.contenant.id ?? 0;
      }
    }
    return 0;
  }

  trackId(_index: number, item: ILien): number {
    return item.id!;
  }

  villeCibleLien(lien: Lien): string {
    if (lien.villeCible?.nom != null) {
      return lien.villeCible.nom;
    }

    return '';
  }

  nbLiens(): number {
    if (this.contenant != null) {
      if (this.contenant.liens != null) {
        return this.contenant.liens.length;
      } else {
        return -1;
      }
    }
    return -2;
  }

  previousState(): void {
    window.history.back();
  }

  //  openDialog(): any {
  //   alert(" HOOOOO ");
  //   const dialogRef =
  // this.modalService.open(AudioContemplationComponent, {
  //  centered: true,
  //  size:""
  // });}

  openAudioDialog(audi: Audio): any {
    const modalRef = this.modalService.open(AudioContemplationComponent, {
      centered: true,
      //  size:""
    });
    modalRef.componentInstance.audio = audi;
  }

  openAlbumPhotoDialog(albu: AlbumPhoto): any {
    const modalRef = this.modalService.open(AlbumPhotoContemplationComponent, {
      centered: true,
      //  size:""
    });
    modalRef.componentInstance.album = albu;
  }

  openPhotoDialog(photo: Photo): any {
    const modalRef = this.modalService.open(PhotoContemplationComponent, {
      centered: true,
      //  size:""
    });
    modalRef.componentInstance.photo = photo;
  }

  cheminPhoto(photo: Photo): string {
    const result = '';
    const chmin = 'src/main/webapp/content/photos/bibi';
    if (photo.id != null && photo.ext != null) {
      //   alert(result.concat(chmin,this.audio.id.toString(),"mp3"));
      return result.concat(chmin, photo.id.toString(), '.', photo.ext);
    } else {
      return 'naze';
    }
  }

  loadToff(): void {
    if (this.contenant?.contenus?.length != null) {
      for (let i = 0; i < this.contenant.contenus.length; i++) {
        if (this.contenant.contenus[i].type === 'ALBUMPHOTO') {
          this.trouveChemin(this.contenant.contenus[i]);
        }
      }
    }
  }

  trouveChemin(album: AlbumPhoto): void {
    this.albumPhotoService.findFichiers(album.id ?? 0).subscribe({
      next: (res: HttpResponse<IListeFichiers>) => {
        //   album.cheminsPhotos = res.body?.nomsFichiers;
        this.ajouterCheminAlbumPhoto(album, res.body);
      },
      error: () => {
        this.isSaving = false;
      },
    });
  }

  ajouterCheminAlbumPhoto(album: AlbumPhoto, liste: IListeFichiers | null): void {
    album.cheminsPhotos = liste?.nomsFichiers;
  }

  cheminAlbum(album: AlbumPhoto): string {
    if (album.cheminsPhotos != null) {
      return (
        'src/main/webapp/content/albumphoto/bibi' +
        (album.id ?? 0).toString() +
        '/' +
        album.cheminsPhotos[Math.floor(Math.random() * album.cheminsPhotos.length)]
      );
    }
    return 'null';
  }

  openFilmDialog(film: Film): any {
    const modalRef = this.modalService.open(FilmContemplationComponent, {
      centered: true,
      //  size:""
    });
    modalRef.componentInstance.film = film;
  }

  protected createFromForm(): IContenu {
    return {
      ...new Contenu(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      iconeContentType: this.editForm.get(['iconeContentType'])!.value,
      icone: this.editForm.get(['icone'])!.value,
      absisce: this.editForm.get(['absisce'])!.value,
      ordonnee: this.editForm.get(['ordonnee'])!.value,
      arriereplanContentType: this.editForm.get(['arriereplanContentType'])!.value,
      arriereplan: this.editForm.get(['arriereplan'])!.value,
      contenant: this.editForm.get(['contenant'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContenu>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }
}
