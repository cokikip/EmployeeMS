import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IJobHistoryApp, JobHistoryApp } from '../job-history-app.model';
import { JobHistoryAppService } from '../service/job-history-app.service';
import { IJobApp } from 'app/entities/job-app/job-app.model';
import { JobAppService } from 'app/entities/job-app/service/job-app.service';
import { IDepartmentApp } from 'app/entities/department-app/department-app.model';
import { DepartmentAppService } from 'app/entities/department-app/service/department-app.service';
import { IEmployeeApp } from 'app/entities/employee-app/employee-app.model';
import { EmployeeAppService } from 'app/entities/employee-app/service/employee-app.service';

@Component({
  selector: 'jhi-job-history-app-update',
  templateUrl: './job-history-app-update.component.html',
})
export class JobHistoryAppUpdateComponent implements OnInit {
  isSaving = false;

  jobsCollection: IJobApp[] = [];
  departmentsCollection: IDepartmentApp[] = [];
  employeesCollection: IEmployeeApp[] = [];

  editForm = this.fb.group({
    id: [],
    startDate: [],
    endDate: [],
    language: [],
    job: [],
    department: [],
    employee: [],
  });

  constructor(
    protected jobHistoryService: JobHistoryAppService,
    protected jobService: JobAppService,
    protected departmentService: DepartmentAppService,
    protected employeeService: EmployeeAppService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobHistory }) => {
      if (jobHistory.id === undefined) {
        const today = dayjs().startOf('day');
        jobHistory.startDate = today;
        jobHistory.endDate = today;
      }

      this.updateForm(jobHistory);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jobHistory = this.createFromForm();
    if (jobHistory.id !== undefined) {
      this.subscribeToSaveResponse(this.jobHistoryService.update(jobHistory));
    } else {
      this.subscribeToSaveResponse(this.jobHistoryService.create(jobHistory));
    }
  }

  trackJobAppById(index: number, item: IJobApp): number {
    return item.id!;
  }

  trackDepartmentAppById(index: number, item: IDepartmentApp): number {
    return item.id!;
  }

  trackEmployeeAppById(index: number, item: IEmployeeApp): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobHistoryApp>>): void {
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

  protected updateForm(jobHistory: IJobHistoryApp): void {
    this.editForm.patchValue({
      id: jobHistory.id,
      startDate: jobHistory.startDate ? jobHistory.startDate.format(DATE_TIME_FORMAT) : null,
      endDate: jobHistory.endDate ? jobHistory.endDate.format(DATE_TIME_FORMAT) : null,
      language: jobHistory.language,
      job: jobHistory.job,
      department: jobHistory.department,
      employee: jobHistory.employee,
    });

    this.jobsCollection = this.jobService.addJobAppToCollectionIfMissing(this.jobsCollection, jobHistory.job);
    this.departmentsCollection = this.departmentService.addDepartmentAppToCollectionIfMissing(
      this.departmentsCollection,
      jobHistory.department
    );
    this.employeesCollection = this.employeeService.addEmployeeAppToCollectionIfMissing(this.employeesCollection, jobHistory.employee);
  }

  protected loadRelationshipsOptions(): void {
    this.jobService
      .query({ filter: 'jobhistory-is-null' })
      .pipe(map((res: HttpResponse<IJobApp[]>) => res.body ?? []))
      .pipe(map((jobs: IJobApp[]) => this.jobService.addJobAppToCollectionIfMissing(jobs, this.editForm.get('job')!.value)))
      .subscribe((jobs: IJobApp[]) => (this.jobsCollection = jobs));

    this.departmentService
      .query({ filter: 'jobhistory-is-null' })
      .pipe(map((res: HttpResponse<IDepartmentApp[]>) => res.body ?? []))
      .pipe(
        map((departments: IDepartmentApp[]) =>
          this.departmentService.addDepartmentAppToCollectionIfMissing(departments, this.editForm.get('department')!.value)
        )
      )
      .subscribe((departments: IDepartmentApp[]) => (this.departmentsCollection = departments));

    this.employeeService
      .query({ filter: 'jobhistory-is-null' })
      .pipe(map((res: HttpResponse<IEmployeeApp[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployeeApp[]) =>
          this.employeeService.addEmployeeAppToCollectionIfMissing(employees, this.editForm.get('employee')!.value)
        )
      )
      .subscribe((employees: IEmployeeApp[]) => (this.employeesCollection = employees));
  }

  protected createFromForm(): IJobHistoryApp {
    return {
      ...new JobHistoryApp(),
      id: this.editForm.get(['id'])!.value,
      startDate: this.editForm.get(['startDate'])!.value ? dayjs(this.editForm.get(['startDate'])!.value, DATE_TIME_FORMAT) : undefined,
      endDate: this.editForm.get(['endDate'])!.value ? dayjs(this.editForm.get(['endDate'])!.value, DATE_TIME_FORMAT) : undefined,
      language: this.editForm.get(['language'])!.value,
      job: this.editForm.get(['job'])!.value,
      department: this.editForm.get(['department'])!.value,
      employee: this.editForm.get(['employee'])!.value,
    };
  }
}
