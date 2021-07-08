import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILocationApp, LocationApp } from '../location-app.model';
import { LocationAppService } from '../service/location-app.service';
import { ICountryApp } from 'app/entities/country-app/country-app.model';
import { CountryAppService } from 'app/entities/country-app/service/country-app.service';

@Component({
  selector: 'jhi-location-app-update',
  templateUrl: './location-app-update.component.html',
})
export class LocationAppUpdateComponent implements OnInit {
  isSaving = false;

  countriesCollection: ICountryApp[] = [];

  editForm = this.fb.group({
    id: [],
    streetAddress: [],
    postalCode: [],
    city: [],
    stateProvince: [],
    country: [],
  });

  constructor(
    protected locationService: LocationAppService,
    protected countryService: CountryAppService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ location }) => {
      this.updateForm(location);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const location = this.createFromForm();
    if (location.id !== undefined) {
      this.subscribeToSaveResponse(this.locationService.update(location));
    } else {
      this.subscribeToSaveResponse(this.locationService.create(location));
    }
  }

  trackCountryAppById(index: number, item: ICountryApp): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocationApp>>): void {
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

  protected updateForm(location: ILocationApp): void {
    this.editForm.patchValue({
      id: location.id,
      streetAddress: location.streetAddress,
      postalCode: location.postalCode,
      city: location.city,
      stateProvince: location.stateProvince,
      country: location.country,
    });

    this.countriesCollection = this.countryService.addCountryAppToCollectionIfMissing(this.countriesCollection, location.country);
  }

  protected loadRelationshipsOptions(): void {
    this.countryService
      .query({ filter: 'location-is-null' })
      .pipe(map((res: HttpResponse<ICountryApp[]>) => res.body ?? []))
      .pipe(
        map((countries: ICountryApp[]) =>
          this.countryService.addCountryAppToCollectionIfMissing(countries, this.editForm.get('country')!.value)
        )
      )
      .subscribe((countries: ICountryApp[]) => (this.countriesCollection = countries));
  }

  protected createFromForm(): ILocationApp {
    return {
      ...new LocationApp(),
      id: this.editForm.get(['id'])!.value,
      streetAddress: this.editForm.get(['streetAddress'])!.value,
      postalCode: this.editForm.get(['postalCode'])!.value,
      city: this.editForm.get(['city'])!.value,
      stateProvince: this.editForm.get(['stateProvince'])!.value,
      country: this.editForm.get(['country'])!.value,
    };
  }
}
