import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IContenu, NewContenu } from '../contenu.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IContenu for edit and NewContenuFormGroupInput for create.
 */
type ContenuFormGroupInput = IContenu | PartialWithRequiredKeyOf<NewContenu>;

type ContenuFormDefaults = Pick<NewContenu, 'id'>;

type ContenuFormGroupContent = {
  id: FormControl<IContenu['id'] | NewContenu['id']>;
  nom: FormControl<IContenu['nom']>;
  icone: FormControl<IContenu['icone']>;
  iconeContentType: FormControl<IContenu['iconeContentType']>;
  absisce: FormControl<IContenu['absisce']>;
  ordonnee: FormControl<IContenu['ordonnee']>;
  arriereplan: FormControl<IContenu['arriereplan']>;
  arriereplanContentType: FormControl<IContenu['arriereplanContentType']>;
  nom: FormControl<IContenu['nom']>;
  type: FormControl<IContenu['type']>;
  contenant: FormControl<IContenu['contenant']>;
};

export type ContenuFormGroup = FormGroup<ContenuFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ContenuFormService {
  createContenuFormGroup(contenu: ContenuFormGroupInput = { id: null }): ContenuFormGroup {
    const contenuRawValue = {
      ...this.getFormDefaults(),
      ...contenu,
    };
    return new FormGroup<ContenuFormGroupContent>({
      id: new FormControl(
        { value: contenuRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(contenuRawValue.nom, {
        validators: [Validators.required],
      }),
      icone: new FormControl(contenuRawValue.icone),
      iconeContentType: new FormControl(contenuRawValue.iconeContentType),
      absisce: new FormControl(contenuRawValue.absisce),
      ordonnee: new FormControl(contenuRawValue.ordonnee),
      arriereplan: new FormControl(contenuRawValue.arriereplan),
      arriereplanContentType: new FormControl(contenuRawValue.arriereplanContentType),
      nom: new FormControl(contenuRawValue.nom),
      type: new FormControl(contenuRawValue.type),
      contenant: new FormControl(contenuRawValue.contenant),
    });
  }

  getContenu(form: ContenuFormGroup): IContenu | NewContenu {
    return form.getRawValue() as IContenu | NewContenu;
  }

  resetForm(form: ContenuFormGroup, contenu: ContenuFormGroupInput): void {
    const contenuRawValue = { ...this.getFormDefaults(), ...contenu };
    form.reset(
      {
        ...contenuRawValue,
        id: { value: contenuRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ContenuFormDefaults {
    return {
      id: null,
    };
  }
}
