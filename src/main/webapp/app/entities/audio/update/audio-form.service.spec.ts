import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../audio.test-samples';

import { AudioFormService } from './audio-form.service';

describe('Audio Form Service', () => {
  let service: AudioFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioFormService);
  });

  describe('Service methods', () => {
    describe('createAudioFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAudioFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            url: expect.any(Object),
          })
        );
      });

      it('passing IAudio should create a new form with FormGroup', () => {
        const formGroup = service.createAudioFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            url: expect.any(Object),
          })
        );
      });
    });

    describe('getAudio', () => {
      it('should return NewAudio for default Audio initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAudioFormGroup(sampleWithNewData);

        const audio = service.getAudio(formGroup) as any;

        expect(audio).toMatchObject(sampleWithNewData);
      });

      it('should return NewAudio for empty Audio initial value', () => {
        const formGroup = service.createAudioFormGroup();

        const audio = service.getAudio(formGroup) as any;

        expect(audio).toMatchObject({});
      });

      it('should return IAudio', () => {
        const formGroup = service.createAudioFormGroup(sampleWithRequiredData);

        const audio = service.getAudio(formGroup) as any;

        expect(audio).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAudio should not enable id FormControl', () => {
        const formGroup = service.createAudioFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAudio should disable id FormControl', () => {
        const formGroup = service.createAudioFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
