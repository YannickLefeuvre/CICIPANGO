import { ISerie, NewSerie } from './serie.model';

export const sampleWithRequiredData: ISerie = {
  id: 98516,
};

export const sampleWithPartialData: ISerie = {
  id: 4492,
  images: '../fake-data/blob/hipster.png',
  imagesContentType: 'unknown',
  description: 'protocol Refined',
};

export const sampleWithFullData: ISerie = {
  id: 61112,
  images: '../fake-data/blob/hipster.png',
  imagesContentType: 'unknown',
  description: 'emulation',
};

export const sampleWithNewData: NewSerie = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
