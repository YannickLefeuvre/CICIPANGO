import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../serie.test-samples';

import { SerieFormService } from './serie-form.service';

describe('Serie Form Service', () => {
  let service: SerieFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerieFormService);
  });

  describe('Service methods', () => {
    describe('createSerieFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSerieFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            images: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });

      it('passing ISerie should create a new form with FormGroup', () => {
        const formGroup = service.createSerieFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            images: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });
    });

    describe('getSerie', () => {
      it('should return NewSerie for default Serie initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSerieFormGroup(sampleWithNewData);

        const serie = service.getSerie(formGroup) as any;

        expect(serie).toMatchObject(sampleWithNewData);
      });

      it('should return NewSerie for empty Serie initial value', () => {
        const formGroup = service.createSerieFormGroup();

        const serie = service.getSerie(formGroup) as any;

        expect(serie).toMatchObject({});
      });

      it('should return ISerie', () => {
        const formGroup = service.createSerieFormGroup(sampleWithRequiredData);

        const serie = service.getSerie(formGroup) as any;

        expect(serie).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISerie should not enable id FormControl', () => {
        const formGroup = service.createSerieFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSerie should disable id FormControl', () => {
        const formGroup = service.createSerieFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
