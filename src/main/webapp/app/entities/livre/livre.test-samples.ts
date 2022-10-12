import { ILivre, NewLivre } from './livre.model';

export const sampleWithRequiredData: ILivre = {
  id: 49773,
};

export const sampleWithPartialData: ILivre = {
  id: 60990,
};

export const sampleWithFullData: ILivre = {
  id: 76988,
  images: '../fake-data/blob/hipster.png',
  imagesContentType: 'unknown',
  description: 'harness',
};

export const sampleWithNewData: NewLivre = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
