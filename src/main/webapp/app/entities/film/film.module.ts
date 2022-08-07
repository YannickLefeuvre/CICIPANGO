import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FilmComponent } from './list/film.component';
import { FilmDetailComponent } from './detail/film-detail.component';
import { FilmUpdateComponent } from './update/film-update.component';
import { FilmDeleteDialogComponent } from './delete/film-delete-dialog.component';
import { FilmRoutingModule } from './route/film-routing.module';
import { CreationComponent } from './creation/creation.component';

@NgModule({
  imports: [SharedModule, FilmRoutingModule],
  declarations: [FilmComponent, FilmDetailComponent, FilmUpdateComponent, FilmDeleteDialogComponent, CreationComponent],
  entryComponents: [FilmDeleteDialogComponent],
})
export class FilmModule {}
