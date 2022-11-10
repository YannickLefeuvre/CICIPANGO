import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AudioComponent } from './list/audio.component';
import { AudioDetailComponent } from './detail/audio-detail.component';
import { AudioUpdateComponent } from './update/audio-update.component';
import { AudioDeleteDialogComponent } from './delete/audio-delete-dialog.component';
import { AudioRoutingModule } from './route/audio-routing.module';
import { CreationAudioComponent } from './creation-audio/creation-audio.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [SharedModule, AudioRoutingModule, MatDialogModule],
  declarations: [AudioComponent, AudioDetailComponent, AudioUpdateComponent, AudioDeleteDialogComponent, CreationAudioComponent],
  entryComponents: [AudioDeleteDialogComponent],
})
export class AudioModule {}
