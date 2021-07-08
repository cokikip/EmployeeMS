import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmployeeApp, getEmployeeAppIdentifier } from '../employee-app.model';

export type EntityResponseType = HttpResponse<IEmployeeApp>;
export type EntityArrayResponseType = HttpResponse<IEmployeeApp[]>;

@Injectable({ providedIn: 'root' })
export class EmployeeAppService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/employees');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(employee: IEmployeeApp): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(employee);
    return this.http
      .post<IEmployeeApp>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(employee: IEmployeeApp): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(employee);
    return this.http
      .put<IEmployeeApp>(`${this.resourceUrl}/${getEmployeeAppIdentifier(employee) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(employee: IEmployeeApp): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(employee);
    return this.http
      .patch<IEmployeeApp>(`${this.resourceUrl}/${getEmployeeAppIdentifier(employee) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEmployeeApp>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEmployeeApp[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEmployeeAppToCollectionIfMissing(
    employeeCollection: IEmployeeApp[],
    ...employeesToCheck: (IEmployeeApp | null | undefined)[]
  ): IEmployeeApp[] {
    const employees: IEmployeeApp[] = employeesToCheck.filter(isPresent);
    if (employees.length > 0) {
      const employeeCollectionIdentifiers = employeeCollection.map(employeeItem => getEmployeeAppIdentifier(employeeItem)!);
      const employeesToAdd = employees.filter(employeeItem => {
        const employeeIdentifier = getEmployeeAppIdentifier(employeeItem);
        if (employeeIdentifier == null || employeeCollectionIdentifiers.includes(employeeIdentifier)) {
          return false;
        }
        employeeCollectionIdentifiers.push(employeeIdentifier);
        return true;
      });
      return [...employeesToAdd, ...employeeCollection];
    }
    return employeeCollection;
  }

  protected convertDateFromClient(employee: IEmployeeApp): IEmployeeApp {
    return Object.assign({}, employee, {
      hireDate: employee.hireDate?.isValid() ? employee.hireDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.hireDate = res.body.hireDate ? dayjs(res.body.hireDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((employee: IEmployeeApp) => {
        employee.hireDate = employee.hireDate ? dayjs(employee.hireDate) : undefined;
      });
    }
    return res;
  }
}
