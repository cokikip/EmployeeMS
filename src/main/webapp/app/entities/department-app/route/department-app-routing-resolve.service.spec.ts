jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IDepartmentApp, DepartmentApp } from '../department-app.model';
import { DepartmentAppService } from '../service/department-app.service';

import { DepartmentAppRoutingResolveService } from './department-app-routing-resolve.service';

describe('Service Tests', () => {
  describe('DepartmentApp routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: DepartmentAppRoutingResolveService;
    let service: DepartmentAppService;
    let resultDepartmentApp: IDepartmentApp | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(DepartmentAppRoutingResolveService);
      service = TestBed.inject(DepartmentAppService);
      resultDepartmentApp = undefined;
    });

    describe('resolve', () => {
      it('should return IDepartmentApp returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDepartmentApp = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDepartmentApp).toEqual({ id: 123 });
      });

      it('should return new IDepartmentApp if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDepartmentApp = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultDepartmentApp).toEqual(new DepartmentApp());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as DepartmentApp })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDepartmentApp = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDepartmentApp).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
