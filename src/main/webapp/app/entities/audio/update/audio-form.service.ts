import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAudio, NewAudio } from '../audio.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAudio for edit and NewAudioFormGroupInput for create.
 */
type AudioFormGroupInput = IAudio | PartialWithRequiredKeyOf<NewAudio>;

type AudioFormDefaults = Pick<NewAudio, 'id'>;

type AudioFormGroupContent = {
  id: FormControl<IAudio['id'] | NewAudio['id']>;
  url: FormControl<IAudio['url']>;
};

export type AudioFormGroup = FormGroup<AudioFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AudioFormService {
  createAudioFormGroup(audio: AudioFormGroupInput = { id: null }): AudioFormGroup {
    const audioRawValue = {
      ...this.getFormDefaults(),
      ...audio,
    };
    return new FormGroup<AudioFormGroupContent>({
      id: new FormControl(
        { value: audioRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      url: new FormControl(audioRawValue.url),
    });
  }

  getAudio(form: AudioFormGroup): IAudio | NewAudio {
    return form.getRawValue() as IAudio | NewAudio;
  }

  resetForm(form: AudioFormGroup, audio: AudioFormGroupInput): void {
    const audioRawValue = { ...this.getFormDefaults(), ...audio };
    form.reset(
      {
        ...audioRawValue,
        id: { value: audioRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AudioFormDefaults {
    return {
      id: null,
    };
  }
}
