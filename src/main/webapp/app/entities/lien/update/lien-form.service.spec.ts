import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../lien.test-samples';

import { LienFormService } from './lien-form.service';

describe('Lien Form Service', () => {
  let service: LienFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LienFormService);
  });

  describe('Service methods', () => {
    describe('createLienFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLienFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            icone: expect.any(Object),
            absisce: expect.any(Object),
            ordonnee: expect.any(Object),
            arriereplan: expect.any(Object),
            villeOrigine: expect.any(Object),
            villeCible: expect.any(Object),
            contenant: expect.any(Object),
          })
        );
      });

      it('passing ILien should create a new form with FormGroup', () => {
        const formGroup = service.createLienFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            icone: expect.any(Object),
            absisce: expect.any(Object),
            ordonnee: expect.any(Object),
            arriereplan: expect.any(Object),
            villeOrigine: expect.any(Object),
            villeCible: expect.any(Object),
            contenant: expect.any(Object),
          })
        );
      });
    });

    describe('getLien', () => {
      it('should return NewLien for default Lien initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLienFormGroup(sampleWithNewData);

        const lien = service.getLien(formGroup) as any;

        expect(lien).toMatchObject(sampleWithNewData);
      });

      it('should return NewLien for empty Lien initial value', () => {
        const formGroup = service.createLienFormGroup();

        const lien = service.getLien(formGroup) as any;

        expect(lien).toMatchObject({});
      });

      it('should return ILien', () => {
        const formGroup = service.createLienFormGroup(sampleWithRequiredData);

        const lien = service.getLien(formGroup) as any;

        expect(lien).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILien should not enable id FormControl', () => {
        const formGroup = service.createLienFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLien should disable id FormControl', () => {
        const formGroup = service.createLienFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
