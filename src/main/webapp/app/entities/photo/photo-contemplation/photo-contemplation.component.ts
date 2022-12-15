import { Component, OnInit, NgZone } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Photo } from '../photo.model';

@Component({
  selector: 'jhi-photo-contemplation',
  templateUrl: './photo-contemplation.component.html',
  styleUrls: ['./photo-contemplation.component.scss'],
})
export class PhotoContemplationComponent implements OnInit {
  photo: Photo | null = null;

  constructor(public activeModal: NgbActiveModal, private ngZone: NgZone) {}

  ngOnInit(): void {
    console.log(NgZone.isInAngularZone());
  }

  photoNom(photo: Photo | null): string {
    if (photo != null) {
      if (photo.nom != null) {
        return photo.nom;
      } else {
        return 'naze';
      }
    } else {
      return ' HAAAAAAAAAAAA ';
    }
  }

  cheminPhoto(): string {
    const result = '';
    const chmin = '../../../content/photos/bibi';
    if (this.photo != null) {
      if (this.photo.id != null && this.photo.ext != null) {
        //   alert(result.concat(chmin,this.audio.id.toString(),"mp3"));
        return result.concat(chmin, this.photo.id.toString(), '.', this.photo.ext);
      } else {
        return 'naze';
      }
    } else {
      return ' HAAAAAAAAAAAA ';
    }
  }
}
