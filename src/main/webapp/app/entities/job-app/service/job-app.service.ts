import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJobApp, getJobAppIdentifier } from '../job-app.model';

export type EntityResponseType = HttpResponse<IJobApp>;
export type EntityArrayResponseType = HttpResponse<IJobApp[]>;

@Injectable({ providedIn: 'root' })
export class JobAppService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/jobs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(job: IJobApp): Observable<EntityResponseType> {
    return this.http.post<IJobApp>(this.resourceUrl, job, { observe: 'response' });
  }

  update(job: IJobApp): Observable<EntityResponseType> {
    return this.http.put<IJobApp>(`${this.resourceUrl}/${getJobAppIdentifier(job) as number}`, job, { observe: 'response' });
  }

  partialUpdate(job: IJobApp): Observable<EntityResponseType> {
    return this.http.patch<IJobApp>(`${this.resourceUrl}/${getJobAppIdentifier(job) as number}`, job, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJobApp>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJobApp[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addJobAppToCollectionIfMissing(jobCollection: IJobApp[], ...jobsToCheck: (IJobApp | null | undefined)[]): IJobApp[] {
    const jobs: IJobApp[] = jobsToCheck.filter(isPresent);
    if (jobs.length > 0) {
      const jobCollectionIdentifiers = jobCollection.map(jobItem => getJobAppIdentifier(jobItem)!);
      const jobsToAdd = jobs.filter(jobItem => {
        const jobIdentifier = getJobAppIdentifier(jobItem);
        if (jobIdentifier == null || jobCollectionIdentifiers.includes(jobIdentifier)) {
          return false;
        }
        jobCollectionIdentifiers.push(jobIdentifier);
        return true;
      });
      return [...jobsToAdd, ...jobCollection];
    }
    return jobCollection;
  }
}
