import { IPhoto, NewPhoto } from './photo.model';

export const sampleWithRequiredData: IPhoto = {
  id: 37945,
};

export const sampleWithPartialData: IPhoto = {
  id: 47600,
};

export const sampleWithFullData: IPhoto = {
  id: 36601,
  images: '../fake-data/blob/hipster.png',
  imagesContentType: 'unknown',
  description: 'capacitor Persistent',
};

export const sampleWithNewData: NewPhoto = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
