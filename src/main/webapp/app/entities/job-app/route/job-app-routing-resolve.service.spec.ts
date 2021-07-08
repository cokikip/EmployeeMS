jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IJobApp, JobApp } from '../job-app.model';
import { JobAppService } from '../service/job-app.service';

import { JobAppRoutingResolveService } from './job-app-routing-resolve.service';

describe('Service Tests', () => {
  describe('JobApp routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: JobAppRoutingResolveService;
    let service: JobAppService;
    let resultJobApp: IJobApp | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(JobAppRoutingResolveService);
      service = TestBed.inject(JobAppService);
      resultJobApp = undefined;
    });

    describe('resolve', () => {
      it('should return IJobApp returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobApp = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJobApp).toEqual({ id: 123 });
      });

      it('should return new IJobApp if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobApp = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultJobApp).toEqual(new JobApp());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as JobApp })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobApp = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJobApp).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
