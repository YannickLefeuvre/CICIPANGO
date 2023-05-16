import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IContenant, getContenantIdentifier } from '../contenant.model';
import { IFichiay } from 'app/entities/audio/audio.model';

export type EntityResponseType = HttpResponse<IContenant>;
export type EntityArrayResponseType = HttpResponse<IContenant[]>;

@Injectable({ providedIn: 'root' })
export class ContenantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/contenants');
  protected resourceUrlFileicone = this.applicationConfigService.getEndpointFor('api/contenantfileicone');
  protected resourceUrlFilearriereplan = this.applicationConfigService.getEndpointFor('api/contenantfilearriereplan');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(contenant: IContenant): Observable<EntityResponseType> {
    return this.http.post<IContenant>(this.resourceUrl, contenant, { observe: 'response' });
  }

  update(contenant: IContenant): Observable<EntityResponseType> {
    return this.http.put<IContenant>(`${this.resourceUrl}/${getContenantIdentifier(contenant) as number}`, contenant, {
      observe: 'response',
    });
  }

  addVues(contenant: IContenant): Observable<EntityResponseType> {
    //    alert(`${this.resourceUrl}/${getContenantIdentifier(contenant) as number}/vues` + " KOUKOUKOU ");
    return this.http.put<IContenant>(`${this.resourceUrl}/${getContenantIdentifier(contenant) as number}/vues`, contenant, {
      observe: 'response',
    });
  }

  partialUpdate(contenant: IContenant): Observable<EntityResponseType> {
    return this.http.patch<IContenant>(`${this.resourceUrl}/${getContenantIdentifier(contenant) as number}`, contenant, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IContenant>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IContenant[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  uploadFileAP(fichiay: IFichiay, id: number): Observable<EntityResponseType> {
    alert('haa');
    return this.http.post<IFichiay>(`${this.resourceUrlFileicone}/${id}`, fichiay, { observe: 'response' });
  }

  uploadFileI(fichiay: IFichiay, id: number): Observable<EntityResponseType> {
    alert('hoo');
    return this.http.post<IFichiay>(`${this.resourceUrlFilearriereplan}/${id}`, fichiay, { observe: 'response' });
  }

  addContenantToCollectionIfMissing(
    contenantCollection: IContenant[],
    ...contenantsToCheck: (IContenant | null | undefined)[]
  ): IContenant[] {
    const contenants: IContenant[] = contenantsToCheck.filter(isPresent);
    if (contenants.length > 0) {
      const contenantCollectionIdentifiers = contenantCollection.map(contenantItem => getContenantIdentifier(contenantItem)!);
      const contenantsToAdd = contenants.filter(contenantItem => {
        const contenantIdentifier = getContenantIdentifier(contenantItem);
        if (contenantIdentifier == null || contenantCollectionIdentifiers.includes(contenantIdentifier)) {
          return false;
        }
        contenantCollectionIdentifiers.push(contenantIdentifier);
        return true;
      });
      return [...contenantsToAdd, ...contenantCollection];
    }
    return contenantCollection;
  }
}
