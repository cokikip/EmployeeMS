jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LocationAppService } from '../service/location-app.service';
import { ILocationApp, LocationApp } from '../location-app.model';
import { ICountryApp } from 'app/entities/country-app/country-app.model';
import { CountryAppService } from 'app/entities/country-app/service/country-app.service';

import { LocationAppUpdateComponent } from './location-app-update.component';

describe('Component Tests', () => {
  describe('LocationApp Management Update Component', () => {
    let comp: LocationAppUpdateComponent;
    let fixture: ComponentFixture<LocationAppUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let locationService: LocationAppService;
    let countryService: CountryAppService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LocationAppUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LocationAppUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LocationAppUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      locationService = TestBed.inject(LocationAppService);
      countryService = TestBed.inject(CountryAppService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call country query and add missing value', () => {
        const location: ILocationApp = { id: 456 };
        const country: ICountryApp = { id: 10523 };
        location.country = country;

        const countryCollection: ICountryApp[] = [{ id: 85035 }];
        jest.spyOn(countryService, 'query').mockReturnValue(of(new HttpResponse({ body: countryCollection })));
        const expectedCollection: ICountryApp[] = [country, ...countryCollection];
        jest.spyOn(countryService, 'addCountryAppToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ location });
        comp.ngOnInit();

        expect(countryService.query).toHaveBeenCalled();
        expect(countryService.addCountryAppToCollectionIfMissing).toHaveBeenCalledWith(countryCollection, country);
        expect(comp.countriesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const location: ILocationApp = { id: 456 };
        const country: ICountryApp = { id: 80821 };
        location.country = country;

        activatedRoute.data = of({ location });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(location));
        expect(comp.countriesCollection).toContain(country);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<LocationApp>>();
        const location = { id: 123 };
        jest.spyOn(locationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ location });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: location }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(locationService.update).toHaveBeenCalledWith(location);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<LocationApp>>();
        const location = new LocationApp();
        jest.spyOn(locationService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ location });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: location }));
        saveSubject.complete();

        // THEN
        expect(locationService.create).toHaveBeenCalledWith(location);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<LocationApp>>();
        const location = { id: 123 };
        jest.spyOn(locationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ location });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(locationService.update).toHaveBeenCalledWith(location);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCountryAppById', () => {
        it('Should return tracked CountryApp primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCountryAppById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
