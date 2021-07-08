import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEmployeeApp, EmployeeApp } from '../employee-app.model';

import { EmployeeAppService } from './employee-app.service';

describe('Service Tests', () => {
  describe('EmployeeApp Service', () => {
    let service: EmployeeAppService;
    let httpMock: HttpTestingController;
    let elemDefault: IEmployeeApp;
    let expectedResult: IEmployeeApp | IEmployeeApp[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(EmployeeAppService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        firstName: 'AAAAAAA',
        lastName: 'AAAAAAA',
        email: 'AAAAAAA',
        phoneNumber: 'AAAAAAA',
        hireDate: currentDate,
        salary: 0,
        commissionPct: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            hireDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a EmployeeApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            hireDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            hireDate: currentDate,
          },
          returnedFromService
        );

        service.create(new EmployeeApp()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a EmployeeApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
            email: 'BBBBBB',
            phoneNumber: 'BBBBBB',
            hireDate: currentDate.format(DATE_TIME_FORMAT),
            salary: 1,
            commissionPct: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            hireDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a EmployeeApp', () => {
        const patchObject = Object.assign(
          {
            lastName: 'BBBBBB',
            email: 'BBBBBB',
            phoneNumber: 'BBBBBB',
            hireDate: currentDate.format(DATE_TIME_FORMAT),
            salary: 1,
            commissionPct: 1,
          },
          new EmployeeApp()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            hireDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of EmployeeApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
            email: 'BBBBBB',
            phoneNumber: 'BBBBBB',
            hireDate: currentDate.format(DATE_TIME_FORMAT),
            salary: 1,
            commissionPct: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            hireDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a EmployeeApp', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addEmployeeAppToCollectionIfMissing', () => {
        it('should add a EmployeeApp to an empty array', () => {
          const employee: IEmployeeApp = { id: 123 };
          expectedResult = service.addEmployeeAppToCollectionIfMissing([], employee);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(employee);
        });

        it('should not add a EmployeeApp to an array that contains it', () => {
          const employee: IEmployeeApp = { id: 123 };
          const employeeCollection: IEmployeeApp[] = [
            {
              ...employee,
            },
            { id: 456 },
          ];
          expectedResult = service.addEmployeeAppToCollectionIfMissing(employeeCollection, employee);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a EmployeeApp to an array that doesn't contain it", () => {
          const employee: IEmployeeApp = { id: 123 };
          const employeeCollection: IEmployeeApp[] = [{ id: 456 }];
          expectedResult = service.addEmployeeAppToCollectionIfMissing(employeeCollection, employee);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(employee);
        });

        it('should add only unique EmployeeApp to an array', () => {
          const employeeArray: IEmployeeApp[] = [{ id: 123 }, { id: 456 }, { id: 88217 }];
          const employeeCollection: IEmployeeApp[] = [{ id: 123 }];
          expectedResult = service.addEmployeeAppToCollectionIfMissing(employeeCollection, ...employeeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const employee: IEmployeeApp = { id: 123 };
          const employee2: IEmployeeApp = { id: 456 };
          expectedResult = service.addEmployeeAppToCollectionIfMissing([], employee, employee2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(employee);
          expect(expectedResult).toContain(employee2);
        });

        it('should accept null and undefined values', () => {
          const employee: IEmployeeApp = { id: 123 };
          expectedResult = service.addEmployeeAppToCollectionIfMissing([], null, employee, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(employee);
        });

        it('should return initial array if no EmployeeApp is added', () => {
          const employeeCollection: IEmployeeApp[] = [{ id: 123 }];
          expectedResult = service.addEmployeeAppToCollectionIfMissing(employeeCollection, undefined, null);
          expect(expectedResult).toEqual(employeeCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
