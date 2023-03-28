import { Account } from 'app/core/auth/account.model';
import { Contenu } from '../contenu/contenu.model';
import { IContenant } from 'app/entities/contenant/contenant.model';

export interface IFilm {
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
  texte?: string | null;
  createur?: Account | null;
}

export class Film extends Contenu implements IFilm {
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
    public texte?: string | null,
    public createur?: Account | null
  ) {
    super(id, nom, description);
  }
}

export function getFilmIdentifier(film: IFilm): number | undefined {
  return film.id;
}
