import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataUtils } from 'app/core/util/data-util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IContenu, Contenu } from '../../contenu/contenu.model';
import { ContenuService } from '../../contenu/service/contenu.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';
import { Contenant, IContenant } from 'app/entities/contenant/contenant.model';

@Component({
  selector: 'jhi-audio-contemplation',
  templateUrl: './audio-contemplation.component.html',
  styleUrls: ['./audio-contemplation.component.scss'],
})
export class AudioContemplationComponent implements OnInit {
  contenant: IContenant | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contenant }) => {
      this.contenant = contenant;
    });
  }
}
