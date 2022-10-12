import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFilm, NewFilm } from '../film.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFilm for edit and NewFilmFormGroupInput for create.
 */
type FilmFormGroupInput = IFilm | PartialWithRequiredKeyOf<NewFilm>;

type FilmFormDefaults = Pick<NewFilm, 'id'>;

type FilmFormGroupContent = {
  id: FormControl<IFilm['id'] | NewFilm['id']>;
  images: FormControl<IFilm['images']>;
  imagesContentType: FormControl<IFilm['imagesContentType']>;
  description: FormControl<IFilm['description']>;
};

export type FilmFormGroup = FormGroup<FilmFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FilmFormService {
  createFilmFormGroup(film: FilmFormGroupInput = { id: null }): FilmFormGroup {
    const filmRawValue = {
      ...this.getFormDefaults(),
      ...film,
    };
    return new FormGroup<FilmFormGroupContent>({
      id: new FormControl(
        { value: filmRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      images: new FormControl(filmRawValue.images),
      imagesContentType: new FormControl(filmRawValue.imagesContentType),
      description: new FormControl(filmRawValue.description),
    });
  }

  getFilm(form: FilmFormGroup): IFilm | NewFilm {
    return form.getRawValue() as IFilm | NewFilm;
  }

  resetForm(form: FilmFormGroup, film: FilmFormGroupInput): void {
    const filmRawValue = { ...this.getFormDefaults(), ...film };
    form.reset(
      {
        ...filmRawValue,
        id: { value: filmRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FilmFormDefaults {
    return {
      id: null,
    };
  }
}
