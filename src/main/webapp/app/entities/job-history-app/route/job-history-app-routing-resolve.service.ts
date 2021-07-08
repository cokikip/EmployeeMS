import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJobHistoryApp, JobHistoryApp } from '../job-history-app.model';
import { JobHistoryAppService } from '../service/job-history-app.service';

@Injectable({ providedIn: 'root' })
export class JobHistoryAppRoutingResolveService implements Resolve<IJobHistoryApp> {
  constructor(protected service: JobHistoryAppService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IJobHistoryApp> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((jobHistory: HttpResponse<JobHistoryApp>) => {
          if (jobHistory.body) {
            return of(jobHistory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new JobHistoryApp());
  }
}
