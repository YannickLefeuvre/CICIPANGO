import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVideo, NewVideo } from '../video.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVideo for edit and NewVideoFormGroupInput for create.
 */
type VideoFormGroupInput = IVideo | PartialWithRequiredKeyOf<NewVideo>;

type VideoFormDefaults = Pick<NewVideo, 'id'>;

type VideoFormGroupContent = {
  id: FormControl<IVideo['id'] | NewVideo['id']>;
  url: FormControl<IVideo['url']>;
};

export type VideoFormGroup = FormGroup<VideoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VideoFormService {
  createVideoFormGroup(video: VideoFormGroupInput = { id: null }): VideoFormGroup {
    const videoRawValue = {
      ...this.getFormDefaults(),
      ...video,
    };
    return new FormGroup<VideoFormGroupContent>({
      id: new FormControl(
        { value: videoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      url: new FormControl(videoRawValue.url),
    });
  }

  getVideo(form: VideoFormGroup): IVideo | NewVideo {
    return form.getRawValue() as IVideo | NewVideo;
  }

  resetForm(form: VideoFormGroup, video: VideoFormGroupInput): void {
    const videoRawValue = { ...this.getFormDefaults(), ...video };
    form.reset(
      {
        ...videoRawValue,
        id: { value: videoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VideoFormDefaults {
    return {
      id: null,
    };
  }
}
