import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITaskApp, getTaskAppIdentifier } from '../task-app.model';

export type EntityResponseType = HttpResponse<ITaskApp>;
export type EntityArrayResponseType = HttpResponse<ITaskApp[]>;

@Injectable({ providedIn: 'root' })
export class TaskAppService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tasks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(task: ITaskApp): Observable<EntityResponseType> {
    return this.http.post<ITaskApp>(this.resourceUrl, task, { observe: 'response' });
  }

  update(task: ITaskApp): Observable<EntityResponseType> {
    return this.http.put<ITaskApp>(`${this.resourceUrl}/${getTaskAppIdentifier(task) as number}`, task, { observe: 'response' });
  }

  partialUpdate(task: ITaskApp): Observable<EntityResponseType> {
    return this.http.patch<ITaskApp>(`${this.resourceUrl}/${getTaskAppIdentifier(task) as number}`, task, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITaskApp>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITaskApp[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTaskAppToCollectionIfMissing(taskCollection: ITaskApp[], ...tasksToCheck: (ITaskApp | null | undefined)[]): ITaskApp[] {
    const tasks: ITaskApp[] = tasksToCheck.filter(isPresent);
    if (tasks.length > 0) {
      const taskCollectionIdentifiers = taskCollection.map(taskItem => getTaskAppIdentifier(taskItem)!);
      const tasksToAdd = tasks.filter(taskItem => {
        const taskIdentifier = getTaskAppIdentifier(taskItem);
        if (taskIdentifier == null || taskCollectionIdentifiers.includes(taskIdentifier)) {
          return false;
        }
        taskCollectionIdentifiers.push(taskIdentifier);
        return true;
      });
      return [...tasksToAdd, ...taskCollection];
    }
    return taskCollection;
  }
}
