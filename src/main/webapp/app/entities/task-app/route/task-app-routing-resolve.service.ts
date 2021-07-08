import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITaskApp, TaskApp } from '../task-app.model';
import { TaskAppService } from '../service/task-app.service';

@Injectable({ providedIn: 'root' })
export class TaskAppRoutingResolveService implements Resolve<ITaskApp> {
  constructor(protected service: TaskAppService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITaskApp> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((task: HttpResponse<TaskApp>) => {
          if (task.body) {
            return of(task.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TaskApp());
  }
}
