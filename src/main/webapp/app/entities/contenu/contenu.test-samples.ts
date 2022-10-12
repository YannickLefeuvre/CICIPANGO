import { IContenu, NewContenu } from './contenu.model';

export const sampleWithRequiredData: IContenu = {
  id: 67776,
  nom: 'Panama',
};

export const sampleWithPartialData: IContenu = {
  id: 61923,
  nom: 'National empowering Tactics',
  ordonnee: 60078,
  nom: 'Leone',
};

export const sampleWithFullData: IContenu = {
  id: 1818,
  nom: 'transmit',
  icone: '../fake-data/blob/hipster.png',
  iconeContentType: 'unknown',
  absisce: 67737,
  ordonnee: 91319,
  arriereplan: '../fake-data/blob/hipster.png',
  arriereplanContentType: 'unknown',
  nom: 'invoice payment',
  type: 'workforce holistic XML',
};

export const sampleWithNewData: NewContenu = {
  nom: 'Buckinghamshire',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
