import { Component, OnInit, NgZone } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlbumPhoto, IAlbumPhoto, IListeFichiers } from '../album-photo.model';
import { AlbumPhotoService } from '../service/album-photo.service';
import { HttpResponse } from '@angular/common/http';
import { layer } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'jhi-album-photo-contemplation',
  templateUrl: './album-photo-contemplation.component.html',
  styleUrls: ['./album-photo-contemplation.component.scss'],
})
export class AlbumPhotoContemplationComponent implements OnInit {
  nbphotos: number | null = null;
  album: AlbumPhoto | null = null;
  listFichiay?: IListeFichiers | null = null;
  isLoading = false;
  isOk = false;

  // fs = require("fs");
  chminsphotos: Array<string> | null = null;

  constructor(public activeModal: NgbActiveModal, private ngZone: NgZone, protected albumPhotoService: AlbumPhotoService) {}

  loadAll(): void {
    //   this.albumPhotoService.

    //  this.listFichiay =this.albumPhotoService.findFichiers(15);

    if (this.album?.id != null) {
      this.albumPhotoService.findFichiers(this.album.id).subscribe({
        next: (res: HttpResponse<IListeFichiers>) => {
          this.listFichiay = res.body;
          //          alert(this.listFichiay?.nomsFichiers);
          //      alert("HAAA");
          this.remplissageArray();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  ngOnInit(): void {
    // YAYA
    //  alert(" YOUK  ");
    this.loadAll();
  }

  remplissageArray(): void {
    if (this.album?.id != null && this.listFichiay?.nomsFichiers != null) {
      this.chminsphotos = new Array(this.listFichiay.nomsFichiers.length);
      for (let i = 0; i < this.listFichiay.nomsFichiers.length; i++) {
        this.chminsphotos[i] = '/content/albumphoto/bibi' + this.album.id.toString() + '/' + this.listFichiay.nomsFichiers[i];
      }
    }

    console.log(NgZone.isInAngularZone());
  }

  albumNom(album: AlbumPhoto | null): string {
    if (album != null) {
      if (album.nom != null) {
        return album.nom;
      } else {
        return 'naze';
      }
    } else {
      return ' HAAAAAAAAAAAA ';
    }
  }

  albumDescription(album: AlbumPhoto | null): string {
    if (album != null) {
      if (album.description != null) {
        return album.description;
      } else {
        return 'naze';
      }
    } else {
      return ' HAAAAAAAAAAAA ';
    }
  }

  nbPhoto(): number {
    if (this.album?.nbPhotos != null) {
      return this.album.nbPhotos;
    } else {
      return 0;
    }
  }

  chminphoto(index: number): string {
    const result = '';
    let chmin = '../../../content/audios/albumphoto/bibi';
    //   alert('GRTRGRT');
    if (this.album != null) {
      if (this.album.id != null) {
        //       alert('HYYYYYYYYYYYYYYYY');

        //   alert(result.concat(chmin,this.audio.id.toString(),"mp3"));
        chmin = result.concat(chmin, this.album.id.toString(), '/bubu', this.album.id.toString(), index.toString());

        //     alert(chmin);
        return chmin;
      } else {
        return 'naze';
      }
    } else {
      return ' HAAAAAAAAAAAA ';
    }
  }
}
