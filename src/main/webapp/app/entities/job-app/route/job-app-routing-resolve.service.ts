import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJobApp, JobApp } from '../job-app.model';
import { JobAppService } from '../service/job-app.service';

@Injectable({ providedIn: 'root' })
export class JobAppRoutingResolveService implements Resolve<IJobApp> {
  constructor(protected service: JobAppService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IJobApp> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((job: HttpResponse<JobApp>) => {
          if (job.body) {
            return of(job.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new JobApp());
  }
}
