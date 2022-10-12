import { IAlbumPhoto, NewAlbumPhoto } from './album-photo.model';

export const sampleWithRequiredData: IAlbumPhoto = {
  id: 38545,
};

export const sampleWithPartialData: IAlbumPhoto = {
  id: 58901,
};

export const sampleWithFullData: IAlbumPhoto = {
  id: 87997,
  images: '../fake-data/blob/hipster.png',
  imagesContentType: 'unknown',
  description: 'Cambodia copy',
};

export const sampleWithNewData: NewAlbumPhoto = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
