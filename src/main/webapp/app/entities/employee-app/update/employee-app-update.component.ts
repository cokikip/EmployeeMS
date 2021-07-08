import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEmployeeApp, EmployeeApp } from '../employee-app.model';
import { EmployeeAppService } from '../service/employee-app.service';
import { IDepartmentApp } from 'app/entities/department-app/department-app.model';
import { DepartmentAppService } from 'app/entities/department-app/service/department-app.service';

@Component({
  selector: 'jhi-employee-app-update',
  templateUrl: './employee-app-update.component.html',
})
export class EmployeeAppUpdateComponent implements OnInit {
  isSaving = false;

  employeesSharedCollection: IEmployeeApp[] = [];
  departmentsSharedCollection: IDepartmentApp[] = [];

  editForm = this.fb.group({
    id: [],
    firstName: [],
    lastName: [],
    email: [],
    phoneNumber: [],
    hireDate: [],
    salary: [],
    commissionPct: [],
    manager: [],
    department: [],
  });

  constructor(
    protected employeeService: EmployeeAppService,
    protected departmentService: DepartmentAppService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employee }) => {
      if (employee.id === undefined) {
        const today = dayjs().startOf('day');
        employee.hireDate = today;
      }

      this.updateForm(employee);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const employee = this.createFromForm();
    if (employee.id !== undefined) {
      this.subscribeToSaveResponse(this.employeeService.update(employee));
    } else {
      this.subscribeToSaveResponse(this.employeeService.create(employee));
    }
  }

  trackEmployeeAppById(index: number, item: IEmployeeApp): number {
    return item.id!;
  }

  trackDepartmentAppById(index: number, item: IDepartmentApp): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmployeeApp>>): void {
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

  protected updateForm(employee: IEmployeeApp): void {
    this.editForm.patchValue({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      hireDate: employee.hireDate ? employee.hireDate.format(DATE_TIME_FORMAT) : null,
      salary: employee.salary,
      commissionPct: employee.commissionPct,
      manager: employee.manager,
      department: employee.department,
    });

    this.employeesSharedCollection = this.employeeService.addEmployeeAppToCollectionIfMissing(
      this.employeesSharedCollection,
      employee.manager
    );
    this.departmentsSharedCollection = this.departmentService.addDepartmentAppToCollectionIfMissing(
      this.departmentsSharedCollection,
      employee.department
    );
  }

  protected loadRelationshipsOptions(): void {
    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployeeApp[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployeeApp[]) =>
          this.employeeService.addEmployeeAppToCollectionIfMissing(employees, this.editForm.get('manager')!.value)
        )
      )
      .subscribe((employees: IEmployeeApp[]) => (this.employeesSharedCollection = employees));

    this.departmentService
      .query()
      .pipe(map((res: HttpResponse<IDepartmentApp[]>) => res.body ?? []))
      .pipe(
        map((departments: IDepartmentApp[]) =>
          this.departmentService.addDepartmentAppToCollectionIfMissing(departments, this.editForm.get('department')!.value)
        )
      )
      .subscribe((departments: IDepartmentApp[]) => (this.departmentsSharedCollection = departments));
  }

  protected createFromForm(): IEmployeeApp {
    return {
      ...new EmployeeApp(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      email: this.editForm.get(['email'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
      hireDate: this.editForm.get(['hireDate'])!.value ? dayjs(this.editForm.get(['hireDate'])!.value, DATE_TIME_FORMAT) : undefined,
      salary: this.editForm.get(['salary'])!.value,
      commissionPct: this.editForm.get(['commissionPct'])!.value,
      manager: this.editForm.get(['manager'])!.value,
      department: this.editForm.get(['department'])!.value,
    };
  }
}
