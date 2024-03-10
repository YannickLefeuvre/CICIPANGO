import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ContenantComponent } from './list/contenant.component';
import { ContenantDetailComponent } from './detail/contenant-detail.component';
import { ContenantUpdateComponent } from './update/contenant-update.component';
import { ContenantDeleteDialogComponent } from './delete/contenant-delete-dialog.component';
import { ContenantRoutingModule } from './route/contenant-routing.module';
import { SystemeComponent } from './systeme/systeme.component';
import { ContenantCreationComponent } from './creation/creation.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegistry } from '@angular/material/icon';
import { SystemeGestionComponent } from './systeme-gestion/systeme-gestion.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [SharedModule, ContenantRoutingModule, NgxDropzoneModule, MatIconModule, DragDropModule, FormsModule],
  declarations: [
    ContenantComponent,
    ContenantDetailComponent,
    ContenantUpdateComponent,
    ContenantDeleteDialogComponent,
    SystemeComponent,
    ContenantCreationComponent,
    SystemeGestionComponent,
  ],
  providers: [MatIconRegistry],
  entryComponents: [ContenantDeleteDialogComponent],

  bootstrap: [SystemeComponent],
})
export class ContenantModule {}
