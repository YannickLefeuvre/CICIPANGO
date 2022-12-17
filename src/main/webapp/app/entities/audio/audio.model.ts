import { Contenu } from '../contenu/contenu.model';
import { IContenant } from 'app/entities/contenant/contenant.model';

export interface IAudio {
  id?: number;
  nom?: string;
  url?: string;
  description?: string | null;
  iconeContentType?: string | null;
  icone?: string | null;
  absisce?: number | null;
  ordonnee?: number | null;
  arriereplanContentType?: string | null;
  arriereplan?: string | null;
  contenant?: IContenant | null;
  type?: string | null;
  ext?: string | null;
  nbSecret?: number | null;
}

export class Audio extends Contenu implements IAudio {
  constructor(
    public id?: number,
    public nom?: string,
    public description?: string | null,
    public url?: string,
    public iconeContentType?: string | null,
    public icone?: string | null,
    public absisce?: number | null,
    public ordonnee?: number | null,
    public arriereplanContentType?: string | null,
    public arriereplan?: string | null,
    public contenant?: IContenant | null,
    public type?: string | null,
    public ext?: string | null,
    public nbSecret?: number | null
  ) {
    super(id, nom);
  }
}

export interface IFichiay {
  id?: number;
  nom?: string;
  fichierContentType?: string | null;
  fichier?: string | null;
  ext?: string | null;
  nbSecret?: number | null;
}

export class Fichiay implements IFichiay {
  constructor(
    public id?: number,
    public nom?: string,
    public fichierContentType?: string | null,
    public fichier?: string | null,
    public ext?: string | null,
    public nbSecret?: number | null
  ) {}
}

export function getAudioIdentifier(audio: IAudio): number | undefined {
  return audio.id;
}
