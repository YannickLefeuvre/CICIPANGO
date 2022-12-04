import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AlbumPhotoComponent } from './list/album-photo.component';
import { AlbumPhotoDetailComponent } from './detail/album-photo-detail.component';
import { AlbumPhotoUpdateComponent } from './update/album-photo-update.component';
import { AlbumPhotoDeleteDialogComponent } from './delete/album-photo-delete-dialog.component';
import { AlbumPhotoRoutingModule } from './route/album-photo-routing.module';
import { CreationAlbumPhotoComponent } from './creation-album-photo/creation-album-photo.component';
import { AlbumPhotoContemplationComponent } from './album-photo-contemplation/album-photo-contemplation.component';

@NgModule({
  imports: [SharedModule, AlbumPhotoRoutingModule],
  declarations: [
    AlbumPhotoComponent,
    AlbumPhotoDetailComponent,
    AlbumPhotoUpdateComponent,
    AlbumPhotoDeleteDialogComponent,
    CreationAlbumPhotoComponent,
    AlbumPhotoContemplationComponent,
  ],
  entryComponents: [AlbumPhotoDeleteDialogComponent],
})
export class AlbumPhotoModule {}
