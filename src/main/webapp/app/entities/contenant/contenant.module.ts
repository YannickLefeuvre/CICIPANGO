import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ContenantComponent } from './list/contenant.component';
import { ContenantDetailComponent } from './detail/contenant-detail.component';
import { ContenantUpdateComponent } from './update/contenant-update.component';
import { ContenantDeleteDialogComponent } from './delete/contenant-delete-dialog.component';
import { ContenantRoutingModule } from './route/contenant-routing.module';
import { SystemeComponent } from './systeme/systeme.component';
import { ContenantCreationComponent } from './creation/creation.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [SharedModule, ContenantRoutingModule, MatDialogModule],
  declarations: [
    ContenantComponent,
    ContenantDetailComponent,
    ContenantUpdateComponent,
    ContenantDeleteDialogComponent,
    SystemeComponent,
    ContenantCreationComponent,
  ],
  entryComponents: [ContenantDeleteDialogComponent],

  bootstrap: [SystemeComponent],
})
export class ContenantModule {}
