import { Contenu } from '../contenu/contenu.model';
import { IContenant } from 'app/entities/contenant/contenant.model';
import { Fichiay } from '../audio/audio.model';

export interface IAlbumPhoto {
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
  nbPhotos?: number | null;
  nbSecret?: number | null;
  ext?: string | null;
}

export class AlbumPhoto extends Contenu implements IAlbumPhoto {
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
    public nbPhotos?: number | null,
    public nbSecret?: number | null,
    public ext?: string | null
  ) {
    super(id, nom);
  }
}

export interface IListeFichiers {
  nomDoss?: string;
  nomsFichiers?: string[];
}

export class ListeFichiers implements IListeFichiers {
  constructor(public nomDoss: string, public nomsFichiers: string[]) {}
}

export function getAlbumPhotoIdentifier(albumPhoto: IAlbumPhoto): number | undefined {
  return albumPhoto.id;
}
