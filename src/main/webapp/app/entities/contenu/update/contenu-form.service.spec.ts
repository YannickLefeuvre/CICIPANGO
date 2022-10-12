import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../contenu.test-samples';

import { ContenuFormService } from './contenu-form.service';

describe('Contenu Form Service', () => {
  let service: ContenuFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContenuFormService);
  });

  describe('Service methods', () => {
    describe('createContenuFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createContenuFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            icone: expect.any(Object),
            absisce: expect.any(Object),
            ordonnee: expect.any(Object),
            arriereplan: expect.any(Object),
            nom: expect.any(Object),
            type: expect.any(Object),
            contenant: expect.any(Object),
          })
        );
      });

      it('passing IContenu should create a new form with FormGroup', () => {
        const formGroup = service.createContenuFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            icone: expect.any(Object),
            absisce: expect.any(Object),
            ordonnee: expect.any(Object),
            arriereplan: expect.any(Object),
            nom: expect.any(Object),
            type: expect.any(Object),
            contenant: expect.any(Object),
          })
        );
      });
    });

    describe('getContenu', () => {
      it('should return NewContenu for default Contenu initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createContenuFormGroup(sampleWithNewData);

        const contenu = service.getContenu(formGroup) as any;

        expect(contenu).toMatchObject(sampleWithNewData);
      });

      it('should return NewContenu for empty Contenu initial value', () => {
        const formGroup = service.createContenuFormGroup();

        const contenu = service.getContenu(formGroup) as any;

        expect(contenu).toMatchObject({});
      });

      it('should return IContenu', () => {
        const formGroup = service.createContenuFormGroup(sampleWithRequiredData);

        const contenu = service.getContenu(formGroup) as any;

        expect(contenu).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IContenu should not enable id FormControl', () => {
        const formGroup = service.createContenuFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewContenu should disable id FormControl', () => {
        const formGroup = service.createContenuFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
