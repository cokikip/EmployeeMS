import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDepartmentApp, getDepartmentAppIdentifier } from '../department-app.model';

export type EntityResponseType = HttpResponse<IDepartmentApp>;
export type EntityArrayResponseType = HttpResponse<IDepartmentApp[]>;

@Injectable({ providedIn: 'root' })
export class DepartmentAppService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/departments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(department: IDepartmentApp): Observable<EntityResponseType> {
    return this.http.post<IDepartmentApp>(this.resourceUrl, department, { observe: 'response' });
  }

  update(department: IDepartmentApp): Observable<EntityResponseType> {
    return this.http.put<IDepartmentApp>(`${this.resourceUrl}/${getDepartmentAppIdentifier(department) as number}`, department, {
      observe: 'response',
    });
  }

  partialUpdate(department: IDepartmentApp): Observable<EntityResponseType> {
    return this.http.patch<IDepartmentApp>(`${this.resourceUrl}/${getDepartmentAppIdentifier(department) as number}`, department, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDepartmentApp>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDepartmentApp[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDepartmentAppToCollectionIfMissing(
    departmentCollection: IDepartmentApp[],
    ...departmentsToCheck: (IDepartmentApp | null | undefined)[]
  ): IDepartmentApp[] {
    const departments: IDepartmentApp[] = departmentsToCheck.filter(isPresent);
    if (departments.length > 0) {
      const departmentCollectionIdentifiers = departmentCollection.map(departmentItem => getDepartmentAppIdentifier(departmentItem)!);
      const departmentsToAdd = departments.filter(departmentItem => {
        const departmentIdentifier = getDepartmentAppIdentifier(departmentItem);
        if (departmentIdentifier == null || departmentCollectionIdentifiers.includes(departmentIdentifier)) {
          return false;
        }
        departmentCollectionIdentifiers.push(departmentIdentifier);
        return true;
      });
      return [...departmentsToAdd, ...departmentCollection];
    }
    return departmentCollection;
  }
}
