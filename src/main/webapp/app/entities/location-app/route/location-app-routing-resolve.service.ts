import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILocationApp, LocationApp } from '../location-app.model';
import { LocationAppService } from '../service/location-app.service';

@Injectable({ providedIn: 'root' })
export class LocationAppRoutingResolveService implements Resolve<ILocationApp> {
  constructor(protected service: LocationAppService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILocationApp> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((location: HttpResponse<LocationApp>) => {
          if (location.body) {
            return of(location.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LocationApp());
  }
}
