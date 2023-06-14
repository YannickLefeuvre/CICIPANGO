import { Component, OnInit } from '@angular/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { Contenant } from 'app/entities/contenant/contenant.model';
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
  ccreations = '#ffffff';
  cvoyages = '#ffffff';
  cnouveau = '#ffffff';
  creationactifs = false;
  voyagesactifs = false;

  private readonly destroy$ = new Subject<void>();

  constructor(protected accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  swithLaccreations(): void {
    this.ccreations = '#c71d1d';
    this.cvoyages = '#ffffff';
    this.cnouveau = '#ffffff';
    this.creationactifs = true;
    this.voyagesactifs = false;
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

  swithLacvoyages(): void {
    this.ccreations = '#ffffff';
    this.cvoyages = '#c71d1d';
    this.cnouveau = '#ffffff';
    this.creationactifs = false;
    this.voyagesactifs = true;
  }

  swithLacnouveau(): void {
    this.ccreations = '#ffffff';
    this.cvoyages = '#ffffff';
    this.cnouveau = '#c71d1d';
  }

  cheminIcone(contenant: Contenant): string {
    const result = '';
    const chmin = 'src/main/webapp/content/contenants/icone/ico';
    if (contenant.id != null && contenant.iconeContentType != null) {
      //   alert(result.concat(chmin,this.audio.id.toString(),"mp3"));
      return result.concat(chmin, contenant.id.toString(), '.', contenant.iconeContentType);
    } else {
      return 'naze';
    }
  }
}
