jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { JobAppService } from '../service/job-app.service';
import { IJobApp, JobApp } from '../job-app.model';
import { ITaskApp } from 'app/entities/task-app/task-app.model';
import { TaskAppService } from 'app/entities/task-app/service/task-app.service';
import { IEmployeeApp } from 'app/entities/employee-app/employee-app.model';
import { EmployeeAppService } from 'app/entities/employee-app/service/employee-app.service';

import { JobAppUpdateComponent } from './job-app-update.component';

describe('Component Tests', () => {
  describe('JobApp Management Update Component', () => {
    let comp: JobAppUpdateComponent;
    let fixture: ComponentFixture<JobAppUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let jobService: JobAppService;
    let taskService: TaskAppService;
    let employeeService: EmployeeAppService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JobAppUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(JobAppUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JobAppUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      jobService = TestBed.inject(JobAppService);
      taskService = TestBed.inject(TaskAppService);
      employeeService = TestBed.inject(EmployeeAppService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call TaskApp query and add missing value', () => {
        const job: IJobApp = { id: 456 };
        const tasks: ITaskApp[] = [{ id: 92497 }];
        job.tasks = tasks;

        const taskCollection: ITaskApp[] = [{ id: 18447 }];
        jest.spyOn(taskService, 'query').mockReturnValue(of(new HttpResponse({ body: taskCollection })));
        const additionalTaskApps = [...tasks];
        const expectedCollection: ITaskApp[] = [...additionalTaskApps, ...taskCollection];
        jest.spyOn(taskService, 'addTaskAppToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ job });
        comp.ngOnInit();

        expect(taskService.query).toHaveBeenCalled();
        expect(taskService.addTaskAppToCollectionIfMissing).toHaveBeenCalledWith(taskCollection, ...additionalTaskApps);
        expect(comp.tasksSharedCollection).toEqual(expectedCollection);
      });

      it('Should call EmployeeApp query and add missing value', () => {
        const job: IJobApp = { id: 456 };
        const employee: IEmployeeApp = { id: 75146 };
        job.employee = employee;

        const employeeCollection: IEmployeeApp[] = [{ id: 78248 }];
        jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
        const additionalEmployeeApps = [employee];
        const expectedCollection: IEmployeeApp[] = [...additionalEmployeeApps, ...employeeCollection];
        jest.spyOn(employeeService, 'addEmployeeAppToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ job });
        comp.ngOnInit();

        expect(employeeService.query).toHaveBeenCalled();
        expect(employeeService.addEmployeeAppToCollectionIfMissing).toHaveBeenCalledWith(employeeCollection, ...additionalEmployeeApps);
        expect(comp.employeesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const job: IJobApp = { id: 456 };
        const tasks: ITaskApp = { id: 88679 };
        job.tasks = [tasks];
        const employee: IEmployeeApp = { id: 21743 };
        job.employee = employee;

        activatedRoute.data = of({ job });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(job));
        expect(comp.tasksSharedCollection).toContain(tasks);
        expect(comp.employeesSharedCollection).toContain(employee);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<JobApp>>();
        const job = { id: 123 };
        jest.spyOn(jobService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ job });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: job }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(jobService.update).toHaveBeenCalledWith(job);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<JobApp>>();
        const job = new JobApp();
        jest.spyOn(jobService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ job });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: job }));
        saveSubject.complete();

        // THEN
        expect(jobService.create).toHaveBeenCalledWith(job);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<JobApp>>();
        const job = { id: 123 };
        jest.spyOn(jobService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ job });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(jobService.update).toHaveBeenCalledWith(job);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackTaskAppById', () => {
        it('Should return tracked TaskApp primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTaskAppById(0, entity);
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

    describe('Getting selected relationships', () => {
      describe('getSelectedTaskApp', () => {
        it('Should return option if no TaskApp is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedTaskApp(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected TaskApp for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedTaskApp(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this TaskApp is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedTaskApp(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
