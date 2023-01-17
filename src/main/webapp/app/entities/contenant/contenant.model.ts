import { ILien } from 'app/entities/lien/lien.model';
import { IContenu } from 'app/entities/contenu/contenu.model';

export interface IContenant {
  id?: number;
  nom?: string;
  isCapital?: boolean;
  iconeContentType?: string | null;
  icone?: string | null;
  absisce?: number | null;
  ordonnee?: number | null;
  arriereplanContentType?: string | null;
  arriereplan?: string | null;
  liens?: ILien[] | null;
  contenus?: IContenu[] | null;
  contenants?: IContenant[] | null;
  lienOrigine?: ILien | null;
  lienCible?: ILien | null;
  contenant?: IContenant | null;
  vues?: number | null;
}

export class Contenant implements IContenant {
  constructor(
    public id?: number,
    public nom?: string,
    public isCapital?: boolean,
    public iconeContentType?: string | null,
    public icone?: string | null,
    public absisce?: number | null,
    public ordonnee?: number | null,
    public arriereplanContentType?: string | null,
    public arriereplan?: string | null,
    public liens?: ILien[] | null,
    public contenus?: IContenu[] | null,
    public contenants?: IContenant[] | null,
    public lienOrigine?: ILien | null,
    public lienCible?: ILien | null,
    public contenant?: IContenant | null,
    public vues?: number | null
  ) {
    this.isCapital = this.isCapital ?? false;
  }
}

export function getContenantIdentifier(contenant: IContenant): number | undefined {
  return contenant.id;
}
