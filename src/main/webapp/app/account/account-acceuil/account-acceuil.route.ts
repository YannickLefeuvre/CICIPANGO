import { Route } from '@angular/router';

import { AccountAcceuilComponent } from './account-acceuil.component';

export const homeAccountRoute: Route = {
  path: 'accountpage',
  component: AccountAcceuilComponent,
  data: {
    pageTitle: 'Page Perso',
  },
};
