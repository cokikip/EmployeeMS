import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICountryApp, CountryApp } from '../country-app.model';
import { CountryAppService } from '../service/country-app.service';

@Injectable({ providedIn: 'root' })
export class CountryAppRoutingResolveService implements Resolve<ICountryApp> {
  constructor(protected service: CountryAppService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICountryApp> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((country: HttpResponse<CountryApp>) => {
          if (country.body) {
            return of(country.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CountryApp());
  }
}
