import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataUtils } from 'app/core/util/data-util.service';
import { IContenant } from '../contenant.model';
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
import { AlbumPhoto } from 'app/entities/album-photo/album-photo.model';
import { MatButtonModule } from '@angular/material/button';

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
    //    protected dialogref: MatDialog,
    //    public dialog: MatDialog,
    private modalService: NgbModal //    protected activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contenant }) => {
      this.contenant = contenant;
    });
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
      return 'naze';
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
