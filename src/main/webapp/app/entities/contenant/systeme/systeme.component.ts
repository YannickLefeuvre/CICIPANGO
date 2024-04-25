import { Component, OnInit, Input, Renderer2, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataUtils } from 'app/core/util/data-util.service';
import { Contenant, IContenant } from '../contenant.model';
import { FormBuilder, Validators } from '@angular/forms';
import { IContenu, Contenu } from '../../contenu/contenu.model';
import { ContenuService } from '../../contenu/service/contenu.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';
import { AudioContemplationComponent } from '../../audio/audio-contemplation/audio-contemplation.component';
import { AlbumPhotoContemplationComponent } from 'app/entities/album-photo/album-photo-contemplation/album-photo-contemplation.component';
import { ContenantDetailComponent } from '../detail/contenant-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Audio } from 'app/entities/audio/audio.model';
import { AlbumPhoto, IListeFichiers, ListeFichiers } from 'app/entities/album-photo/album-photo.model';
import { MatButtonModule } from '@angular/material/button';
import { Photo } from 'app/entities/photo/photo.model';
import { PhotoContemplationComponent } from 'app/entities/photo/photo-contemplation/photo-contemplation.component';
import { Film } from 'app/entities/film/film.model';
import { FilmContemplationComponent } from 'app/entities/film/film-contemplation/film-contemplation.component';
import { ILien, Lien } from 'app/entities/lien/lien.model';
import { LienService } from 'app/entities/lien/service/lien.service';
import { AlbumPhotoService } from 'app/entities/album-photo/service/album-photo.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SystemeGestionComponent } from '../systeme-gestion/systeme-gestion.component';
import { Point } from '@angular/cdk/drag-drop';

@Component({
  selector: 'jhi-systeme',
  templateUrl: './systeme.component.html',
  styleUrls: ['./systeme.component.scss'],
})
export class SystemeComponent implements OnInit {
  // @Input() audio;
  // @Input() yuyu  = " frdes";
  contenant: IContenant | null = null;
  isSaving = false;
  revealText = false;
  rectangleWidth = 1500; // Largeur du rectangle
  rectangleHeight = 1200; // Hauteur du rectangle
  @Input() monInput: any;
  circleX = 0;
  circleY = 0;
  showCircle = false;
  circleRadius = 150; // Rayon du cercle
  numberOfCircles = 10;
  isHovered = false;
  textHovered = false;
  cheminToff = '';
  contenuTexte = '';
  result = '';
  chmin = 'src/main/webapp/content/photos/bibi';
  circles: { left: number; top: number }[] = [];

  isCadreDescriKikay = false;
  isCadreAvantKlikay = false;
  src = '';
  cardenumber = 0;
  couleurBouton = '#afaeae';
  couleurBoutonDescri = '#afaeae';
  hauteurBouton = 70;
  hauteurBoutonDescri = 70;
  listeBleu: IContenu[] = [];
  listeOrange: IContenu[] = [];
  listeBleuContenant: IContenu[] = [];
  listeOrangeContenant: IContenu[] = [];
  listeX: number[] = [];
  listeY: number[] = [];
  listePosi: number[] = [];
  traits: { x1: number; y1: number; x2: number; y2: number }[] = [];
  //   175;300   175;600    175;900
  //   350;300   350;600    350;900
  //   525;300   525;600    525;900
  @ViewChild('canvasEl', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D | null;

  listePointX = ['175,60', '662,60', '1150,60', '175,330', '662,330', '1150,330', '175,600', '662,600', '1150,600'];
  listePosi2 = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  // listePointY=[300,600,900]

  cadreStyle = {
    position: 'absolute',
    top: '0px',
    left: '0px',
    height: '0px',
    right: '10%',
    border: '0px' /* Définit une bordure de 2 pixels solide de couleur noire */,
    'border-radius': '0',
    'background-color': 'black',
    'clip-path': 'circle(150px at ' + this.circleX.toString() + ' ' + this.circleY.toString() + ')',
    'z-index': '2',
  };

  cadreOrga = {
    position: 'absolute',
    top: '0px',
    left: '0px',
    height: '0px',
    right: '10%',
    border: '0px' /* Définit une bordure de 2 pixels solide de couleur noire */,
    'border-radius': '0',
    'background-color': 'pink',
    //   'clip-path': 'circle(150px at ' + this.circleX.toString() + ' ' + this.circleY.toString() + ')',
    'z-index': '2',
  };

  cadreDescri = {
    position: 'absolute',
    top: '0px',
    left: '0px',
    height: '0px',
    right: '10%',
    border: '0px',
    overflow: 'hiden',
    //  backgroundImage : 'src/main/webapp/content/contenants/arriereplans/ap25051.png',
    'background-image': "url('src/main/webapp/content/contenants/arriereplans/ap25051.png')",
    /* Définit une bordure de 2 pixels solide de couleur noire */
    'border-radius': '0',
    'background-color': 'pink',
    //   'clip-path': 'circle(150px at ' + this.circleX.toString() + ' ' + this.circleY.toString() + ')',
    'z-index': '2',
  };

  $couleurCadre1 = '#70ad3f';

  bordureCadre = '2px solid ' + this.$couleurCadre1;
  fondCadre = 'radial-gradient(circle, ' + this.$couleurCadre1 + ' 10%, black 70%)';
  shadow = '0px 0px 15px ' + this.$couleurCadre1;

  cadre00 = {
    position: 'absolute',
    top: '100px',
    left: '-250px',
    height: '80%',
    right: '-1200px',
    'border-radius': '50px',
    'background-color': '#000',
    'z-index': '1',
    border: this.bordureCadre,
    background: this.fondCadre,
    'box-shadow': this.shadow,
  };

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    icone: [],
    iconeContentType: [],
    absisce: [],
    ordonnee: [],
    arriereplan: [],
    arriereplanContentType: [],
    contenant: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected contenuService: ContenuService,
    protected lienService: LienService,
    protected albumPhotoService: AlbumPhotoService,
    private modalService: NgbModal, //    protected activeModal: NgbActiveModal,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    //  activatedRoute.params.subscribe(val => {
    //    alert(val);
    activatedRoute.data.subscribe(({ contenant }) => {
      this.contenant = contenant;
      //    });
      this.loadLiens();
    });
  }

  ngOnInit(): void {
    //    alert("YO");
    this.activatedRoute.data.subscribe(({ contenant }) => {
      this.contenant = contenant;
    });
    this.loadLiens();
    this.loadToff();
    for (let i = 0; i < this.numberOfCircles; i++) {
      const circle = this.generateRandomCoordinates();
      this.circles.push(circle);
    }
    this.generateTraits();
    //  this.context = this.canvas.nativeElement.getContext('2d');

    //  this.drawLines();

    if (this.contenant?.contenants !== null && this.contenant?.contenants !== undefined) {
      let nbAvant = 0;
      //      let nbArierre=0;
      for (let i = 0; i < this.contenant.contenants.length; i++) {
        if (this.contenant.contenants[i].isAvant) {
          const posi = this.listePosi2[Math.floor(Math.random() * this.listePosi2.length)];
          this.contenant.contenants[i].absisce = parseInt(this.listePointX[posi].split(',')[0], 10);
          this.contenant.contenants[i].ordonnee = parseInt(this.listePointX[posi].split(',')[1], 10);
          this.listePosi.push(posi);
          this.listeBleuContenant.push(this.contenant.contenants[i]);
          this.listePosi2.splice(posi, 1);
          nbAvant++;
        } else {
          const circle = this.generateRandomCoordinates();
          this.contenant.contenants[i].absisce = circle.left;
          this.contenant.contenants[i].ordonnee = circle.top;
          this.listeOrangeContenant.push(this.contenant.contenants[i]);
          //        nbArierre++;
        }
      }
    }

    if (this.contenant?.contenus != null) {
      let nbAvant = 0;
      //      let nbArierre=0;
      for (let i = 0; i < this.contenant.contenus.length; i++) {
        if (this.contenant.contenus[i].isAvant) {
          const posi = this.listePosi2[Math.floor(Math.random() * this.listePosi2.length)];
          this.contenant.contenus[i].absisce = parseInt(this.listePointX[posi].split(',')[0], 10);
          this.contenant.contenus[i].ordonnee = parseInt(this.listePointX[posi].split(',')[1], 10);
          this.listePosi.push(posi);
          this.listeBleu.push(this.contenant.contenus[i]);
          this.listePosi2.splice(posi, 1);
          nbAvant++;
        } else {
          const circle = this.generateRandomCoordinates();
          this.contenant.contenus[i].absisce = circle.left;
          this.contenant.contenus[i].ordonnee = circle.top;
          this.listeOrange.push(this.contenant.contenus[i]);
          //        nbArierre++;
        }
      }
    }

    this.src = 'src/main/webapp/content/contenants/arriereplans/ap' + (this.contenant?.id ?? 0).toString() + '.png';
  }

  ngOnChanges(): void {
    // Récupération des données à chaque fois que l'input "monInput" est modifié
    this.loadLiens();
  }

  loadLiens(): void {
    //    alert("KIKI");
    if (this.contenant?.liens != null) {
      //      alert("COUCOU");
      for (let i = 0; i < this.contenant.liens.length; i++) {
        //     this.contenant.liens[i] = this.lienService.
        this.lienService.find(this.contenant.liens[i].id ?? 0).subscribe({
          next: (res: HttpResponse<ILien>) => {
            if (this.contenant?.liens != null) {
              this.contenant.liens[i] = res.body as ILien;
            }
          },
          error: () => {
            this.isSaving = false;
          },
        });
      }
    }
  }

  reveal(): void {
    this.revealText = true;
  }

  save(): void {
    this.isSaving = true;
    const contenu = this.createFromForm();
    if (contenu.id !== undefined) {
      this.subscribeToSaveResponse(this.contenuService.update(contenu));
    } else {
      this.subscribeToSaveResponse(this.contenuService.create(contenu));
    }
  }

  type(contenu: Contenu): string {
    if (contenu.type != null) {
      return contenu.type;
    } else {
      return '';
    }
  }

  nomContenant(): string {
    if (this.contenant != null) {
      if (this.contenant.nom != null) {
        return this.contenant.nom;
      }
    }
    return '';
  }

  proprioContenant(): string {
    return this.contenant?.proprietaire?.firstName ?? '';
  }

  nomContenantDuContenant(): string {
    if (this.contenant != null) {
      if (this.contenant.contenant != null) {
        return this.contenant.contenant.nom ?? '';
      }
    }
    return '';
  }

  idContenantDuContenant(): number {
    if (this.contenant != null) {
      if (this.contenant.contenant != null) {
        return this.contenant.contenant.id ?? 0;
      }
    }
    return 0;
  }

  trackId(_index: number, item: ILien): number {
    return item.id!;
  }

  villeCibleLien(lien: Lien): string {
    if (lien.villeCible?.nom != null) {
      return lien.villeCible.nom;
    }

    return '';
  }

  nbLiens(): number {
    if (this.contenant != null) {
      if (this.contenant.liens != null) {
        return this.contenant.liens.length;
      } else {
        return -1;
      }
    }
    return -2;
  }

  previousState(): void {
    window.history.back();
  }

  onTexteMouseEnter(texte: string): void {
    this.textHovered = true;
    this.setleTexte(texte);
  }

  onTextMouseLeave(): void {
    this.textHovered = false;
    this.resetleTexte();
  }

  onPhotoMouseEnter(photo: Photo): void {
    this.isHovered = true;
    this.setleCheminPhoto(photo);
    this.onTexteMouseEnter(photo.description ?? '');
  }

  onPhotoMouseLeave(): void {
    this.isHovered = false;
    this.resetleChemin();
    this.resetleTexte();
  }
  onImageMouseEnter(album: AlbumPhoto): void {
    this.isHovered = true;
    this.setleChemin(album);
    this.onTexteMouseEnter(album.description ?? '');
  }

  onImageMouseLeave(): void {
    this.isHovered = false;
    this.resetleChemin();
    this.resetleTexte();
  }

  //  openDialog(): any {
  //   alert(" HOOOOO ");
  //   const dialogRef =
  // this.modalService.open(AudioContemplationComponent, {
  //  centered: true,
  //  size:""
  // });}

  openGestionComponentDialog(): any {
    const modalRef = this.modalService.open(SystemeGestionComponent, {
      centered: true,
      //  size:""
    });
    modalRef.componentInstance.contenant = this.contenant;
  }

  openAudioDialog(audi: Audio): any {
    const modalRef = this.modalService.open(AudioContemplationComponent, {
      centered: true,
      //  size:""
    });
    modalRef.componentInstance.audio = audi;
  }

  openAlbumPhotoDialog(albu: AlbumPhoto): any {
    const modalRef = this.modalService.open(AlbumPhotoContemplationComponent, {
      centered: true,
      //  size:""
    });
    modalRef.componentInstance.album = albu;
  }

  openPhotoDialog(photo: Photo): any {
    const modalRef = this.modalService.open(PhotoContemplationComponent, {
      centered: true,
      //  size:""
    });
    modalRef.componentInstance.photo = photo;
  }

  cheminPhoto(photo: Photo): string {
    const result = '';
    const chmin = 'src/main/webapp/content/photos/bibi';
    if (photo.id != null && photo.ext != null) {
      //   alert(result.concat(chmin,this.audio.id.toString(),"mp3"));
      return result.concat(chmin, photo.id.toString(), '.', photo.ext);
    } else {
      return 'naze';
    }
  }

  loadToff(): void {
    if (this.contenant?.contenus?.length != null) {
      for (let i = 0; i < this.contenant.contenus.length; i++) {
        if (this.contenant.contenus[i].type === 'ALBUMPHOTO') {
          this.trouveChemin(this.contenant.contenus[i]);
        }
      }
    }
  }

  trouveChemin(album: AlbumPhoto): void {
    this.albumPhotoService.findFichiers(album.id ?? 0).subscribe({
      next: (res: HttpResponse<IListeFichiers>) => {
        //   album.cheminsPhotos = res.body?.nomsFichiers;
        this.ajouterCheminAlbumPhoto(album, res.body);
      },
      error: () => {
        this.isSaving = false;
      },
    });
  }

  ajouterCheminAlbumPhoto(album: AlbumPhoto, liste: IListeFichiers | null): void {
    album.cheminsPhotos = liste?.nomsFichiers;
  }

  cheminAlbum(album: AlbumPhoto): string {
    if (album.cheminsPhotos != null) {
      return (
        'src/main/webapp/content/albumphoto/bibi' +
        (album.id ?? 0).toString() +
        '/' +
        album.cheminsPhotos[Math.floor(Math.random() * album.cheminsPhotos.length)]
      );
    }
    return 'null';
  }

  setleTexte(texte: string): void {
    this.contenuTexte = texte;
  }

  resetleTexte(): void {
    this.contenuTexte = '';
  }

  setleCheminPhoto(photo: Photo): void {
    this.cheminToff = this.cheminPhoto(photo);
  }

  setleChemin(album: AlbumPhoto): void {
    this.cheminToff = this.cheminAlbum(album);
  }

  resetleChemin(): void {
    this.cheminToff = '';
  }

  openFilmDialog(film: Film): any {
    const modalRef = this.modalService.open(FilmContemplationComponent, {
      centered: true,
      //  size:""
    });
    modalRef.componentInstance.film = film;
  }

  generateRandomCoordinates(): { left: number; top: number } {
    const diameter = 20; // Diameter of the circle
    const maxX = 1200; // Maximum X coordinate to prevent circles from overflowing the container
    const maxY = 700; // Maximum Y coordinate to prevent circles from overflowing the container

    const left = Math.floor(Math.random() * (maxX - diameter));
    const top = Math.floor(Math.random() * (maxY - diameter));

    return { left, top };

    //   175;300   175;600    175;900
    //   350;300   350;600    350;900
    //   525;300   525;600    525;900
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    // Mettez à jour les coordonnées du cercle pour suivre le curseur
    this.circleX = event.clientX - this.el.nativeElement.getBoundingClientRect().left - this.circleRadius + 250;
    this.circleY = event.clientY - this.el.nativeElement.getBoundingClientRect().top - this.circleRadius - 100;

    this.cadreStyle = {
      position: 'absolute',
      top: '100px',
      left: '-250px',
      height: '80%',
      right: '-1200px',
      border: '2px solid #e9e9e9' /* Définit une bordure de 2 pixels solide de couleur noire */,
      'border-radius': '50px',
      'background-color': 'transparent',
      'clip-path':
        'circle(' +
        this.circleRadius.toString() +
        'px at ' +
        (this.circleX + this.circleRadius).toString() +
        'px ' +
        (this.circleY + this.circleRadius).toString() +
        'px)',
      'z-index': '2',
    };

    this.cadreOrga = {
      position: 'absolute',
      top: '100px',
      left: '-250px',
      height: '80%',
      right: '-1200px',
      border: '2px solid #d63ab4' /* Définit une bordure de 2 pixels solide de couleur noire */,
      'border-radius': '50px',
      'background-color': 'transparent',
      //      'clip-path':
      //        'circle(' +
      //        this.circleRadius.toString() +
      //        'px at ' +
      //        (this.circleX + this.circleRadius).toString() +
      //        'px ' +
      //        (this.circleY + this.circleRadius).toString() +
      //        'px)',
      'z-index': '2',
    };
  }

  isPointInsideCircle(x: number, y: number): boolean {
    const distance = Math.sqrt((x - this.circleRadius) ** 2 + (y - this.circleRadius) ** 2);
    return distance <= this.circleRadius;
  }

  onMouseOver(): void {
    this.showCircle = true;
  }

  onMouseLeave(): void {
    this.showCircle = false;
  }

  generateCoordinates(): any {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Tirage au sort des bords (haut, bas, gauche, droite)
    const randomSide = Math.floor(Math.random() * 4);

    let x = 0;
    let y = 0;

    //  alert(height);
    switch (randomSide) {
      case 0: // Haut
        x = Math.random() * width;
        return [x, y];
      case 1: // Bas
        x = Math.random() * width;
        y = height;
        return [x, y];
      case 2: // Gauche
        y = Math.random() * height;
        return [x, y];
      case 3: // Droite
        x = width;
        y = Math.random() * height;
        return [x, y];
    }

    return [x, y];
  }

  drawLines(): void {
    const centerX = this.canvas.nativeElement.width / 2;
    const centerY = this.canvas.nativeElement.height / 2;

    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const lineLength = Math.random() * 200 + 50; // Length of line between 50 and 250 pixels
      const endX = centerX + Math.cos(angle) * lineLength;
      const endY = centerY + Math.sin(angle) * lineLength;
      if (this.context != null) {
        this.context.beginPath();
        this.context.moveTo(centerX, centerY);
        this.context.lineTo(endX, endY);
        this.context.stroke();
      }
    }
  }

  generateTraits(): void {
    const centerX = (2 * window.innerWidth) / 3;
    const centerY = window.innerHeight / 2;
    if (this.contenant?.liens != null) {
      for (let i = 0; i < this.contenant.liens.length; i++) {
        // Générer 10 traits
        const randomX = Math.floor(Math.random() * 2001) - 1000;
        const randomY = Math.floor(Math.random() * 2001) - 1000;

        // Calculer les points de départ et d'arrivée
        const x1 = centerX;
        const y1 = centerY;
        //      const x2 = randomX;
        //      const y2 = randomY;

        const x2 = this.generateCoordinates()[0];
        const y2 = this.generateCoordinates()[1];
        //     alert(y3);
        //      this.traits.push({  x1, y1, x2, y2});
        this.traits.push({ x1, y1, x2, y2 });
      }
    }
  }

  switchCadre1(): void {
    if (this.isCadreAvantKlikay === false) {
      this.couleurBouton = '#afaeae';
      this.hauteurBouton = 85;
      this.hauteurBoutonDescri = 70;

      this.$couleurCadre1 = 'blue';
      this.bordureCadre = '2px solid ' + this.$couleurCadre1;
      this.fondCadre = 'radial-gradient(circle, black 65%, ' + this.$couleurCadre1 + '  90%)';
      this.shadow = '0px 0px 80px ' + this.$couleurCadre1;
      this.isCadreAvantKlikay = true;
      this.isCadreDescriKikay = false;
    } else {
      this.cardenumber = 0;
      this.couleurBouton = '#e23535';
      this.hauteurBouton = 70;
      this.hauteurBoutonDescri = 70;
      this.$couleurCadre1 = '#70ad3f';
      this.bordureCadre = '2px solid ' + this.$couleurCadre1;
      this.fondCadre = 'radial-gradient(circle, ' + this.$couleurCadre1 + ' 10%, black 70%)';
      this.shadow = '0px 0px 15px ' + this.$couleurCadre1;
      this.isCadreAvantKlikay = false;
      this.isCadreDescriKikay = false;
    }
    this.updatecadre();
  }

  switchCadre2(): void {
    if (this.isCadreDescriKikay === false) {
      this.couleurBouton = '#afaeae';
      this.hauteurBoutonDescri = 85;
      this.hauteurBouton = 70;
      this.$couleurCadre1 = 'orange';
      this.bordureCadre = '2px solid ' + this.$couleurCadre1;
      this.fondCadre = 'radial-gradient(circle, ' + this.$couleurCadre1 + ' 10%, black 70%)';
      this.shadow = '0px 0px 15px ' + this.$couleurCadre1;
      this.isCadreDescriKikay = true;
      this.isCadreAvantKlikay = false;
    } else {
      this.cardenumber = 0;
      this.couleurBouton = '#e23535';
      this.hauteurBoutonDescri = 70;
      this.hauteurBouton = 70;
      this.$couleurCadre1 = '#70ad3f';
      this.bordureCadre = '2px solid ' + this.$couleurCadre1;
      this.fondCadre = 'radial-gradient(circle, ' + this.$couleurCadre1 + ' 10%, black 70%)';
      this.shadow = '0px 0px 15px ' + this.$couleurCadre1;
      this.isCadreAvantKlikay = false;
      this.isCadreDescriKikay = false;
    }
    this.updatecadre();
  }

  //YAYAYA
  updatecadre(): void {
    this.cadre00 = {
      position: 'absolute',
      top: '100px',
      left: '-250px',
      height: '80%',
      right: '-1200px',
      'border-radius': '50px',
      'background-color': '#000',
      'z-index': '1',
      border: this.bordureCadre,
      background: this.fondCadre,
      'box-shadow': this.shadow,
    };
  }

  showleID(id: number): void {
    alert(id);
  }

  protected createFromForm(): IContenu {
    return {
      ...new Contenu(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      iconeContentType: this.editForm.get(['iconeContentType'])!.value,
      icone: this.editForm.get(['icone'])!.value,
      absisce: this.editForm.get(['absisce'])!.value,
      ordonnee: this.editForm.get(['ordonnee'])!.value,
      arriereplanContentType: this.editForm.get(['arriereplanContentType'])!.value,
      arriereplan: this.editForm.get(['arriereplan'])!.value,
      contenant: this.editForm.get(['contenant'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContenu>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }
}
