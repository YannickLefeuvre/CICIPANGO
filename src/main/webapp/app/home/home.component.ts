import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Contenant, IContenant } from '../entities/contenant/contenant.model';
import { ContenantService } from '../entities/contenant/service/contenant.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataUtils } from 'app/core/util/data-util.service';
import { HttpResponse } from '@angular/common/http';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { MatDialog } from '@angular/material/dialog';
import { AudioContemplationComponent } from '../entities/audio/audio-contemplation/audio-contemplation.component';
import { before } from 'node:test';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // Nombre de points que vous souhaitez générer

  numberOfPoints = 10;
  numberOfLignes = 3;

  // Conteneur des points
  pointCloud = document.getElementById('pointCloud');
  count = 0;
  account: Account | null = null;
  contenants?: IContenant[];
  contenantaffichay?: IContenant[];
  isLoading = false;
  arrX = [300, 700, 1100, 1200];
  arrY = [200, 800, 200, 500];
  rotateStyle = '';
  isMouseOver = false;
  cercleVisible = false;
  couleurs?: string[];
  contenant?: Contenant[];
  nomContenantAffichay = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    protected contenantsService: ContenantService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected dialogref: MatDialog,
    protected contenantService: ContenantService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadAllContenant();
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  addPointsWithDelay(count: number): void {
    if (this.couleurs === undefined) {
      this.couleurs = [];
    }

    if (count > 0) {
      this.couleurs.push('#3f6cff');
      const point = this.creerpoint(this.couleurs.length - 1);
      //    if (Math.random() < 0.1) {
      // Créez des connexions aléatoires avec une probabilité de 30%
      //       const points = document.querySelectorAll('.point');
      //       const randomPoint = points[Math.floor(Math.random() * points.length)];
      //       const pluproche = this.createLineWithClosestPoint(point);
      //       this.createLine(point, pluproche as HTMLDivElement);
      //     }
      setTimeout(() => {
        this.addPointsWithDelay(count - 1);
      }, 1000); // Délai de 15 secondes avant d'ajouter la prochaine boule
    } else {
      this.addLignesWithDelay(this.numberOfLignes);
    }
  }

  addLignesWithDelay(count: number): void {
    if (count > 0) {
      const points = Array.from(document.querySelectorAll('.point'));

      const randomIndex = Math.floor(Math.random() * points.length);

      // Accédez à l'élément correspondant à l'index aléatoire
      const point = points[randomIndex];
      //    for (const point of points) {
      //       if (Math.random() < 0.1) {
      if (point instanceof HTMLDivElement) {
        const pluproche = this.createLineWithClosestPoint(point);
        this.createLine(point, pluproche as HTMLDivElement);
        point.id = '1';
        //      break;
      }
      //    }
      //    }
      setTimeout(() => {
        this.addLignesWithDelay(count - 1);
      }, 1000); // Délai de 15 secondes avant d'ajouter la prochaine boule
    }
  }

  // Fonction pour créer une ligne entre deux points les plus proches
  createLineWithClosestPoint(newPoint: HTMLDivElement): HTMLDivElement | null {
    const points = Array.from(document.querySelectorAll('.point'));

    let closestPoint: HTMLDivElement | null = null;
    let closestDistance: number | null = null;

    for (const point of points) {
      if (point !== newPoint) {
        if (point instanceof HTMLDivElement) {
          const dx = parseFloat(point.style.left) - parseFloat(newPoint.style.left);
          const dy = parseFloat(point.style.top) - parseFloat(newPoint.style.top);
          const distance = Math.sqrt(dx * dx + dy * dy);

          if ((closestDistance === null || distance < closestDistance)! && point.id !== '1') {
            closestDistance = distance;
            closestPoint = point;
          }
        }
      }
    }

    closestPoint?.id ?? '1';
    return closestPoint;
  }

  creerpoint(i: number): HTMLDivElement {
    const pointCloudo = document.getElementById('pointCloud');
    if (pointCloudo != null) {
      pointCloudo.style.position = 'absolute';
      pointCloudo.style.top = '470px';
      pointCloudo.style.left = '450px';

      //    pointCloudo.style.width = '30px';
      //    pointCloudo.style.height = '30px';
      //    pointCloudo.style.background = 'white';
    }
    const pointSize: number = this.getRandomNumber(20, 60); // Taille aléatoire entre 10 et 50 pixels
    const point: HTMLDivElement = document.createElement('div');
    point.classList.add('point');
    point.style.position = 'absolute';
    const choixIntervalle = Math.random();
    //    if (choixIntervalle < 0.5) {
    // Choix de l'intervalle [1, 5]
    //      point.style.top = `${this.getRandomNumber(-400, -100)}px`;
    //  } else {
    // Choix de l'intervalle [15, 25]
    //      point.style.top = `${this.getRandomNumber(100, 400)}px`;
    //  }
    // point.style.top = `${this.getRandomNumber(-400, 400)}px`;
    const totop = this.getRandomNumber(-400, 400);

    let leleft = 0;
    if (totop > -150 && totop < 150) {
      if (choixIntervalle < 0.5) {
        leleft = this.getRandomNumber(-1200, -450);
      } else {
        leleft = this.getRandomNumber(250, 500);
      }
    } else {
      leleft = this.getRandomNumber(-500, 500);
    }

    point.style.top = `${totop}px`;
    point.style.left = `${leleft}px`;
    point.style.borderRadius = '50%';
    //   point.style.boxShadow= '0px 0px 10px rgba(0, 0, 0, 0.5)'; /* Ajoutez une ombre pour la profondeur */
    //   point.style.background= 'radial-gradient(circle at -100px -100px, #a7d2ff, #000)'; /* #5cabff */

    point.style.width = `${pointSize}px`; // Définir la largeur
    point.style.height = `${pointSize}px`; // Définir la hauteur (pour créer des cercles, assurez-vous que width et height sont égaux)
    //  point.style.backgroundColor = this.getRandomNumber(0, 1) < 0.5 ? '#fff' : '#ccc';
    point.style.background = 'black';
    point.style.cursor = 'pointer';
    point.onclick = () => this.switchBienLaCouleur(point, i);
    point.onmouseenter = () => this.switchBienLeNom(i);
    point.onmouseleave = () => this.vireLeNom();
    // point.style.background = 'radial-gradient(circle at 15px 15px, #bcbdfc, #000)';
    if (this.couleurs !== undefined) {
      point.style.background = 'radial-gradient(circle at 15px 15px, ' + this.couleurs[i] + ', #000)';
    }
    pointCloudo?.appendChild(point);
    const style = document.createElement('style');
    style.innerHTML = `
  

      .point:before {
        content: "";
        position: absolute;
        top: 5px;
        left: 5px;
        width: 90%;
        height: 90%;
        border-radius: 50%;
        background: radial-gradient(circle at 15px 0px, #ffffff, rgba(255, 255, 255, 0) 58%);
        -webkit-filter: blur(5px);

      }
  
      .point .shadow {
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 15px x5px rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0) 50%);
        -webkit-transform: rotateX(90deg) translateZ(-150px);
        -moz-transform: rotateX(90deg) translateZ(-150px);
        -ms-transform: rotateX(90deg) translateZ(-150px);
        -o-transform: rotateX(90deg) translateZ(-150px);
        transform: rotateX(90deg) translateZ(-150px);
        z-index: -1;
      }
    `;

    document.head.appendChild(style);

    return point;
  }

  switchBienLaCouleur(point: HTMLDivElement, i: number): void {
    if (this.couleurs !== undefined) {
      if (this.couleurs[i] === '#3f6cff') {
        point.style.background = 'radial-gradient(circle at 15px 15px, ' + '#e4a264' + ', #000)';
        this.couleurs[i] = '#e4a264';
      } else if (this.couleurs[i] === '#e4a264') {
        point.style.background = 'radial-gradient(circle at 15px 15px, ' + '#3f6cff' + ', #000)';
        this.couleurs[i] = '#3f6cff';
      }
    }
  }

  switchBienLeNom(i: number): void {
    if (this.contenants !== undefined) {
      this.nomContenantAffichay = this.contenants[i].nom ?? 'ZUT';
    }
  }

  vireLeNom(): void {
    this.nomContenantAffichay = '';
  }

  // Fonction pour créer une ligne entre deux points
  createLine(point1: HTMLDivElement, point2: HTMLDivElement): void {
    const pointCloudo = document.getElementById('pointCloud');
    const line: HTMLDivElement = document.createElement('div');
    line.classList.add('line');
    line.style.top = `${parseFloat(point1.style.top) + parseFloat(point1.style.height) / 2}px`;
    line.style.left = `${parseFloat(point1.style.left) + parseFloat(point1.style.width) / 2}px`;

    //  line.style.top = `${parseFloat(point2.style.top) + parseFloat(point2.style.height) / 2}px`;
    //  line.style.left = `${parseFloat(point2.style.left) + parseFloat(point2.style.width) / 2}px`;

    line.style.width = `${
      Math.sqrt(
        Math.pow(parseFloat(point1.style.left) - parseFloat(point2.style.left), 2) +
          Math.pow(parseFloat(point1.style.top) - parseFloat(point2.style.top), 2)
      ) + 5
    }px`;
    // line.style.width ='5px';
    line.style.height = '4px';
    line.style.position = 'absolute';
    line.style.zIndex = '-2';
    //line.style.background = 'radial-gradient(circle at -100px -100px, #5cabff, #000);';
    //b6b6b6
    // line.style.backgroundColor = '#bcbdfc';
    //'#213a8a'
    //  line.style.backgroundColor = 'linear-gradient(to right, #ff0000, #213a8a)';

    //line.style.backgroundColor = '#213a8a';

    line.style.transformOrigin = 'top left';
    //  (parseFloat(point2.style.top) + parseFloat(point2.style.height) / 2)
    //  (parseFloat(point2.style.left)+ parseFloat(point2.style.width) / 2)
    // line.style.transform = `rotate(${Math.atan2(parseFloat(point2.style.top) - parseFloat(point1.style.top), parseFloat(point2.style.left) - parseFloat(point1.style.left))}rad)`;

    line.style.transform = `rotate(${Math.atan2(
      parseFloat(point2.style.top) +
        parseFloat(point2.style.height) / 2 -
        (parseFloat(point1.style.top) + parseFloat(point1.style.height) / 2),
      parseFloat(point2.style.left) +
        parseFloat(point2.style.width) / 2 -
        (parseFloat(point1.style.left) + parseFloat(point1.style.width) / 2)
    )}rad)`;

    // line.style.transform = `rotate(${Math.atan2((parseFloat(point2.style.top) + parseFloat(point2.style.height) / 2) - parseFloat(point1.style.top), (parseFloat(point2.style.left)+ parseFloat(point2.style.width) / 2) - parseFloat(point1.style.left))}rad)`;
    line.style.background = 'white';
    //213a8a
    line.style.background = 'linear-gradient(to right, #000000 ,#000000, #213a8a,#000000, #000000 )';
    // line.style.top = `${parseFloat(point2.style.top) + parseFloat(point2.style.height) / 2}px`;
    // line.style.left = `${parseFloat(point2.style.left) + parseFloat(point2.style.width) / 2}px`;
    pointCloudo?.appendChild(line);
  }

  getRandomNumber(min: number, max: number): number {
    return Number(Math.random() * (max - min) + min);
  }

  addContenantVue(concon: Contenant): void {
    this.subscribeToSaveResponse(this.contenantService.addVues(concon));
  }

  showVues(concon: Contenant): string {
    if (concon.vues != null) {
      return concon.vues.toString();
    } else {
      return '-1';
    }
  }

  loadAllContenant(): void {
    this.isLoading = true;
    this.contenantsService.query('contenant-is-null').subscribe({
      next: (res: HttpResponse<IContenant[]>) => {
        this.isLoading = false;
        this.contenants = res.body ?? [];
        //      alert(this.contenants.length);
        this.addPointsWithDelay(this.contenants.length);
      },
      error: () => {
        //    alert("merde");
        this.isLoading = false;
      },
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  openDialog(): void {
    //    alert("CHIOOOOTE");
    //    this.dialogref.open(AudioContemplationComponent)
    this.dialogref.open(AudioContemplationComponent);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clickCount(): void {
    this.count = this.count + 1;
  }

  siContenantAContenant(contenant: Contenant): boolean {
    if (contenant.contenant == null) {
      return true;
    } else {
      return false;
    }
  }

  nomAccount(): string {
    return this.account?.firstName ?? '';
  }

  showCircle(): void {
    this.cercleVisible = true;
  }

  visibleCercle(): void {
    setTimeout(() => this.showCircle(), 1000); // Affichez le cercle après une seconde
  }

  rotateLetter(): void {
    this.rotateStyle = 'rotate';
  }

  resetRotation(): void {
    this.rotateStyle = '';
  }

  onMouseOver(): void {
    this.isMouseOver = true;
    this.visibleCercle();
  }

  onMouseOut(): void {
    this.isMouseOver = false;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContenant>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveFinalize(): void {
    //      alert("Passay !!");
  }

  protected onSaveSuccess(): void {
    //      alert("YOUPI");
  }

  protected onSaveError(): void {
    //      alert("TROP NAZE");
  }
}
