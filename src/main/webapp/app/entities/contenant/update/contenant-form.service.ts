import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IContenant, NewContenant } from '../contenant.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IContenant for edit and NewContenantFormGroupInput for create.
 */
type ContenantFormGroupInput = IContenant | PartialWithRequiredKeyOf<NewContenant>;

type ContenantFormDefaults = Pick<NewContenant, 'id' | 'isCapital'>;

type ContenantFormGroupContent = {
  id: FormControl<IContenant['id'] | NewContenant['id']>;
  nom: FormControl<IContenant['nom']>;
  isCapital: FormControl<IContenant['isCapital']>;
  icone: FormControl<IContenant['icone']>;
  iconeContentType: FormControl<IContenant['iconeContentType']>;
  absisce: FormControl<IContenant['absisce']>;
  ordonnee: FormControl<IContenant['ordonnee']>;
  arriereplan: FormControl<IContenant['arriereplan']>;
  arriereplanContentType: FormControl<IContenant['arriereplanContentType']>;
  contenant: FormControl<IContenant['contenant']>;
};

export type ContenantFormGroup = FormGroup<ContenantFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ContenantFormService {
  createContenantFormGroup(contenant: ContenantFormGroupInput = { id: null }): ContenantFormGroup {
    const contenantRawValue = {
      ...this.getFormDefaults(),
      ...contenant,
    };
    return new FormGroup<ContenantFormGroupContent>({
      id: new FormControl(
        { value: contenantRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(contenantRawValue.nom, {
        validators: [Validators.required],
      }),
      isCapital: new FormControl(contenantRawValue.isCapital, {
        validators: [Validators.required],
      }),
      icone: new FormControl(contenantRawValue.icone),
      iconeContentType: new FormControl(contenantRawValue.iconeContentType),
      absisce: new FormControl(contenantRawValue.absisce),
      ordonnee: new FormControl(contenantRawValue.ordonnee),
      arriereplan: new FormControl(contenantRawValue.arriereplan),
      arriereplanContentType: new FormControl(contenantRawValue.arriereplanContentType),
      contenant: new FormControl(contenantRawValue.contenant),
    });
  }

  getContenant(form: ContenantFormGroup): IContenant | NewContenant {
    return form.getRawValue() as IContenant | NewContenant;
  }

  resetForm(form: ContenantFormGroup, contenant: ContenantFormGroupInput): void {
    const contenantRawValue = { ...this.getFormDefaults(), ...contenant };
    form.reset(
      {
        ...contenantRawValue,
        id: { value: contenantRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ContenantFormDefaults {
    return {
      id: null,
      isCapital: false,
    };
  }
}
