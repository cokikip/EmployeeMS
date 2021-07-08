import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmployeeApp, EmployeeApp } from '../employee-app.model';
import { EmployeeAppService } from '../service/employee-app.service';

@Injectable({ providedIn: 'root' })
export class EmployeeAppRoutingResolveService implements Resolve<IEmployeeApp> {
  constructor(protected service: EmployeeAppService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmployeeApp> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((employee: HttpResponse<EmployeeApp>) => {
          if (employee.body) {
            return of(employee.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EmployeeApp());
  }
}
