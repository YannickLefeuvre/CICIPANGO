import { IContenant } from 'app/entities/contenant/contenant.model';

export interface IContenu {
  id?: number;
  nom?: string;
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
}

export class Contenu implements IContenu {
  constructor(
    public id?: number,
    public nom?: string,
    public description?: string | null,
    public iconeContentType?: string | null,
    public icone?: string | null,
    public absisce?: number | null,
    public ordonnee?: number | null,
    public arriereplanContentType?: string | null,
    public arriereplan?: string | null,
    public contenant?: IContenant | null,
    public type?: string | null,
    public ext?: string | null
  ) {}
}

export function getContenuIdentifier(contenu: IContenu): number | undefined {
  return contenu.id;
}
