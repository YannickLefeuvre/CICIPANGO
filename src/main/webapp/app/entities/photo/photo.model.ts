import { Account } from 'app/core/auth/account.model';
import { Contenu } from '../contenu/contenu.model';
import { IContenant } from 'app/entities/contenant/contenant.model';

export interface IPhoto {
  id?: number;
  nom?: string;
  imagesContentType?: string | null;
  images?: string | null;
  description?: string | null;
  iconeContentType?: string | null;
  icone?: string | null;
  absisce?: number | null;
  ordonnee?: number | null;
  arriereplanContentType?: string | null;
  arriereplan?: string | null;
  contenant?: IContenant | null;
  type?: string | null;
  nbSecret?: number | null;
  ext?: string | null;
  createur?: Account | null;
  isAvant?: boolean | null;
}

export class Photo extends Contenu implements IPhoto {
  constructor(
    public id?: number,
    public nom?: string,
    public imagesContentType?: string | null,
    public images?: string | null,
    public description?: string | null,
    public iconeContentType?: string | null,
    public icone?: string | null,
    public absisce?: number | null,
    public ordonnee?: number | null,
    public arriereplanContentType?: string | null,
    public arriereplan?: string | null,
    public contenant?: IContenant | null,
    public type?: string | null,
    public nbSecret?: number | null,
    public ext?: string | null,
    public createur?: Account | null,
    public isAvant?: boolean | null
  ) {
    super(id, nom, description, isAvant);
  }
}

export function getPhotoIdentifier(photo: IPhoto): number | undefined {
  return photo.id;
}
