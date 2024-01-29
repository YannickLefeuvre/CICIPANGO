import { Component, OnInit, NgZone } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Audio } from 'app/entities/audio/audio.model';
import { Contenant } from '../contenant.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'jhi-systeme-gestion',
  templateUrl: './systeme-gestion.component.html',
  styleUrls: ['./systeme-gestion.component.scss'],
})
export class SystemeGestionComponent implements OnInit {
  list1 = ['Item 1', 'Item 2', 'Item 3'];
  list2 = ['Item 4', 'Item 5', 'Item 6'];
  list3: string[] = [];

  audio: Audio | null = null;
  contenant: Contenant | null = null;

  constructor(public activeModal: NgbActiveModal, private ngZone: NgZone) {}

  ngOnInit(): void {
    console.log(NgZone.isInAngularZone());
    this.creationListeContenusNonCap();
  }

  creationListeContenusNonCap(): void {
    if (this.contenant?.contenus?.length != null) {
      for (let i = 0; i < this.contenant.contenus.length; i++) {
        this.list3.push(String(this.contenant.contenus[i].nom));
      }
    }
  }

  drodro(event: CdkDragDrop<string[]>, liste: string): void {
    alert(liste);
    if (event.previousContainer === event.container) {
      alert(event.container.id);
      // Si l'élémnt est déplacé dans la même liste
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Si l'élément est déplacé vers une liste différente

      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
