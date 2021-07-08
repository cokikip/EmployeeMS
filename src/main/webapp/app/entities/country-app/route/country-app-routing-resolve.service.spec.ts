jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICountryApp, CountryApp } from '../country-app.model';
import { CountryAppService } from '../service/country-app.service';

import { CountryAppRoutingResolveService } from './country-app-routing-resolve.service';

describe('Service Tests', () => {
  describe('CountryApp routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CountryAppRoutingResolveService;
    let service: CountryAppService;
    let resultCountryApp: ICountryApp | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CountryAppRoutingResolveService);
      service = TestBed.inject(CountryAppService);
      resultCountryApp = undefined;
    });

    describe('resolve', () => {
      it('should return ICountryApp returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCountryApp = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCountryApp).toEqual({ id: 123 });
      });

      it('should return new ICountryApp if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCountryApp = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCountryApp).toEqual(new CountryApp());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CountryApp })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCountryApp = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCountryApp).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
