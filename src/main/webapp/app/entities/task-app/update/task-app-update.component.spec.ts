jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TaskAppService } from '../service/task-app.service';
import { ITaskApp, TaskApp } from '../task-app.model';

import { TaskAppUpdateComponent } from './task-app-update.component';

describe('Component Tests', () => {
  describe('TaskApp Management Update Component', () => {
    let comp: TaskAppUpdateComponent;
    let fixture: ComponentFixture<TaskAppUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let taskService: TaskAppService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TaskAppUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TaskAppUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TaskAppUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      taskService = TestBed.inject(TaskAppService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const task: ITaskApp = { id: 456 };

        activatedRoute.data = of({ task });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(task));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<TaskApp>>();
        const task = { id: 123 };
        jest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ task });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: task }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(taskService.update).toHaveBeenCalledWith(task);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<TaskApp>>();
        const task = new TaskApp();
        jest.spyOn(taskService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ task });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: task }));
        saveSubject.complete();

        // THEN
        expect(taskService.create).toHaveBeenCalledWith(task);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<TaskApp>>();
        const task = { id: 123 };
        jest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ task });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(taskService.update).toHaveBeenCalledWith(task);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
