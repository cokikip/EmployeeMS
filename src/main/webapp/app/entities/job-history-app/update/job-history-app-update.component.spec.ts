jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { JobHistoryAppService } from '../service/job-history-app.service';
import { IJobHistoryApp, JobHistoryApp } from '../job-history-app.model';
import { IJobApp } from 'app/entities/job-app/job-app.model';
import { JobAppService } from 'app/entities/job-app/service/job-app.service';
import { IDepartmentApp } from 'app/entities/department-app/department-app.model';
import { DepartmentAppService } from 'app/entities/department-app/service/department-app.service';
import { IEmployeeApp } from 'app/entities/employee-app/employee-app.model';
import { EmployeeAppService } from 'app/entities/employee-app/service/employee-app.service';

import { JobHistoryAppUpdateComponent } from './job-history-app-update.component';

describe('Component Tests', () => {
  describe('JobHistoryApp Management Update Component', () => {
    let comp: JobHistoryAppUpdateComponent;
    let fixture: ComponentFixture<JobHistoryAppUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let jobHistoryService: JobHistoryAppService;
    let jobService: JobAppService;
    let departmentService: DepartmentAppService;
    let employeeService: EmployeeAppService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JobHistoryAppUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(JobHistoryAppUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JobHistoryAppUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      jobHistoryService = TestBed.inject(JobHistoryAppService);
      jobService = TestBed.inject(JobAppService);
      departmentService = TestBed.inject(DepartmentAppService);
      employeeService = TestBed.inject(EmployeeAppService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call job query and add missing value', () => {
        const jobHistory: IJobHistoryApp = { id: 456 };
        const job: IJobApp = { id: 42770 };
        jobHistory.job = job;

        const jobCollection: IJobApp[] = [{ id: 75633 }];
        jest.spyOn(jobService, 'query').mockReturnValue(of(new HttpResponse({ body: jobCollection })));
        const expectedCollection: IJobApp[] = [job, ...jobCollection];
        jest.spyOn(jobService, 'addJobAppToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ jobHistory });
        comp.ngOnInit();

        expect(jobService.query).toHaveBeenCalled();
        expect(jobService.addJobAppToCollectionIfMissing).toHaveBeenCalledWith(jobCollection, job);
        expect(comp.jobsCollection).toEqual(expectedCollection);
      });

      it('Should call department query and add missing value', () => {
        const jobHistory: IJobHistoryApp = { id: 456 };
        const department: IDepartmentApp = { id: 6911 };
        jobHistory.department = department;

        const departmentCollection: IDepartmentApp[] = [{ id: 12924 }];
        jest.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
        const expectedCollection: IDepartmentApp[] = [department, ...departmentCollection];
        jest.spyOn(departmentService, 'addDepartmentAppToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ jobHistory });
        comp.ngOnInit();

        expect(departmentService.query).toHaveBeenCalled();
        expect(departmentService.addDepartmentAppToCollectionIfMissing).toHaveBeenCalledWith(departmentCollection, department);
        expect(comp.departmentsCollection).toEqual(expectedCollection);
      });

      it('Should call employee query and add missing value', () => {
        const jobHistory: IJobHistoryApp = { id: 456 };
        const employee: IEmployeeApp = { id: 94649 };
        jobHistory.employee = employee;

        const employeeCollection: IEmployeeApp[] = [{ id: 89297 }];
        jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
        const expectedCollection: IEmployeeApp[] = [employee, ...employeeCollection];
        jest.spyOn(employeeService, 'addEmployeeAppToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ jobHistory });
        comp.ngOnInit();

        expect(employeeService.query).toHaveBeenCalled();
        expect(employeeService.addEmployeeAppToCollectionIfMissing).toHaveBeenCalledWith(employeeCollection, employee);
        expect(comp.employeesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const jobHistory: IJobHistoryApp = { id: 456 };
        const job: IJobApp = { id: 96728 };
        jobHistory.job = job;
        const department: IDepartmentApp = { id: 42374 };
        jobHistory.department = department;
        const employee: IEmployeeApp = { id: 88001 };
        jobHistory.employee = employee;

        activatedRoute.data = of({ jobHistory });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(jobHistory));
        expect(comp.jobsCollection).toContain(job);
        expect(comp.departmentsCollection).toContain(department);
        expect(comp.employeesCollection).toContain(employee);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<JobHistoryApp>>();
        const jobHistory = { id: 123 };
        jest.spyOn(jobHistoryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobHistory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jobHistory }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(jobHistoryService.update).toHaveBeenCalledWith(jobHistory);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<JobHistoryApp>>();
        const jobHistory = new JobHistoryApp();
        jest.spyOn(jobHistoryService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobHistory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jobHistory }));
        saveSubject.complete();

        // THEN
        expect(jobHistoryService.create).toHaveBeenCalledWith(jobHistory);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<JobHistoryApp>>();
        const jobHistory = { id: 123 };
        jest.spyOn(jobHistoryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobHistory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(jobHistoryService.update).toHaveBeenCalledWith(jobHistory);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackJobAppById', () => {
        it('Should return tracked JobApp primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackJobAppById(0, entity);
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

      describe('trackEmployeeAppById', () => {
        it('Should return tracked EmployeeApp primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackEmployeeAppById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
