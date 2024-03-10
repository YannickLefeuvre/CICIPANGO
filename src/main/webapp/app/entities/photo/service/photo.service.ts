import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFichiay, Fichiay } from '../../audio/audio.model';
import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPhoto, Photo, getPhotoIdentifier } from '../photo.model';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { Contenant, IContenant } from 'app/entities/contenant/contenant.model';
import { FormGroup } from '@angular/forms';
import { Account } from 'app/core/auth/account.model';
export type FichiayResponseType = HttpResponse<IFichiay>;
export type EntityResponseType = HttpResponse<IPhoto>;
export type EntityArrayResponseType = HttpResponse<IPhoto[]>;

@Injectable({ providedIn: 'root' })
export class PhotoService {
  photus?: IPhoto | null;

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/photos');
  protected resourceUrlFile = this.applicationConfigService.getEndpointFor('api/photosfile');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(photo: IPhoto): Observable<EntityResponseType> {
    return this.http.post<IPhoto>(this.resourceUrl, photo, { observe: 'response' });
  }

  update(photo: IPhoto): Observable<EntityResponseType> {
    return this.http.put<IPhoto>(`${this.resourceUrl}/${getPhotoIdentifier(photo) as number}`, photo, { observe: 'response' });
  }

  partialUpdate(photo: IPhoto): Observable<EntityResponseType> {
    return this.http.patch<IPhoto>(`${this.resourceUrl}/${getPhotoIdentifier(photo) as number}`, photo, { observe: 'response' });
  }

  majPhoto(photo: Photo, contenant: Contenant, account: Account): void {
    this.subscribeToSaveRespuse(this.update(this.createFroum(photo, contenant, account)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPhoto>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  uploadFile(fichiay: IFichiay, id: number): Observable<EntityResponseType> {
    return this.http.post<IFichiay>(`${this.resourceUrlFile}/${id}`, fichiay, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPhoto[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPhotoToCollectionIfMissing(photoCollection: IPhoto[], ...photosToCheck: (IPhoto | null | undefined)[]): IPhoto[] {
    const photos: IPhoto[] = photosToCheck.filter(isPresent);
    if (photos.length > 0) {
      const photoCollectionIdentifiers = photoCollection.map(photoItem => getPhotoIdentifier(photoItem)!);
      const photosToAdd = photos.filter(photoItem => {
        const photoIdentifier = getPhotoIdentifier(photoItem);
        if (photoIdentifier == null || photoCollectionIdentifiers.includes(photoIdentifier)) {
          return false;
        }
        photoCollectionIdentifiers.push(photoIdentifier);
        return true;
      });
      return [...photosToAdd, ...photoCollection];
    }
    return photoCollection;
  }

  previousState(): void {
    window.history.back();
  }

  sleep(ms): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async savePhoto(contenantu: Contenant, contenuForm: FormGroup, account: Account | null): Promise<void> {
    if (account == null) {
      return;
    }
    const photo = this.createFromForm(contenuForm, contenantu, account);
    const filu = this.createFileFromForm(contenuForm);
    if (filu.ext != null) {
      photo.ext = filu.ext;
    }
    this.subscribeToSaveResponso(this.create(photo));
    while (this.photus?.id == null) {
      await this.sleep(100); // pause for 100 milliseconds before checking again
    }
    this.uploadFichiay(this.photus.id, contenuForm);
  }

  savePhotoMieux(contenantu: Contenant, contenuForm: FormGroup, account: Account | null): void {
    if (account == null) {
      return;
    }

    const photo = this.createFromForm(contenuForm, contenantu, account);
    const filu = this.createFileFromForm(contenuForm);
    if (filu.ext != null) {
      photo.ext = filu.ext;
    }
    this.subscribeToSaveResponsoMieux(this.create(photo), contenuForm);
  }

  uploadFichiay(id: number | undefined, fichiayForm: FormGroup): void {
    if (id === undefined) {
      return;
    }
    const file = this.createFileFromForm(fichiayForm);
    //    alert(file.fichierContentType?.toString());
    this.subscribeToSaveResponse(this.uploadFile(file, id));
  }

  trackContenantById(_index: number, item: IContenant): number {
    return item.id!;
  }

  getRandomInt(max): number {
    return Math.floor(Math.random() * max);
  }

  protected subscribeToSaveRespuse(result: Observable<HttpResponse<IPhoto>>): void {
    result.pipe().subscribe({
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponsoMieux(result: Observable<HttpResponse<IPhoto>>, formGroup: FormGroup): void {
    result.pipe().subscribe({
      next: (res: HttpResponse<IPhoto>) => {
        this.uploadFichiay(res.body?.id, formGroup);
      },
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPhoto>>): void {
    result.pipe().subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponso(result: Observable<HttpResponse<IPhoto>>): void {
    result.pipe().subscribe({
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

  protected createFromForm(contenuForm: FormGroup, contenanto: Contenant, account: Account): IPhoto {
    return {
      ...new Photo(),
      //     id: contenuForm.get(['id'])!.value,
      nom: contenuForm.get(['nom'])!.value,
      description: contenuForm.get(['description'])!.value,
      contenant: contenanto,
      type: 'PHOTO',
      createur: account,
      isAvant: false,
    };
  }

  protected createFileFromForm(fichiayForm: FormGroup): IFichiay {
    return {
      ...new Fichiay(),
      id: fichiayForm.get(['idFichier'])!.value,
      nom: ' YEUUUUUSH ',
      fichier: fichiayForm.get(['fichier'])!.value,
      fichierContentType: fichiayForm.get(['fichierContentType'])!.value,
      ext: fichiayForm.get(['fichierExt'])!.value,
    };
  }

  protected createFroum(photo: Photo, contenanto: Contenant, account: Account): IPhoto {
    return {
      ...new Photo(),
      id: photo.id,
      nom: photo.nom,
      description: photo.description,
      type: 'PHOTO',
      createur: account,
      contenant: contenanto,
      isAvant: photo.isAvant,
    };
  }
}
