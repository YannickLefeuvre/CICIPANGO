import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../album-photo.test-samples';

import { AlbumPhotoFormService } from './album-photo-form.service';

describe('AlbumPhoto Form Service', () => {
  let service: AlbumPhotoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlbumPhotoFormService);
  });

  describe('Service methods', () => {
    describe('createAlbumPhotoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAlbumPhotoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            images: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });

      it('passing IAlbumPhoto should create a new form with FormGroup', () => {
        const formGroup = service.createAlbumPhotoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            images: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });
    });

    describe('getAlbumPhoto', () => {
      it('should return NewAlbumPhoto for default AlbumPhoto initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAlbumPhotoFormGroup(sampleWithNewData);

        const albumPhoto = service.getAlbumPhoto(formGroup) as any;

        expect(albumPhoto).toMatchObject(sampleWithNewData);
      });

      it('should return NewAlbumPhoto for empty AlbumPhoto initial value', () => {
        const formGroup = service.createAlbumPhotoFormGroup();

        const albumPhoto = service.getAlbumPhoto(formGroup) as any;

        expect(albumPhoto).toMatchObject({});
      });

      it('should return IAlbumPhoto', () => {
        const formGroup = service.createAlbumPhotoFormGroup(sampleWithRequiredData);

        const albumPhoto = service.getAlbumPhoto(formGroup) as any;

        expect(albumPhoto).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAlbumPhoto should not enable id FormControl', () => {
        const formGroup = service.createAlbumPhotoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAlbumPhoto should disable id FormControl', () => {
        const formGroup = service.createAlbumPhotoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
