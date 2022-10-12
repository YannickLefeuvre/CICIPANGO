import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../livre.test-samples';

import { LivreFormService } from './livre-form.service';

describe('Livre Form Service', () => {
  let service: LivreFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivreFormService);
  });

  describe('Service methods', () => {
    describe('createLivreFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLivreFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            images: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });

      it('passing ILivre should create a new form with FormGroup', () => {
        const formGroup = service.createLivreFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            images: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });
    });

    describe('getLivre', () => {
      it('should return NewLivre for default Livre initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLivreFormGroup(sampleWithNewData);

        const livre = service.getLivre(formGroup) as any;

        expect(livre).toMatchObject(sampleWithNewData);
      });

      it('should return NewLivre for empty Livre initial value', () => {
        const formGroup = service.createLivreFormGroup();

        const livre = service.getLivre(formGroup) as any;

        expect(livre).toMatchObject({});
      });

      it('should return ILivre', () => {
        const formGroup = service.createLivreFormGroup(sampleWithRequiredData);

        const livre = service.getLivre(formGroup) as any;

        expect(livre).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILivre should not enable id FormControl', () => {
        const formGroup = service.createLivreFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLivre should disable id FormControl', () => {
        const formGroup = service.createLivreFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
