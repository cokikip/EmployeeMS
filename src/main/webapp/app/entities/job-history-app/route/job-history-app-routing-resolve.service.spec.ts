jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IJobHistoryApp, JobHistoryApp } from '../job-history-app.model';
import { JobHistoryAppService } from '../service/job-history-app.service';

import { JobHistoryAppRoutingResolveService } from './job-history-app-routing-resolve.service';

describe('Service Tests', () => {
  describe('JobHistoryApp routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: JobHistoryAppRoutingResolveService;
    let service: JobHistoryAppService;
    let resultJobHistoryApp: IJobHistoryApp | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(JobHistoryAppRoutingResolveService);
      service = TestBed.inject(JobHistoryAppService);
      resultJobHistoryApp = undefined;
    });

    describe('resolve', () => {
      it('should return IJobHistoryApp returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobHistoryApp = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJobHistoryApp).toEqual({ id: 123 });
      });

      it('should return new IJobHistoryApp if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobHistoryApp = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultJobHistoryApp).toEqual(new JobHistoryApp());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as JobHistoryApp })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobHistoryApp = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJobHistoryApp).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
