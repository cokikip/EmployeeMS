jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITaskApp, TaskApp } from '../task-app.model';
import { TaskAppService } from '../service/task-app.service';

import { TaskAppRoutingResolveService } from './task-app-routing-resolve.service';

describe('Service Tests', () => {
  describe('TaskApp routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TaskAppRoutingResolveService;
    let service: TaskAppService;
    let resultTaskApp: ITaskApp | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TaskAppRoutingResolveService);
      service = TestBed.inject(TaskAppService);
      resultTaskApp = undefined;
    });

    describe('resolve', () => {
      it('should return ITaskApp returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTaskApp = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTaskApp).toEqual({ id: 123 });
      });

      it('should return new ITaskApp if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTaskApp = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTaskApp).toEqual(new TaskApp());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TaskApp })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTaskApp = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTaskApp).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
