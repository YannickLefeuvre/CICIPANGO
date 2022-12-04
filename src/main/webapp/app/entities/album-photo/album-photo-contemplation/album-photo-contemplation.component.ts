import { Component, OnInit, NgZone } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlbumPhoto } from '../album-photo.model';

@Component({
  selector: 'jhi-album-photo-contemplation',
  templateUrl: './album-photo-contemplation.component.html',
  styleUrls: ['./album-photo-contemplation.component.scss'],
})
export class AlbumPhotoContemplationComponent implements OnInit {
  nbphotos: number | null = null;
  album: AlbumPhoto | null = null;
  fs = require('fs');

  // fs = require("fs");
  chminsphotos: Array<string> | null = null;

  constructor(public activeModal: NgbActiveModal, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.remplissageArray();
    console.log(NgZone.isInAngularZone());
  }

  remplissageArray(): void {
    this.chminsphotos = new Array(this.nbPhoto());
    if (this.album?.id != null && this.album.ext != null) {
      const exts = this.album.ext.split(',');
      for (let i = 0; i < this.nbPhoto(); i++) {
        //     alert(" HYYYY ");
        this.chminsphotos[i] =
          '/content/albumphoto/bibi' + this.album.id.toString() + '/bubu' + this.album.id.toString() + (i + 1).toString() + '.' + exts[i];
        //     alert( this.chminsphotos[i]);
        //this.chminsphotos[i] = '../../../content/images/jhipster_family_member_0_head-192.png';
      }
    }
  }

  nbPhoto(): number {
    //    const fs = require('fs');
    //   import fs = require('fs');

    //    import 'fs' from 'fs';
    //alert(this.album?.nbPhotos);
    //alert("hyhu");

    //alert("ham");
    //this.fs.readdir("../../../content/albumphoto/bibi10553/", (err, files) => {
    //  alert("hum");
    //  files.forEach(file => {
    //    alert(" miam ");
    //  });
    //});

    if (this.album?.nbPhotos != null) {
      return this.album.nbPhotos;
    } else {
      return 0;
    }
  }

  chminphoto(index: number): string {
    const result = '';
    let chmin = '../../../content/audios/albumphoto/bibi';
    alert('GRTRGRT');
    if (this.album != null) {
      if (this.album.id != null) {
        alert('HYYYYYYYYYYYYYYYY');

        //   alert(result.concat(chmin,this.audio.id.toString(),"mp3"));
        chmin = result.concat(chmin, this.album.id.toString(), '/bubu', this.album.id.toString(), index.toString());

        alert(chmin);
        return chmin;
      } else {
        return 'naze';
      }
    } else {
      return ' HAAAAAAAAAAAA ';
    }
  }
}
