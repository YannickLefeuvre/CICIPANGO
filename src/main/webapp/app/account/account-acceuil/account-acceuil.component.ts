import { Component, OnInit } from '@angular/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { Contenant } from 'app/entities/contenant/contenant.model';
import { LoginService } from 'app/login/login.service';
import { Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-account-acceuil',
  templateUrl: './account-acceuil.component.html',
  styleUrls: ['./account-acceuil.component.scss'],
})
export class AccountAcceuilComponent implements OnInit {
  account: Account | null = null;
  contenants: Contenant[] | null = null;
  positions: number[] | null = null;
  ccreations = '#ffffff';
  cvoyages = '#ffffff';
  cnouveau = '#ffffff';
  creationactifs = false;
  voyagesactifs = false;

  private readonly destroy$ = new Subject<void>();

  constructor(protected accountService: AccountService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.swithLaccreations();

    if (this.account === null) {
      return;
    }
    //        alert(this.account.firstName);
    this.contenants = new Array(this.account.contenantsPropriete?.length);
    let i = 0;
    for (const contenant of this.account.contenantsPropriete ?? []) {
      contenant.ordonnee = this.hauteurAlea(0, 500);
      this.contenants[i] = contenant;
      i++;
    }
  }

  swithLaccreations(): void {
    if ((this.contenants?.length ?? 0) < 1) {
      this.reloadLesContenants();
    }

    this.ccreations = '#d8c689';
    this.cvoyages = '#ffffff';
    this.cnouveau = '#ffffff';
    this.creationactifs = true;
    this.voyagesactifs = false;
  }

  swithLacvoyages(): void {
    this.ccreations = '#ffffff';
    this.cvoyages = '#c71d1d';
    this.cnouveau = '#ffffff';
    this.creationactifs = false;
    this.voyagesactifs = true;
  }

  logout(): void {
    this.loginService.logout();
  }

  reloadLesContenants(): void {
    if (this.account === null) {
      return;
    }
    //        alert(this.account.firstName);
    this.contenants = new Array(this.account.contenantsPropriete?.length);
    let i = 0;
    for (const contenant of this.account.contenantsPropriete ?? []) {
      contenant.ordonnee = this.hauteurAlea(0, 500);
      this.contenants[i] = contenant;
      i++;
    }
  }

  alea(): any {
    const images = document.getElementsByClassName('mumu');
    // alert(images.length);
    for (let i = 0; i < images.length; i++) {
      const containerHeight = 500; // Hauteur totale de votre conteneur parent
      const imageHeight = (images[i] as HTMLElement).offsetHeight; // Hauteur de chaque image
      const maxTop = containerHeight - imageHeight; // Position maximale en haut
      const randomTop = Math.random() * maxTop;

      (images[i] as HTMLElement).style.top = randomTop.toString() + 'px';
    }
    return null;
  }

  hauteurAlea(min: number, max: number): number {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
  }

  swithLacnouveau(): void {
    this.ccreations = '#ffffff';
    this.cvoyages = '#c71d1d';
    this.cnouveau = '#ffffff';
  }

  cheminIcone(contenant: Contenant): string {
    const result = '';
    const chmin = 'src/main/webapp/content/contenants/icone/ico';
    if (contenant.id != null && contenant.iconeContentType != null) {
      //   alert(result.concat(chmin,this.audio.id.toString(),"mp3"));
      return result.concat('url(', chmin, contenant.id.toString(), '.', contenant.iconeContentType, ')');
      //  return chmin;
    } else {
      return 'naze';
    }
  }
}
