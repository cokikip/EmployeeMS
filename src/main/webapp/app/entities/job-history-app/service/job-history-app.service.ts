import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJobHistoryApp, getJobHistoryAppIdentifier } from '../job-history-app.model';

export type EntityResponseType = HttpResponse<IJobHistoryApp>;
export type EntityArrayResponseType = HttpResponse<IJobHistoryApp[]>;

@Injectable({ providedIn: 'root' })
export class JobHistoryAppService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/job-histories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(jobHistory: IJobHistoryApp): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobHistory);
    return this.http
      .post<IJobHistoryApp>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(jobHistory: IJobHistoryApp): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobHistory);
    return this.http
      .put<IJobHistoryApp>(`${this.resourceUrl}/${getJobHistoryAppIdentifier(jobHistory) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(jobHistory: IJobHistoryApp): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobHistory);
    return this.http
      .patch<IJobHistoryApp>(`${this.resourceUrl}/${getJobHistoryAppIdentifier(jobHistory) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IJobHistoryApp>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IJobHistoryApp[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addJobHistoryAppToCollectionIfMissing(
    jobHistoryCollection: IJobHistoryApp[],
    ...jobHistoriesToCheck: (IJobHistoryApp | null | undefined)[]
  ): IJobHistoryApp[] {
    const jobHistories: IJobHistoryApp[] = jobHistoriesToCheck.filter(isPresent);
    if (jobHistories.length > 0) {
      const jobHistoryCollectionIdentifiers = jobHistoryCollection.map(jobHistoryItem => getJobHistoryAppIdentifier(jobHistoryItem)!);
      const jobHistoriesToAdd = jobHistories.filter(jobHistoryItem => {
        const jobHistoryIdentifier = getJobHistoryAppIdentifier(jobHistoryItem);
        if (jobHistoryIdentifier == null || jobHistoryCollectionIdentifiers.includes(jobHistoryIdentifier)) {
          return false;
        }
        jobHistoryCollectionIdentifiers.push(jobHistoryIdentifier);
        return true;
      });
      return [...jobHistoriesToAdd, ...jobHistoryCollection];
    }
    return jobHistoryCollection;
  }

  protected convertDateFromClient(jobHistory: IJobHistoryApp): IJobHistoryApp {
    return Object.assign({}, jobHistory, {
      startDate: jobHistory.startDate?.isValid() ? jobHistory.startDate.toJSON() : undefined,
      endDate: jobHistory.endDate?.isValid() ? jobHistory.endDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate ? dayjs(res.body.startDate) : undefined;
      res.body.endDate = res.body.endDate ? dayjs(res.body.endDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((jobHistory: IJobHistoryApp) => {
        jobHistory.startDate = jobHistory.startDate ? dayjs(jobHistory.startDate) : undefined;
        jobHistory.endDate = jobHistory.endDate ? dayjs(jobHistory.endDate) : undefined;
      });
    }
    return res;
  }
}
