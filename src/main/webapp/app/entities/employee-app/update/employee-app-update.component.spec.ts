jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EmployeeAppService } from '../service/employee-app.service';
import { IEmployeeApp, EmployeeApp } from '../employee-app.model';
import { IDepartmentApp } from 'app/entities/department-app/department-app.model';
import { DepartmentAppService } from 'app/entities/department-app/service/department-app.service';

import { EmployeeAppUpdateComponent } from './employee-app-update.component';

describe('Component Tests', () => {
  describe('EmployeeApp Management Update Component', () => {
    let comp: EmployeeAppUpdateComponent;
    let fixture: ComponentFixture<EmployeeAppUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let employeeService: EmployeeAppService;
    let departmentService: DepartmentAppService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EmployeeAppUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EmployeeAppUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmployeeAppUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      employeeService = TestBed.inject(EmployeeAppService);
      departmentService = TestBed.inject(DepartmentAppService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call EmployeeApp query and add missing value', () => {
        const employee: IEmployeeApp = { id: 456 };
        const manager: IEmployeeApp = { id: 4374 };
        employee.manager = manager;

        const employeeCollection: IEmployeeApp[] = [{ id: 10177 }];
        jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
        const additionalEmployeeApps = [manager];
        const expectedCollection: IEmployeeApp[] = [...additionalEmployeeApps, ...employeeCollection];
        jest.spyOn(employeeService, 'addEmployeeAppToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ employee });
        comp.ngOnInit();

        expect(employeeService.query).toHaveBeenCalled();
        expect(employeeService.addEmployeeAppToCollectionIfMissing).toHaveBeenCalledWith(employeeCollection, ...additionalEmployeeApps);
        expect(comp.employeesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call DepartmentApp query and add missing value', () => {
        const employee: IEmployeeApp = { id: 456 };
        const department: IDepartmentApp = { id: 35363 };
        employee.department = department;

        const departmentCollection: IDepartmentApp[] = [{ id: 78278 }];
        jest.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
        const additionalDepartmentApps = [department];
        const expectedCollection: IDepartmentApp[] = [...additionalDepartmentApps, ...departmentCollection];
        jest.spyOn(departmentService, 'addDepartmentAppToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ employee });
        comp.ngOnInit();

        expect(departmentService.query).toHaveBeenCalled();
        expect(departmentService.addDepartmentAppToCollectionIfMissing).toHaveBeenCalledWith(
          departmentCollection,
          ...additionalDepartmentApps
        );
        expect(comp.departmentsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const employee: IEmployeeApp = { id: 456 };
        const manager: IEmployeeApp = { id: 79320 };
        employee.manager = manager;
        const department: IDepartmentApp = { id: 60127 };
        employee.department = department;

        activatedRoute.data = of({ employee });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(employee));
        expect(comp.employeesSharedCollection).toContain(manager);
        expect(comp.departmentsSharedCollection).toContain(department);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<EmployeeApp>>();
        const employee = { id: 123 };
        jest.spyOn(employeeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ employee });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: employee }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(employeeService.update).toHaveBeenCalledWith(employee);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<EmployeeApp>>();
        const employee = new EmployeeApp();
        jest.spyOn(employeeService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ employee });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: employee }));
        saveSubject.complete();

        // THEN
        expect(employeeService.create).toHaveBeenCalledWith(employee);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<EmployeeApp>>();
        const employee = { id: 123 };
        jest.spyOn(employeeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ employee });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(employeeService.update).toHaveBeenCalledWith(employee);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackEmployeeAppById', () => {
        it('Should return tracked EmployeeApp primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackEmployeeAppById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackDepartmentAppById', () => {
        it('Should return tracked DepartmentApp primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackDepartmentAppById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
