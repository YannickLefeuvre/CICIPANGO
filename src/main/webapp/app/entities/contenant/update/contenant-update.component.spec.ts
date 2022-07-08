import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ContenantService } from '../service/contenant.service';
import { IContenant, Contenant } from '../contenant.model';

import { ContenantUpdateComponent } from './contenant-update.component';

describe('Contenant Management Update Component', () => {
  let comp: ContenantUpdateComponent;
  let fixture: ComponentFixture<ContenantUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let contenantService: ContenantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ContenantUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ContenantUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ContenantUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    contenantService = TestBed.inject(ContenantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Contenant query and add missing value', () => {
      const contenant: IContenant = { id: 456 };
      const contenant: IContenant = { id: 63570 };
      contenant.contenant = contenant;

      const contenantCollection: IContenant[] = [{ id: 6672 }];
      jest.spyOn(contenantService, 'query').mockReturnValue(of(new HttpResponse({ body: contenantCollection })));
      const additionalContenants = [contenant];
      const expectedCollection: IContenant[] = [...additionalContenants, ...contenantCollection];
      jest.spyOn(contenantService, 'addContenantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ contenant });
      comp.ngOnInit();

      expect(contenantService.query).toHaveBeenCalled();
      expect(contenantService.addContenantToCollectionIfMissing).toHaveBeenCalledWith(contenantCollection, ...additionalContenants);
      expect(comp.contenantsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const contenant: IContenant = { id: 456 };
      const contenant: IContenant = { id: 54294 };
      contenant.contenant = contenant;

      activatedRoute.data = of({ contenant });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(contenant));
      expect(comp.contenantsSharedCollection).toContain(contenant);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contenant>>();
      const contenant = { id: 123 };
      jest.spyOn(contenantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contenant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contenant }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(contenantService.update).toHaveBeenCalledWith(contenant);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contenant>>();
      const contenant = new Contenant();
      jest.spyOn(contenantService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contenant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contenant }));
      saveSubject.complete();

      // THEN
      expect(contenantService.create).toHaveBeenCalledWith(contenant);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contenant>>();
      const contenant = { id: 123 };
      jest.spyOn(contenantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contenant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(contenantService.update).toHaveBeenCalledWith(contenant);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackContenantById', () => {
      it('Should return tracked Contenant primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackContenantById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
