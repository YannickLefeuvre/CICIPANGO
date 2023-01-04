import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LienComponent } from './list/lien.component';
import { LienDetailComponent } from './detail/lien-detail.component';
import { LienUpdateComponent } from './update/lien-update.component';
import { LienDeleteDialogComponent } from './delete/lien-delete-dialog.component';
import { LienRoutingModule } from './route/lien-routing.module';
import { LienCreationComponent } from './lien-creation/lien-creation.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [SharedModule, LienRoutingModule, MatMenuModule],
  declarations: [LienComponent, LienDetailComponent, LienUpdateComponent, LienDeleteDialogComponent, LienCreationComponent],
  entryComponents: [LienDeleteDialogComponent],
})
export class LienModule {}
