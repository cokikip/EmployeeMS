import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IJobApp, JobApp } from '../job-app.model';
import { JobAppService } from '../service/job-app.service';
import { ITaskApp } from 'app/entities/task-app/task-app.model';
import { TaskAppService } from 'app/entities/task-app/service/task-app.service';
import { IEmployeeApp } from 'app/entities/employee-app/employee-app.model';
import { EmployeeAppService } from 'app/entities/employee-app/service/employee-app.service';

@Component({
  selector: 'jhi-job-app-update',
  templateUrl: './job-app-update.component.html',
})
export class JobAppUpdateComponent implements OnInit {
  isSaving = false;

  tasksSharedCollection: ITaskApp[] = [];
  employeesSharedCollection: IEmployeeApp[] = [];

  editForm = this.fb.group({
    id: [],
    jobTitle: [],
    minSalary: [],
    maxSalary: [],
    tasks: [],
    employee: [],
  });

  constructor(
    protected jobService: JobAppService,
    protected taskService: TaskAppService,
    protected employeeService: EmployeeAppService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ job }) => {
      this.updateForm(job);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const job = this.createFromForm();
    if (job.id !== undefined) {
      this.subscribeToSaveResponse(this.jobService.update(job));
    } else {
      this.subscribeToSaveResponse(this.jobService.create(job));
    }
  }

  trackTaskAppById(index: number, item: ITaskApp): number {
    return item.id!;
  }

  trackEmployeeAppById(index: number, item: IEmployeeApp): number {
    return item.id!;
  }

  getSelectedTaskApp(option: ITaskApp, selectedVals?: ITaskApp[]): ITaskApp {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobApp>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(job: IJobApp): void {
    this.editForm.patchValue({
      id: job.id,
      jobTitle: job.jobTitle,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      tasks: job.tasks,
      employee: job.employee,
    });

    this.tasksSharedCollection = this.taskService.addTaskAppToCollectionIfMissing(this.tasksSharedCollection, ...(job.tasks ?? []));
    this.employeesSharedCollection = this.employeeService.addEmployeeAppToCollectionIfMissing(this.employeesSharedCollection, job.employee);
  }

  protected loadRelationshipsOptions(): void {
    this.taskService
      .query()
      .pipe(map((res: HttpResponse<ITaskApp[]>) => res.body ?? []))
      .pipe(
        map((tasks: ITaskApp[]) => this.taskService.addTaskAppToCollectionIfMissing(tasks, ...(this.editForm.get('tasks')!.value ?? [])))
      )
      .subscribe((tasks: ITaskApp[]) => (this.tasksSharedCollection = tasks));

    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployeeApp[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployeeApp[]) =>
          this.employeeService.addEmployeeAppToCollectionIfMissing(employees, this.editForm.get('employee')!.value)
        )
      )
      .subscribe((employees: IEmployeeApp[]) => (this.employeesSharedCollection = employees));
  }

  protected createFromForm(): IJobApp {
    return {
      ...new JobApp(),
      id: this.editForm.get(['id'])!.value,
      jobTitle: this.editForm.get(['jobTitle'])!.value,
      minSalary: this.editForm.get(['minSalary'])!.value,
      maxSalary: this.editForm.get(['maxSalary'])!.value,
      tasks: this.editForm.get(['tasks'])!.value,
      employee: this.editForm.get(['employee'])!.value,
    };
  }
}
