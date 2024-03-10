import { Component, OnInit, NgZone } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Audio } from 'app/entities/audio/audio.model';
import { Contenant } from '../contenant.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { ContenantService } from '../service/contenant.service';
import { AlbumPhotoService } from 'app/entities/album-photo/service/album-photo.service';
import { AudioService } from 'app/entities/audio/service/audio.service';
import { PhotoService } from 'app/entities/photo/service/photo.service';
import { FilmService } from 'app/entities/film/service/film.service';
import { Contenu } from 'app/entities/contenu/contenu.model';
import { Observable, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { finalize, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-systeme-gestion',
  templateUrl: './systeme-gestion.component.html',
  styleUrls: ['./systeme-gestion.component.scss'],
})
export class SystemeGestionComponent implements OnInit {
  list1 = ['Item 1', 'Item 2', 'Item 3'];
  list2 = ['Item 4', 'Item 5', 'Item 6'];
  listeEnAvant: string[] = [];
  listeEnAvantContenu: Contenu[] = [];
  listePasEnAvant: string[] = [];
  listePasEnAvantContenu: Contenu[] = [];
  audio: Audio | null = null;
  contenant: Contenant | null = null;
  account: Account | null = null;
  descri = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    protected accountService: AccountService,
    public activeModal: NgbActiveModal,
    private ngZone: NgZone,
    protected albumPhotoService: AlbumPhotoService,
    protected audioservice: AudioService,
    protected photoservice: PhotoService,
    protected filmservice: FilmService,
    protected contenantservice: ContenantService
  ) {}

  ngOnInit(): void {
    console.log(NgZone.isInAngularZone());
    this.creationListeContenusNonCap();
    this.creationListeContenusCap();

    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  creationListeContenusCap(): void {
    if (this.contenant?.contenus?.length != null) {
      for (let i = 0; i < this.contenant.contenus.length; i++) {
        if (this.contenant.contenus[i].isAvant === true) {
          this.listeEnAvant.push(String(this.contenant.contenus[i].nom));
          this.listeEnAvantContenu.push(this.contenant.contenus[i]);
        }
      }
    }
  }

  creationListeContenusNonCap(): void {
    if (this.contenant?.contenus?.length != null) {
      for (let i = 0; i < this.contenant.contenus.length; i++) {
        if (this.contenant.contenus[i].isAvant === false) {
          this.listePasEnAvant.push(String(this.contenant.contenus[i].nom));
          this.listePasEnAvantContenu.push(this.contenant.contenus[i]);
        }
      }
    }
  }

  updateleContenu(contenu: Contenu): void {
    if (this.contenant != null && this.account != null) {
      switch (contenu.type) {
        case 'FILM': {
          this.filmservice.majTexte(contenu, this.contenant, this.account);
          break;
        }
        case 'AUDIO': {
          this.audioservice.majAudio(contenu, this.contenant, this.account);
          break;
        }
        case 'PHOTO': {
          this.photoservice.majPhoto(contenu, this.contenant, this.account);
          break;
        }
        case 'ALBUMPHOTO': {
          this.albumPhotoService.majAlbum(contenu, this.contenant, this.account);
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  drodro(event: CdkDragDrop<string[]>, liste: string): void {
    if (event.previousContainer === event.container) {
      // Si l'élémnt est déplacé dans la même liste
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Si l'élément est déplacé vers une liste différente

      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  upup(): void {
    if (this.contenant != null && this.account != null && this.descri !== '') {
      this.contenant.description = this.descri;
      this.contenantservice.updatar(this.contenant, this.account);
    }
  }

  onInputChange(event: any): void {
    this.descri = event.target.value; // Mettre à jour 'a' avec la valeur de l'entrée
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.listePasEnAvantContenu[event.previousIndex].isAvant = !this.listePasEnAvantContenu[event.previousIndex].isAvant;
      this.updateleContenu(this.listePasEnAvantContenu[event.previousIndex]);
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  drup(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.listeEnAvantContenu[event.previousIndex].isAvant = !this.listeEnAvantContenu[event.previousIndex].isAvant;
      this.updateleContenu(this.listeEnAvantContenu[event.previousIndex]);
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
