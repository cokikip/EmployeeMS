import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICountryApp, CountryApp } from '../country-app.model';
import { CountryAppService } from '../service/country-app.service';
import { IRegionApp } from 'app/entities/region-app/region-app.model';
import { RegionAppService } from 'app/entities/region-app/service/region-app.service';

@Component({
  selector: 'jhi-country-app-update',
  templateUrl: './country-app-update.component.html',
})
export class CountryAppUpdateComponent implements OnInit {
  isSaving = false;

  regionsCollection: IRegionApp[] = [];

  editForm = this.fb.group({
    id: [],
    countryName: [],
    region: [],
  });

  constructor(
    protected countryService: CountryAppService,
    protected regionService: RegionAppService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ country }) => {
      this.updateForm(country);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const country = this.createFromForm();
    if (country.id !== undefined) {
      this.subscribeToSaveResponse(this.countryService.update(country));
    } else {
      this.subscribeToSaveResponse(this.countryService.create(country));
    }
  }

  trackRegionAppById(index: number, item: IRegionApp): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICountryApp>>): void {
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

  protected updateForm(country: ICountryApp): void {
    this.editForm.patchValue({
      id: country.id,
      countryName: country.countryName,
      region: country.region,
    });

    this.regionsCollection = this.regionService.addRegionAppToCollectionIfMissing(this.regionsCollection, country.region);
  }

  protected loadRelationshipsOptions(): void {
    this.regionService
      .query({ filter: 'country-is-null' })
      .pipe(map((res: HttpResponse<IRegionApp[]>) => res.body ?? []))
      .pipe(
        map((regions: IRegionApp[]) => this.regionService.addRegionAppToCollectionIfMissing(regions, this.editForm.get('region')!.value))
      )
      .subscribe((regions: IRegionApp[]) => (this.regionsCollection = regions));
  }

  protected createFromForm(): ICountryApp {
    return {
      ...new CountryApp(),
      id: this.editForm.get(['id'])!.value,
      countryName: this.editForm.get(['countryName'])!.value,
      region: this.editForm.get(['region'])!.value,
    };
  }
}
