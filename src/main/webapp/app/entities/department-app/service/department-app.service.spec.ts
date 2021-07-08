import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDepartmentApp, DepartmentApp } from '../department-app.model';

import { DepartmentAppService } from './department-app.service';

describe('Service Tests', () => {
  describe('DepartmentApp Service', () => {
    let service: DepartmentAppService;
    let httpMock: HttpTestingController;
    let elemDefault: IDepartmentApp;
    let expectedResult: IDepartmentApp | IDepartmentApp[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(DepartmentAppService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        departmentName: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a DepartmentApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new DepartmentApp()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a DepartmentApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            departmentName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a DepartmentApp', () => {
        const patchObject = Object.assign({}, new DepartmentApp());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of DepartmentApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            departmentName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a DepartmentApp', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addDepartmentAppToCollectionIfMissing', () => {
        it('should add a DepartmentApp to an empty array', () => {
          const department: IDepartmentApp = { id: 123 };
          expectedResult = service.addDepartmentAppToCollectionIfMissing([], department);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(department);
        });

        it('should not add a DepartmentApp to an array that contains it', () => {
          const department: IDepartmentApp = { id: 123 };
          const departmentCollection: IDepartmentApp[] = [
            {
              ...department,
            },
            { id: 456 },
          ];
          expectedResult = service.addDepartmentAppToCollectionIfMissing(departmentCollection, department);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a DepartmentApp to an array that doesn't contain it", () => {
          const department: IDepartmentApp = { id: 123 };
          const departmentCollection: IDepartmentApp[] = [{ id: 456 }];
          expectedResult = service.addDepartmentAppToCollectionIfMissing(departmentCollection, department);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(department);
        });

        it('should add only unique DepartmentApp to an array', () => {
          const departmentArray: IDepartmentApp[] = [{ id: 123 }, { id: 456 }, { id: 6882 }];
          const departmentCollection: IDepartmentApp[] = [{ id: 123 }];
          expectedResult = service.addDepartmentAppToCollectionIfMissing(departmentCollection, ...departmentArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const department: IDepartmentApp = { id: 123 };
          const department2: IDepartmentApp = { id: 456 };
          expectedResult = service.addDepartmentAppToCollectionIfMissing([], department, department2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(department);
          expect(expectedResult).toContain(department2);
        });

        it('should accept null and undefined values', () => {
          const department: IDepartmentApp = { id: 123 };
          expectedResult = service.addDepartmentAppToCollectionIfMissing([], null, department, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(department);
        });

        it('should return initial array if no DepartmentApp is added', () => {
          const departmentCollection: IDepartmentApp[] = [{ id: 123 }];
          expectedResult = service.addDepartmentAppToCollectionIfMissing(departmentCollection, undefined, null);
          expect(expectedResult).toEqual(departmentCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
