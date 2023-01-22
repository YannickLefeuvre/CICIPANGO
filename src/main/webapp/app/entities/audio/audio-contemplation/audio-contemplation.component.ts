import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataUtils } from 'app/core/util/data-util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IContenu, Contenu } from '../../contenu/contenu.model';
import { ContenuService } from '../../contenu/service/contenu.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';
import { Contenant, IContenant } from 'app/entities/contenant/contenant.model';
import { IAudio, Audio } from '../audio.model';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-audio-contemplation',
  templateUrl: './audio-contemplation.component.html',
  styleUrls: ['./audio-contemplation.component.scss'],
})
export class AudioContemplationComponent implements OnInit {
  audio: Audio | null = null;

  constructor(public activeModal: NgbActiveModal, private ngZone: NgZone) {}

  ngOnInit(): void {
    console.log(NgZone.isInAngularZone());
  }

  audioNom(audio: Audio | null): string {
    if (audio != null) {
      if (audio.nom != null) {
        return audio.nom;
      } else {
        return 'naze';
      }
    } else {
      return ' HAAAAAAAAAAAA ';
    }
  }

  audioDescription(audio: Audio | null): string {
    if (audio != null) {
      if (audio.description != null) {
        return audio.description;
      } else {
        return 'naze';
      }
    } else {
      return ' HAAAAAAAAAAAA ';
    }
  }

  cheminAlaudio(): string {
    const result = '';
    const chmin = 'src/main/webapp/content/audios/bibu';
    if (this.audio != null) {
      if (this.audio.id != null && this.audio.ext != null) {
        //   alert(result.concat(chmin,this.audio.id.toString(),"mp3"));
        return result.concat(chmin, this.audio.id.toString(), '.', this.audio.ext.toString());
      } else {
        return 'naze';
      }
    } else {
      return ' HAAAAAAAAAAAA ';
    }
  }
}
