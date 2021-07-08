import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDepartmentApp, DepartmentApp } from '../department-app.model';
import { DepartmentAppService } from '../service/department-app.service';
import { ILocationApp } from 'app/entities/location-app/location-app.model';
import { LocationAppService } from 'app/entities/location-app/service/location-app.service';

@Component({
  selector: 'jhi-department-app-update',
  templateUrl: './department-app-update.component.html',
})
export class DepartmentAppUpdateComponent implements OnInit {
  isSaving = false;

  locationsCollection: ILocationApp[] = [];

  editForm = this.fb.group({
    id: [],
    departmentName: [null, [Validators.required]],
    location: [],
  });

  constructor(
    protected departmentService: DepartmentAppService,
    protected locationService: LocationAppService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ department }) => {
      this.updateForm(department);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const department = this.createFromForm();
    if (department.id !== undefined) {
      this.subscribeToSaveResponse(this.departmentService.update(department));
    } else {
      this.subscribeToSaveResponse(this.departmentService.create(department));
    }
  }

  trackLocationAppById(index: number, item: ILocationApp): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDepartmentApp>>): void {
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

  protected updateForm(department: IDepartmentApp): void {
    this.editForm.patchValue({
      id: department.id,
      departmentName: department.departmentName,
      location: department.location,
    });

    this.locationsCollection = this.locationService.addLocationAppToCollectionIfMissing(this.locationsCollection, department.location);
  }

  protected loadRelationshipsOptions(): void {
    this.locationService
      .query({ filter: 'department-is-null' })
      .pipe(map((res: HttpResponse<ILocationApp[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocationApp[]) =>
          this.locationService.addLocationAppToCollectionIfMissing(locations, this.editForm.get('location')!.value)
        )
      )
      .subscribe((locations: ILocationApp[]) => (this.locationsCollection = locations));
  }

  protected createFromForm(): IDepartmentApp {
    return {
      ...new DepartmentApp(),
      id: this.editForm.get(['id'])!.value,
      departmentName: this.editForm.get(['departmentName'])!.value,
      location: this.editForm.get(['location'])!.value,
    };
  }
}
