import { IContenant, NewContenant } from './contenant.model';

export const sampleWithRequiredData: IContenant = {
  id: 99335,
  nom: 'withdrawal Account Forges',
  isCapital: false,
};

export const sampleWithPartialData: IContenant = {
  id: 5595,
  nom: 'Forward haptic',
  isCapital: false,
  absisce: 35187,
  ordonnee: 41186,
  arriereplan: '../fake-data/blob/hipster.png',
  arriereplanContentType: 'unknown',
};

export const sampleWithFullData: IContenant = {
  id: 3055,
  nom: 'system Architect',
  isCapital: true,
  icone: '../fake-data/blob/hipster.png',
  iconeContentType: 'unknown',
  absisce: 84480,
  ordonnee: 66519,
  arriereplan: '../fake-data/blob/hipster.png',
  arriereplanContentType: 'unknown',
};

export const sampleWithNewData: NewContenant = {
  nom: 'Borders Argentine bluetooth',
  isCapital: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
