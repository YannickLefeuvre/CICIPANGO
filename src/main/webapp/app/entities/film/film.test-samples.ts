import { IFilm, NewFilm } from './film.model';

export const sampleWithRequiredData: IFilm = {
  id: 86712,
};

export const sampleWithPartialData: IFilm = {
  id: 39248,
  images: '../fake-data/blob/hipster.png',
  imagesContentType: 'unknown',
};

export const sampleWithFullData: IFilm = {
  id: 41280,
  images: '../fake-data/blob/hipster.png',
  imagesContentType: 'unknown',
  description: 'Manager',
};

export const sampleWithNewData: NewFilm = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
