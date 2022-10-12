import { IAudio, NewAudio } from './audio.model';

export const sampleWithRequiredData: IAudio = {
  id: 5140,
};

export const sampleWithPartialData: IAudio = {
  id: 30088,
};

export const sampleWithFullData: IAudio = {
  id: 26074,
  url: 'http://arvel.info',
};

export const sampleWithNewData: NewAudio = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
