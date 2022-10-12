import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAlbumPhoto, NewAlbumPhoto } from '../album-photo.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAlbumPhoto for edit and NewAlbumPhotoFormGroupInput for create.
 */
type AlbumPhotoFormGroupInput = IAlbumPhoto | PartialWithRequiredKeyOf<NewAlbumPhoto>;

type AlbumPhotoFormDefaults = Pick<NewAlbumPhoto, 'id'>;

type AlbumPhotoFormGroupContent = {
  id: FormControl<IAlbumPhoto['id'] | NewAlbumPhoto['id']>;
  images: FormControl<IAlbumPhoto['images']>;
  imagesContentType: FormControl<IAlbumPhoto['imagesContentType']>;
  description: FormControl<IAlbumPhoto['description']>;
};

export type AlbumPhotoFormGroup = FormGroup<AlbumPhotoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AlbumPhotoFormService {
  createAlbumPhotoFormGroup(albumPhoto: AlbumPhotoFormGroupInput = { id: null }): AlbumPhotoFormGroup {
    const albumPhotoRawValue = {
      ...this.getFormDefaults(),
      ...albumPhoto,
    };
    return new FormGroup<AlbumPhotoFormGroupContent>({
      id: new FormControl(
        { value: albumPhotoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      images: new FormControl(albumPhotoRawValue.images),
      imagesContentType: new FormControl(albumPhotoRawValue.imagesContentType),
      description: new FormControl(albumPhotoRawValue.description),
    });
  }

  getAlbumPhoto(form: AlbumPhotoFormGroup): IAlbumPhoto | NewAlbumPhoto {
    return form.getRawValue() as IAlbumPhoto | NewAlbumPhoto;
  }

  resetForm(form: AlbumPhotoFormGroup, albumPhoto: AlbumPhotoFormGroupInput): void {
    const albumPhotoRawValue = { ...this.getFormDefaults(), ...albumPhoto };
    form.reset(
      {
        ...albumPhotoRawValue,
        id: { value: albumPhotoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AlbumPhotoFormDefaults {
    return {
      id: null,
    };
  }
}
