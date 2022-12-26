import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFichiay, Fichiay } from '../../audio/audio.model';
import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPhoto, getPhotoIdentifier } from '../photo.model';

export type FichiayResponseType = HttpResponse<IFichiay>;
export type EntityResponseType = HttpResponse<IPhoto>;
export type EntityArrayResponseType = HttpResponse<IPhoto[]>;

@Injectable({ providedIn: 'root' })
export class PhotoService {
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
}
