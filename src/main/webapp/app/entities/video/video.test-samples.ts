import { IVideo, NewVideo } from './video.model';

export const sampleWithRequiredData: IVideo = {
  id: 25330,
};

export const sampleWithPartialData: IVideo = {
  id: 43972,
};

export const sampleWithFullData: IVideo = {
  id: 76998,
  url: 'http://greta.info',
};

export const sampleWithNewData: NewVideo = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
