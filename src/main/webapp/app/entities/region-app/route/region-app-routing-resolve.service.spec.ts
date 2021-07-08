jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRegionApp, RegionApp } from '../region-app.model';
import { RegionAppService } from '../service/region-app.service';

import { RegionAppRoutingResolveService } from './region-app-routing-resolve.service';

describe('Service Tests', () => {
  describe('RegionApp routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: RegionAppRoutingResolveService;
    let service: RegionAppService;
    let resultRegionApp: IRegionApp | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(RegionAppRoutingResolveService);
      service = TestBed.inject(RegionAppService);
      resultRegionApp = undefined;
    });

    describe('resolve', () => {
      it('should return IRegionApp returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRegionApp = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRegionApp).toEqual({ id: 123 });
      });

      it('should return new IRegionApp if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRegionApp = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultRegionApp).toEqual(new RegionApp());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as RegionApp })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRegionApp = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRegionApp).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
