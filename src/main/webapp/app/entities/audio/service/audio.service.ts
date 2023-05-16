import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAudio, getAudioIdentifier, Audio, IFichiay, Fichiay } from '../audio.model';
import { Contenant, IContenant } from 'app/entities/contenant/contenant.model';
import { FormGroup } from '@angular/forms';
import { Account } from 'app/core/auth/account.model';

export type EntityResponseType = HttpResponse<IAudio>;
export type EntityArrayResponseType = HttpResponse<IAudio[]>;

@Injectable({ providedIn: 'root' })
export class AudioService {
  audius?: IAudio | null;

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/audio');
  protected resourceUrlFile = this.applicationConfigService.getEndpointFor('api/audiofile');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(audio: IAudio): Observable<EntityResponseType> {
    return this.http.post<IAudio>(this.resourceUrl, audio, { observe: 'response' });
  }

  uploadFile(fichiay: IFichiay, id: number): Observable<EntityResponseType> {
    return this.http.post<IFichiay>(`${this.resourceUrlFile}/${id}`, fichiay, { observe: 'response' });
  }

  update(audio: IAudio): Observable<EntityResponseType> {
    return this.http.put<IAudio>(`${this.resourceUrl}/${getAudioIdentifier(audio) as number}`, audio, { observe: 'response' });
  }

  partialUpdate(audio: IAudio): Observable<EntityResponseType> {
    return this.http.patch<IAudio>(`${this.resourceUrl}/${getAudioIdentifier(audio) as number}`, audio, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAudio>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAudio[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAudioToCollectionIfMissing(audioCollection: IAudio[], ...audioToCheck: (IAudio | null | undefined)[]): IAudio[] {
    const audio: IAudio[] = audioToCheck.filter(isPresent);
    if (audio.length > 0) {
      const audioCollectionIdentifiers = audioCollection.map(audioItem => getAudioIdentifier(audioItem)!);
      const audioToAdd = audio.filter(audioItem => {
        const audioIdentifier = getAudioIdentifier(audioItem);
        if (audioIdentifier == null || audioCollectionIdentifiers.includes(audioIdentifier)) {
          return false;
        }
        audioCollectionIdentifiers.push(audioIdentifier);
        return true;
      });
      return [...audioToAdd, ...audioCollection];
    }
    return audioCollection;
  }

  previousState(): void {
    window.history.back();
  }

  sleep(ms): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async saveAudio(contenantu: Contenant, contenuForm: FormGroup, account: Account | null): Promise<void> {
    if (account == null) {
      return;
    }
    const audio = this.createFromForm(contenuForm, contenantu, account);
    const filu = this.createFileFromForm(contenuForm);
    if (filu.ext != null) {
      audio.ext = filu.ext;
    }
    this.subscribeToSaveResponso(this.create(audio));
    while (this.audius?.id == null) {
      await this.sleep(100); // pause for 100 milliseconds before checking again
    }
    this.uploadFichiay(this.audius.id, contenuForm);
  }

  saveAudioMieux(contenantu: Contenant, contenuForm: FormGroup, account: Account | null): void {
    if (account == null) {
      return;
    }

    const audio = this.createFromForm(contenuForm, contenantu, account);
    const filu = this.createFileFromForm(contenuForm);
    if (filu.ext != null) {
      audio.ext = filu.ext;
    }
    this.subscribeToSaveResponsoMieux(this.create(audio), contenuForm);
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAudio>>): void {
    result.pipe().subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponsoMieux(result: Observable<HttpResponse<IAudio>>, formGroup: FormGroup): void {
    result.pipe().subscribe({
      next: (res: HttpResponse<IAudio>) => {
        this.uploadFichiay(res.body?.id, formGroup);
      },
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponso(result: Observable<HttpResponse<IAudio>>): void {
    result.pipe().subscribe({
      next: (res: HttpResponse<IAudio>) => {
        this.audius = res.body;
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

  protected createFromForm(contenuForm: FormGroup, contenanto: Contenant, account: Account): IAudio {
    return {
      ...new Audio(),
      //     id: contenuForm.get(['id'])!.value,
      nom: contenuForm.get(['nom'])!.value,
      description: contenuForm.get(['description'])!.value,
      contenant: contenanto,
      type: 'AUDIO',
      createur: account,
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
}
