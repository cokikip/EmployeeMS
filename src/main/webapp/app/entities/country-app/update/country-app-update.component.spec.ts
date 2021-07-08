jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CountryAppService } from '../service/country-app.service';
import { ICountryApp, CountryApp } from '../country-app.model';
import { IRegionApp } from 'app/entities/region-app/region-app.model';
import { RegionAppService } from 'app/entities/region-app/service/region-app.service';

import { CountryAppUpdateComponent } from './country-app-update.component';

describe('Component Tests', () => {
  describe('CountryApp Management Update Component', () => {
    let comp: CountryAppUpdateComponent;
    let fixture: ComponentFixture<CountryAppUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let countryService: CountryAppService;
    let regionService: RegionAppService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CountryAppUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CountryAppUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CountryAppUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      countryService = TestBed.inject(CountryAppService);
      regionService = TestBed.inject(RegionAppService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call region query and add missing value', () => {
        const country: ICountryApp = { id: 456 };
        const region: IRegionApp = { id: 80617 };
        country.region = region;

        const regionCollection: IRegionApp[] = [{ id: 61002 }];
        jest.spyOn(regionService, 'query').mockReturnValue(of(new HttpResponse({ body: regionCollection })));
        const expectedCollection: IRegionApp[] = [region, ...regionCollection];
        jest.spyOn(regionService, 'addRegionAppToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ country });
        comp.ngOnInit();

        expect(regionService.query).toHaveBeenCalled();
        expect(regionService.addRegionAppToCollectionIfMissing).toHaveBeenCalledWith(regionCollection, region);
        expect(comp.regionsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const country: ICountryApp = { id: 456 };
        const region: IRegionApp = { id: 67940 };
        country.region = region;

        activatedRoute.data = of({ country });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(country));
        expect(comp.regionsCollection).toContain(region);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CountryApp>>();
        const country = { id: 123 };
        jest.spyOn(countryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ country });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: country }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(countryService.update).toHaveBeenCalledWith(country);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CountryApp>>();
        const country = new CountryApp();
        jest.spyOn(countryService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ country });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: country }));
        saveSubject.complete();

        // THEN
        expect(countryService.create).toHaveBeenCalledWith(country);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CountryApp>>();
        const country = { id: 123 };
        jest.spyOn(countryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ country });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(countryService.update).toHaveBeenCalledWith(country);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackRegionAppById', () => {
        it('Should return tracked RegionApp primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRegionAppById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
