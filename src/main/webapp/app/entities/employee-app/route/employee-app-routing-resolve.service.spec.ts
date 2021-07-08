jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEmployeeApp, EmployeeApp } from '../employee-app.model';
import { EmployeeAppService } from '../service/employee-app.service';

import { EmployeeAppRoutingResolveService } from './employee-app-routing-resolve.service';

describe('Service Tests', () => {
  describe('EmployeeApp routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: EmployeeAppRoutingResolveService;
    let service: EmployeeAppService;
    let resultEmployeeApp: IEmployeeApp | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(EmployeeAppRoutingResolveService);
      service = TestBed.inject(EmployeeAppService);
      resultEmployeeApp = undefined;
    });

    describe('resolve', () => {
      it('should return IEmployeeApp returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEmployeeApp = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultEmployeeApp).toEqual({ id: 123 });
      });

      it('should return new IEmployeeApp if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEmployeeApp = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultEmployeeApp).toEqual(new EmployeeApp());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as EmployeeApp })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEmployeeApp = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultEmployeeApp).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
