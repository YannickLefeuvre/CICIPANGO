import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFichiay, Fichiay } from '../../audio/audio.model';
import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAlbumPhoto, getAlbumPhotoIdentifier, IListeFichiers, AlbumPhoto } from '../album-photo.model';
import { Contenant } from 'app/entities/contenant/contenant.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Account } from 'app/core/auth/account.model';
import { finalize, map, takeUntil } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<IAlbumPhoto>;
export type FichierResponseType = HttpResponse<IListeFichiers>;
export type EntityArrayResponseType = HttpResponse<IAlbumPhoto[]>;

@Injectable({ providedIn: 'root' })
export class AlbumPhotoService {
  albibo?: IAlbumPhoto | null;
  nbFilesup = 0;
  nbFichiasse = 0;

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/album-photos');
  protected resourceUrlFile = this.applicationConfigService.getEndpointFor('api/album-photosfile');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(albumPhoto: IAlbumPhoto): Observable<EntityResponseType> {
    return this.http.post<IAlbumPhoto>(this.resourceUrl, albumPhoto, { observe: 'response' });
  }

  update(albumPhoto: IAlbumPhoto): Observable<EntityResponseType> {
    return this.http.put<IAlbumPhoto>(`${this.resourceUrl}/${getAlbumPhotoIdentifier(albumPhoto) as number}`, albumPhoto, {
      observe: 'response',
    });
  }

  uploadFile(fichiay: IFichiay, id: number): Observable<EntityResponseType> {
    return this.http.post<IFichiay>(`${this.resourceUrlFile}/${id}`, fichiay, { observe: 'response' });
  }

  partialUpdate(albumPhoto: IAlbumPhoto): Observable<EntityResponseType> {
    return this.http.patch<IAlbumPhoto>(`${this.resourceUrl}/${getAlbumPhotoIdentifier(albumPhoto) as number}`, albumPhoto, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAlbumPhoto>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findFichiers(id: number): Observable<FichierResponseType> {
    return this.http.get<IListeFichiers>(`${this.resourceUrl}/fichiers/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAlbumPhoto[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAlbumPhotoToCollectionIfMissing(
    albumPhotoCollection: IAlbumPhoto[],
    ...albumPhotosToCheck: (IAlbumPhoto | null | undefined)[]
  ): IAlbumPhoto[] {
    const albumPhotos: IAlbumPhoto[] = albumPhotosToCheck.filter(isPresent);
    if (albumPhotos.length > 0) {
      const albumPhotoCollectionIdentifiers = albumPhotoCollection.map(albumPhotoItem => getAlbumPhotoIdentifier(albumPhotoItem)!);
      const albumPhotosToAdd = albumPhotos.filter(albumPhotoItem => {
        const albumPhotoIdentifier = getAlbumPhotoIdentifier(albumPhotoItem);
        if (albumPhotoIdentifier == null || albumPhotoCollectionIdentifiers.includes(albumPhotoIdentifier)) {
          return false;
        }
        albumPhotoCollectionIdentifiers.push(albumPhotoIdentifier);
        return true;
      });
      return [...albumPhotosToAdd, ...albumPhotoCollection];
    }
    return albumPhotoCollection;
  }

  // SAVE

  previousState(): void {
    window.history.back();
  }

  saveAlbum(contenantu: Contenant, fichiasse: Fichiay[], contenuForm: FormGroup, account: Account | null): void {
    if (account == null) {
      return;
    }
    let ext = '';
    for (let i = 0; i < fichiasse.length; i++) {
      const coupay = fichiasse[i].ext;
      if (coupay != null) {
        ext += coupay + ',';
      }
    }
    ext += ' ';
    this.uploadFilesMieux(contenantu, contenuForm, fichiasse, account);
  }

  sleep(ms): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async uploadFiles(contenantu: Contenant, contenuForm: FormGroup, fichiasse: Fichiay[], account: Account): Promise<void> {
    const album = this.createAlbumFromForm(contenantu, contenuForm, fichiasse, account);
    await this.subscribeToSaveResponso(this.create(album));
    for (let i = 0; i < fichiasse.length; i++) {
      const coupay = fichiasse[i].ext;
      if (coupay != null) {
        fichiasse[i].ext = coupay;
      }

      while (this.albibo?.id == null) {
        await this.sleep(100); // pause for 100 milliseconds before checking again
      }
      while (this.nbFilesup < i) {
        await this.sleep(100); // pause for 100 milliseconds before checking again
      }

      await this.subscribeToSaveResponseAlbum(this.uploadFile(fichiasse[i], this.albibo.id));
    }
    while (this.nbFilesup < fichiasse.length) {
      await this.sleep(100); // pause for 100 milliseconds before checking again
    }
    //             alert(this.nbFilesup);
    //        await this.sleep(10000);
    this.previousState();
  }

  uploadFilesMieux(contenantu: Contenant, contenuForm: FormGroup, fichiasse: Fichiay[], account: Account): void {
    const album = this.createAlbumFromForm(contenantu, contenuForm, fichiasse, account);
    this.subscribeToSaveResponsoMieux(this.create(album), fichiasse);
  }

  uploadRest(fichiasse: Fichiay[], album: AlbumPhoto | null): void {
    if (album?.id === undefined) {
      return;
    }
    this.subscribeMieux(this.uploadFileMieux(fichiasse, album.id, 0), fichiasse, album.id, 0);
  }

  uploadNext(fichiasse: Fichiay[], id: number, index: number): void {
    if (index < fichiasse.length - 1) {
      index++;
      this.subscribeMieux(this.uploadFileMieux(fichiasse, id, index), fichiasse, id, index);
    } else {
      this.previousState();
    }
  }

  uploadFileMieux(fichiasse: Fichiay[], id: number, index: number): Observable<HttpResponse<IFichiay>> {
    return this.http.post<IFichiay>(`${this.resourceUrlFile}/${id}`, fichiasse[index], { observe: 'response' });
  }

  protected subscribeMieux(result: Observable<HttpResponse<IFichiay>>, fichiasse: Fichiay[], id: number, index: number): any {
    result.pipe().subscribe({
      next: (res: HttpResponse<IFichiay>) => this.uploadNext(fichiasse, id, index),

      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponseAlbum(result: Observable<HttpResponse<IFichiay>>): any {
    result.pipe().subscribe({
      next: (res: HttpResponse<IFichiay>) => (this.nbFilesup = this.nbFilesup + 1),

      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponsoMieux(result: Observable<HttpResponse<IAlbumPhoto>>, fichiasse: Fichiay[]): any {
    result.pipe().subscribe({
      //     next: () => this.onSaveSuccess(),
      next: (res: HttpResponse<IAlbumPhoto>) => {
        this.uploadRest(fichiasse, res.body);
      },
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponso(result: Observable<HttpResponse<IAlbumPhoto>>): any {
    result.pipe().subscribe({
      //     next: () => this.onSaveSuccess(),
      next: (res: HttpResponse<IAlbumPhoto>) => {
        this.albibo = res.body;
      },
      error: () => this.onSaveError(),
    });
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected createAlbumFromForm(contenanto: Contenant, contenuForm: FormGroup, fichiasse: Fichiay[], account: Account): IAlbumPhoto {
    return {
      ...new AlbumPhoto(),
      //    id: this.contenuForm.get(['id'])!.value,
      nom: contenuForm.get(['nom'])!.value,
      description: contenuForm.get(['description'])!.value,
      contenant: contenanto,
      type: 'ALBUMPHOTO',
      nbPhotos: fichiasse.length,
      createur: account,
    };
  }
}
