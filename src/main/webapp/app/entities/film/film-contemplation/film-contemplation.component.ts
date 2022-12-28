import { Component, OnInit, NgZone } from '@angular/core';
import { Film, IFilm } from '../film.model';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-film-contemplation',
  templateUrl: './film-contemplation.component.html',
  styleUrls: ['./film-contemplation.component.scss'],
})
export class FilmContemplationComponent implements OnInit {
  film: Film | null = null;

  constructor(public activeModal: NgbActiveModal, private ngZone: NgZone) {}

  ngOnInit(): void {
    console.log(NgZone.isInAngularZone());
  }

  filmNom(film: Film | null): string {
    if (film != null) {
      if (film.nom != null) {
        return film.nom;
      } else {
        return 'naze';
      }
    } else {
      return ' HAAAAAAAAAAAA ';
    }
  }

  filmDescription(film: Film | null): string {
    if (film != null) {
      if (film.description != null) {
        return film.description;
      } else {
        return 'naze';
      }
    } else {
      return ' HAAAAAAAAAAAA ';
    }
  }

  filmText(film: Film | null): string {
    if (film != null) {
      if (film.texte != null) {
        return film.texte;
      } else {
        return 'naze';
      }
    } else {
      return ' HAAAAAAAAAAAA ';
    }
  }
}
