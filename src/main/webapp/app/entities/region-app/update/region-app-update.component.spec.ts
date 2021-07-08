jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RegionAppService } from '../service/region-app.service';
import { IRegionApp, RegionApp } from '../region-app.model';

import { RegionAppUpdateComponent } from './region-app-update.component';

describe('Component Tests', () => {
  describe('RegionApp Management Update Component', () => {
    let comp: RegionAppUpdateComponent;
    let fixture: ComponentFixture<RegionAppUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let regionService: RegionAppService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RegionAppUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RegionAppUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RegionAppUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      regionService = TestBed.inject(RegionAppService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const region: IRegionApp = { id: 456 };

        activatedRoute.data = of({ region });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(region));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RegionApp>>();
        const region = { id: 123 };
        jest.spyOn(regionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ region });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: region }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(regionService.update).toHaveBeenCalledWith(region);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RegionApp>>();
        const region = new RegionApp();
        jest.spyOn(regionService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ region });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: region }));
        saveSubject.complete();

        // THEN
        expect(regionService.create).toHaveBeenCalledWith(region);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RegionApp>>();
        const region = { id: 123 };
        jest.spyOn(regionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ region });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(regionService.update).toHaveBeenCalledWith(region);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
