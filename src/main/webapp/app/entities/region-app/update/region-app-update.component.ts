import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IRegionApp, RegionApp } from '../region-app.model';
import { RegionAppService } from '../service/region-app.service';

@Component({
  selector: 'jhi-region-app-update',
  templateUrl: './region-app-update.component.html',
})
export class RegionAppUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    regionName: [],
  });

  constructor(protected regionService: RegionAppService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ region }) => {
      this.updateForm(region);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const region = this.createFromForm();
    if (region.id !== undefined) {
      this.subscribeToSaveResponse(this.regionService.update(region));
    } else {
      this.subscribeToSaveResponse(this.regionService.create(region));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRegionApp>>): void {
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

  protected updateForm(region: IRegionApp): void {
    this.editForm.patchValue({
      id: region.id,
      regionName: region.regionName,
    });
  }

  protected createFromForm(): IRegionApp {
    return {
      ...new RegionApp(),
      id: this.editForm.get(['id'])!.value,
      regionName: this.editForm.get(['regionName'])!.value,
    };
  }
}
