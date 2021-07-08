import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDepartmentApp, DepartmentApp } from '../department-app.model';
import { DepartmentAppService } from '../service/department-app.service';

@Injectable({ providedIn: 'root' })
export class DepartmentAppRoutingResolveService implements Resolve<IDepartmentApp> {
  constructor(protected service: DepartmentAppService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDepartmentApp> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((department: HttpResponse<DepartmentApp>) => {
          if (department.body) {
            return of(department.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DepartmentApp());
  }
}
