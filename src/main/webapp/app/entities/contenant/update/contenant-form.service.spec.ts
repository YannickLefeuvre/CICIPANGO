import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../contenant.test-samples';

import { ContenantFormService } from './contenant-form.service';

describe('Contenant Form Service', () => {
  let service: ContenantFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContenantFormService);
  });

  describe('Service methods', () => {
    describe('createContenantFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createContenantFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            isCapital: expect.any(Object),
            icone: expect.any(Object),
            absisce: expect.any(Object),
            ordonnee: expect.any(Object),
            arriereplan: expect.any(Object),
            contenant: expect.any(Object),
          })
        );
      });

      it('passing IContenant should create a new form with FormGroup', () => {
        const formGroup = service.createContenantFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            isCapital: expect.any(Object),
            icone: expect.any(Object),
            absisce: expect.any(Object),
            ordonnee: expect.any(Object),
            arriereplan: expect.any(Object),
            contenant: expect.any(Object),
          })
        );
      });
    });

    describe('getContenant', () => {
      it('should return NewContenant for default Contenant initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createContenantFormGroup(sampleWithNewData);

        const contenant = service.getContenant(formGroup) as any;

        expect(contenant).toMatchObject(sampleWithNewData);
      });

      it('should return NewContenant for empty Contenant initial value', () => {
        const formGroup = service.createContenantFormGroup();

        const contenant = service.getContenant(formGroup) as any;

        expect(contenant).toMatchObject({});
      });

      it('should return IContenant', () => {
        const formGroup = service.createContenantFormGroup(sampleWithRequiredData);

        const contenant = service.getContenant(formGroup) as any;

        expect(contenant).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IContenant should not enable id FormControl', () => {
        const formGroup = service.createContenantFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewContenant should disable id FormControl', () => {
        const formGroup = service.createContenantFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
