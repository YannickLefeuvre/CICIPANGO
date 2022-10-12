import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISerie, NewSerie } from '../serie.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISerie for edit and NewSerieFormGroupInput for create.
 */
type SerieFormGroupInput = ISerie | PartialWithRequiredKeyOf<NewSerie>;

type SerieFormDefaults = Pick<NewSerie, 'id'>;

type SerieFormGroupContent = {
  id: FormControl<ISerie['id'] | NewSerie['id']>;
  images: FormControl<ISerie['images']>;
  imagesContentType: FormControl<ISerie['imagesContentType']>;
  description: FormControl<ISerie['description']>;
};

export type SerieFormGroup = FormGroup<SerieFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SerieFormService {
  createSerieFormGroup(serie: SerieFormGroupInput = { id: null }): SerieFormGroup {
    const serieRawValue = {
      ...this.getFormDefaults(),
      ...serie,
    };
    return new FormGroup<SerieFormGroupContent>({
      id: new FormControl(
        { value: serieRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      images: new FormControl(serieRawValue.images),
      imagesContentType: new FormControl(serieRawValue.imagesContentType),
      description: new FormControl(serieRawValue.description),
    });
  }

  getSerie(form: SerieFormGroup): ISerie | NewSerie {
    return form.getRawValue() as ISerie | NewSerie;
  }

  resetForm(form: SerieFormGroup, serie: SerieFormGroupInput): void {
    const serieRawValue = { ...this.getFormDefaults(), ...serie };
    form.reset(
      {
        ...serieRawValue,
        id: { value: serieRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SerieFormDefaults {
    return {
      id: null,
    };
  }
}
