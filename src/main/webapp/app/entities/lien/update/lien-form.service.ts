import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILien, NewLien } from '../lien.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILien for edit and NewLienFormGroupInput for create.
 */
type LienFormGroupInput = ILien | PartialWithRequiredKeyOf<NewLien>;

type LienFormDefaults = Pick<NewLien, 'id'>;

type LienFormGroupContent = {
  id: FormControl<ILien['id'] | NewLien['id']>;
  nom: FormControl<ILien['nom']>;
  icone: FormControl<ILien['icone']>;
  iconeContentType: FormControl<ILien['iconeContentType']>;
  absisce: FormControl<ILien['absisce']>;
  ordonnee: FormControl<ILien['ordonnee']>;
  arriereplan: FormControl<ILien['arriereplan']>;
  arriereplanContentType: FormControl<ILien['arriereplanContentType']>;
  villeOrigine: FormControl<ILien['villeOrigine']>;
  villeCible: FormControl<ILien['villeCible']>;
  contenant: FormControl<ILien['contenant']>;
};

export type LienFormGroup = FormGroup<LienFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LienFormService {
  createLienFormGroup(lien: LienFormGroupInput = { id: null }): LienFormGroup {
    const lienRawValue = {
      ...this.getFormDefaults(),
      ...lien,
    };
    return new FormGroup<LienFormGroupContent>({
      id: new FormControl(
        { value: lienRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(lienRawValue.nom, {
        validators: [Validators.required],
      }),
      icone: new FormControl(lienRawValue.icone),
      iconeContentType: new FormControl(lienRawValue.iconeContentType),
      absisce: new FormControl(lienRawValue.absisce),
      ordonnee: new FormControl(lienRawValue.ordonnee),
      arriereplan: new FormControl(lienRawValue.arriereplan),
      arriereplanContentType: new FormControl(lienRawValue.arriereplanContentType),
      villeOrigine: new FormControl(lienRawValue.villeOrigine),
      villeCible: new FormControl(lienRawValue.villeCible),
      contenant: new FormControl(lienRawValue.contenant),
    });
  }

  getLien(form: LienFormGroup): ILien | NewLien {
    return form.getRawValue() as ILien | NewLien;
  }

  resetForm(form: LienFormGroup, lien: LienFormGroupInput): void {
    const lienRawValue = { ...this.getFormDefaults(), ...lien };
    form.reset(
      {
        ...lienRawValue,
        id: { value: lienRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LienFormDefaults {
    return {
      id: null,
    };
  }
}
