import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILivre, NewLivre } from '../livre.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILivre for edit and NewLivreFormGroupInput for create.
 */
type LivreFormGroupInput = ILivre | PartialWithRequiredKeyOf<NewLivre>;

type LivreFormDefaults = Pick<NewLivre, 'id'>;

type LivreFormGroupContent = {
  id: FormControl<ILivre['id'] | NewLivre['id']>;
  images: FormControl<ILivre['images']>;
  imagesContentType: FormControl<ILivre['imagesContentType']>;
  description: FormControl<ILivre['description']>;
};

export type LivreFormGroup = FormGroup<LivreFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LivreFormService {
  createLivreFormGroup(livre: LivreFormGroupInput = { id: null }): LivreFormGroup {
    const livreRawValue = {
      ...this.getFormDefaults(),
      ...livre,
    };
    return new FormGroup<LivreFormGroupContent>({
      id: new FormControl(
        { value: livreRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      images: new FormControl(livreRawValue.images),
      imagesContentType: new FormControl(livreRawValue.imagesContentType),
      description: new FormControl(livreRawValue.description),
    });
  }

  getLivre(form: LivreFormGroup): ILivre | NewLivre {
    return form.getRawValue() as ILivre | NewLivre;
  }

  resetForm(form: LivreFormGroup, livre: LivreFormGroupInput): void {
    const livreRawValue = { ...this.getFormDefaults(), ...livre };
    form.reset(
      {
        ...livreRawValue,
        id: { value: livreRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LivreFormDefaults {
    return {
      id: null,
    };
  }
}
