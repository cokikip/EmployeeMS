jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DepartmentAppService } from '../service/department-app.service';
import { IDepartmentApp, DepartmentApp } from '../department-app.model';
import { ILocationApp } from 'app/entities/location-app/location-app.model';
import { LocationAppService } from 'app/entities/location-app/service/location-app.service';

import { DepartmentAppUpdateComponent } from './department-app-update.component';

describe('Component Tests', () => {
  describe('DepartmentApp Management Update Component', () => {
    let comp: DepartmentAppUpdateComponent;
    let fixture: ComponentFixture<DepartmentAppUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let departmentService: DepartmentAppService;
    let locationService: LocationAppService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DepartmentAppUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DepartmentAppUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DepartmentAppUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      departmentService = TestBed.inject(DepartmentAppService);
      locationService = TestBed.inject(LocationAppService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call location query and add missing value', () => {
        const department: IDepartmentApp = { id: 456 };
        const location: ILocationApp = { id: 16862 };
        department.location = location;

        const locationCollection: ILocationApp[] = [{ id: 88431 }];
        jest.spyOn(locationService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
        const expectedCollection: ILocationApp[] = [location, ...locationCollection];
        jest.spyOn(locationService, 'addLocationAppToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ department });
        comp.ngOnInit();

        expect(locationService.query).toHaveBeenCalled();
        expect(locationService.addLocationAppToCollectionIfMissing).toHaveBeenCalledWith(locationCollection, location);
        expect(comp.locationsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const department: IDepartmentApp = { id: 456 };
        const location: ILocationApp = { id: 56466 };
        department.location = location;

        activatedRoute.data = of({ department });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(department));
        expect(comp.locationsCollection).toContain(location);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<DepartmentApp>>();
        const department = { id: 123 };
        jest.spyOn(departmentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ department });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: department }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(departmentService.update).toHaveBeenCalledWith(department);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<DepartmentApp>>();
        const department = new DepartmentApp();
        jest.spyOn(departmentService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ department });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: department }));
        saveSubject.complete();

        // THEN
        expect(departmentService.create).toHaveBeenCalledWith(department);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<DepartmentApp>>();
        const department = { id: 123 };
        jest.spyOn(departmentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ department });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(departmentService.update).toHaveBeenCalledWith(department);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackLocationAppById', () => {
        it('Should return tracked LocationApp primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackLocationAppById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
