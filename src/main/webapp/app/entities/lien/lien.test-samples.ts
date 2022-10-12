import { ILien, NewLien } from './lien.model';

export const sampleWithRequiredData: ILien = {
  id: 74677,
  nom: 'Clothing salmon',
};

export const sampleWithPartialData: ILien = {
  id: 90430,
  nom: 'Salad',
  icone: '../fake-data/blob/hipster.png',
  iconeContentType: 'unknown',
  absisce: 72021,
};

export const sampleWithFullData: ILien = {
  id: 40915,
  nom: 'back Automotive',
  icone: '../fake-data/blob/hipster.png',
  iconeContentType: 'unknown',
  absisce: 4914,
  ordonnee: 36928,
  arriereplan: '../fake-data/blob/hipster.png',
  arriereplanContentType: 'unknown',
};

export const sampleWithNewData: NewLien = {
  nom: 'Direct Intelligent',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
