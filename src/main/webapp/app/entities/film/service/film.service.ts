import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { finalize, map, takeUntil } from 'rxjs/operators';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Film, IFilm, getFilmIdentifier } from '../film.model';
import { Contenant } from 'app/entities/contenant/contenant.model';
import { Account } from 'app/core/auth/account.model';

export type EntityResponseType = HttpResponse<IFilm>;
export type EntityArrayResponseType = HttpResponse<IFilm[]>;

@Injectable({ providedIn: 'root' })
export class FilmService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/films');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(film: IFilm): Observable<EntityResponseType> {
    return this.http.post<IFilm>(this.resourceUrl, film, { observe: 'response' });
  }

  update(film: IFilm): Observable<EntityResponseType> {
    return this.http.put<IFilm>(`${this.resourceUrl}/${getFilmIdentifier(film) as number}`, film, { observe: 'response' });
  }

  partialUpdate(film: IFilm): Observable<EntityResponseType> {
    return this.http.patch<IFilm>(`${this.resourceUrl}/${getFilmIdentifier(film) as number}`, film, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFilm>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFilm[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFilmToCollectionIfMissing(filmCollection: IFilm[], ...filmsToCheck: (IFilm | null | undefined)[]): IFilm[] {
    const films: IFilm[] = filmsToCheck.filter(isPresent);
    if (films.length > 0) {
      const filmCollectionIdentifiers = filmCollection.map(filmItem => getFilmIdentifier(filmItem)!);
      const filmsToAdd = films.filter(filmItem => {
        const filmIdentifier = getFilmIdentifier(filmItem);
        if (filmIdentifier == null || filmCollectionIdentifiers.includes(filmIdentifier)) {
          return false;
        }
        filmCollectionIdentifiers.push(filmIdentifier);
        return true;
      });
      return [...filmsToAdd, ...filmCollection];
    }
    return filmCollection;
  }

  previousState(): void {
    window.history.back();
  }

  majTexte(film: Film, contenant: Contenant, account: Account): void {
    this.subscribeToSaveRespuse(this.update(this.createFroum(film, contenant, account)));
  }

  saveTexte(contenantu: Contenant, contenuForm: FormGroup, account: Account | null): void {
    if (account == null) {
      return;
    }
    const film = this.createFromForm(contenuForm, contenantu, account);
    this.subscribeToSaveResponse(this.create(film));
  }

  protected subscroubeToSaveResponse(result: Observable<HttpResponse<IFilm>>): void {
    result.pipe().subscribe({
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFilm>>): void {
    result.pipe().subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveRespuse(result: Observable<HttpResponse<IFilm>>): void {
    result.pipe().subscribe({
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccuss(): void {
    this.previousState();
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    alert('HA');
  }

  protected createFromForm(contenuForm: FormGroup, contenanto: Contenant, account: Account): IFilm {
    return {
      ...new Film(),
      id: contenuForm.get(['id'])!.value,
      nom: contenuForm.get(['nom'])!.value,
      description: contenuForm.get(['description'])!.value,
      type: 'FILM',
      texte: contenuForm.get(['texte'])!.value,
      contenant: contenanto,
      createur: account,
      isAvant: false,
    };
  }

  protected createFroum(film: Film, contenanto: Contenant, account: Account): IFilm {
    return {
      ...new Film(),
      id: film.id,
      nom: film.nom,
      description: film.description,
      type: 'FILM',
      texte: film.texte,
      contenant: contenanto,
      createur: account,
      isAvant: film.isAvant,
    };
  }
}
