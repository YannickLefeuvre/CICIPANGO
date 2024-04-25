import { Component, OnInit, ElementRef } from '@angular/core';
import { Contenant, IContenant } from 'app/entities/contenant/contenant.model';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ContenantService } from 'app/entities/contenant/service/contenant.service';
import { ILien, Lien } from '../lien.model';
import { LienService } from '../service/lien.service';

@Component({
  selector: 'jhi-lien-creation',
  templateUrl: './lien-creation.component.html',
  styleUrls: ['./lien-creation.component.scss'],
})
export class LienCreationComponent implements OnInit {
  contenanto = new Contenant();
  contenanta = new Contenant();
  isSaving = false;
  contenantsSharedCollection: IContenant[] = [];
  contenants?: IContenant[];
  isLoading = false;
  lecoco = '';
  couleurOK = '#5ce649';
  couleurKO = '#ff8a5c';
  couleurAffiche = '';

  editForm = this.fb.group({
    nom: [],
    lekow: [],
    villeOrigine: [],
    villeCible: [],
    contenant: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected lienService: LienService,
    protected contenantService: ContenantService,
    protected fb: FormBuilder,
    protected http: HttpClient
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contenant }) => {
      this.contenanto = contenant;
      contenant = null;

      this.loadAllContenant();
      //      this.updateForm(contenant);
      //      this.loadRelationshipsOptions();
    });

    this.couleurAffiche = this.couleurKO;
  }

  trackContenantById(_index: number, item: IContenant): number {
    return item.id!;
  }

  loadAllContenant(): void {
    this.isLoading = true;

    this.contenantService.findAll().subscribe({
      next: (res: HttpResponse<IContenant[]>) => {
        this.isLoading = false;
        this.contenants = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  save(): void {
    this.isSaving = true;
    const lien = this.createFromForm();

    this.subscribeToSaveResponse(this.lienService.create(lien));
  }

  previousState(): void {
    window.history.back();
  }

  formulaxValidax(): boolean {
    if (this.editForm.get('nom')?.value === null) {
      return false;
    }
    if (this.couleurAffiche !== this.couleurOK) {
      return false;
    }
    if (this.contenanta.id == null) {
      return false;
    }
    if (this.contenanto.id == null) {
      return false;
    }
    return true;
  }

  findLeConcon(): void {
    let concon;
    //  alert(this.editForm.get('lekow')?.value);
    this.contenantService.findleconcon(this.lecoco).subscribe({
      next: (res: HttpResponse<IContenant>) => {
        //     alert(this.lecoco);
        this.couleurAffiche = this.couleurOK;
        this.isLoading = false;
        this.contenanta = res.body ?? new Contenant();
        if (concon.id == null) {
          //       alert("HU");
          this.couleurAffiche = this.couleurKO;
        }
      },
      error: () => {
        //      alert("HO");
        this.couleurAffiche = this.couleurKO;
        this.isLoading = false;
      },
    });
    alert(concon.nom);
  }

  protected updateForm(lien: ILien): void {
    this.editForm.patchValue({
      id: lien.id,
      nom: lien.nom,
      icone: lien.icone,
      iconeContentType: lien.iconeContentType,
      absisce: lien.absisce,
      ordonnee: lien.ordonnee,
      arriereplan: lien.arriereplan,
      arriereplanContentType: lien.arriereplanContentType,
      villeOrigine: lien.contenant,
      villeCible: lien.villeCible,
      contenant: lien.contenant,
    });
    this.contenantsSharedCollection = this.contenantService.addContenantToCollectionIfMissing(
      this.contenantsSharedCollection,
      lien.contenant
    );
  }

  protected createFromForm(): ILien {
    return {
      ...new Lien(),
      nom: this.editForm.get(['nom'])!.value,
      villeOrigine: this.contenanto,
      villeCible: this.contenanta,
      contenant: this.contenanto,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILien>>): void {
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
}
