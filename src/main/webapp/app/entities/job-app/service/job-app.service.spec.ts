import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IJobApp, JobApp } from '../job-app.model';

import { JobAppService } from './job-app.service';

describe('Service Tests', () => {
  describe('JobApp Service', () => {
    let service: JobAppService;
    let httpMock: HttpTestingController;
    let elemDefault: IJobApp;
    let expectedResult: IJobApp | IJobApp[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(JobAppService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        jobTitle: 'AAAAAAA',
        minSalary: 0,
        maxSalary: 0,
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

      it('should create a JobApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new JobApp()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a JobApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            jobTitle: 'BBBBBB',
            minSalary: 1,
            maxSalary: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a JobApp', () => {
        const patchObject = Object.assign(
          {
            jobTitle: 'BBBBBB',
            maxSalary: 1,
          },
          new JobApp()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of JobApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            jobTitle: 'BBBBBB',
            minSalary: 1,
            maxSalary: 1,
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

      it('should delete a JobApp', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addJobAppToCollectionIfMissing', () => {
        it('should add a JobApp to an empty array', () => {
          const job: IJobApp = { id: 123 };
          expectedResult = service.addJobAppToCollectionIfMissing([], job);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(job);
        });

        it('should not add a JobApp to an array that contains it', () => {
          const job: IJobApp = { id: 123 };
          const jobCollection: IJobApp[] = [
            {
              ...job,
            },
            { id: 456 },
          ];
          expectedResult = service.addJobAppToCollectionIfMissing(jobCollection, job);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a JobApp to an array that doesn't contain it", () => {
          const job: IJobApp = { id: 123 };
          const jobCollection: IJobApp[] = [{ id: 456 }];
          expectedResult = service.addJobAppToCollectionIfMissing(jobCollection, job);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(job);
        });

        it('should add only unique JobApp to an array', () => {
          const jobArray: IJobApp[] = [{ id: 123 }, { id: 456 }, { id: 68934 }];
          const jobCollection: IJobApp[] = [{ id: 123 }];
          expectedResult = service.addJobAppToCollectionIfMissing(jobCollection, ...jobArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const job: IJobApp = { id: 123 };
          const job2: IJobApp = { id: 456 };
          expectedResult = service.addJobAppToCollectionIfMissing([], job, job2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(job);
          expect(expectedResult).toContain(job2);
        });

        it('should accept null and undefined values', () => {
          const job: IJobApp = { id: 123 };
          expectedResult = service.addJobAppToCollectionIfMissing([], null, job, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(job);
        });

        it('should return initial array if no JobApp is added', () => {
          const jobCollection: IJobApp[] = [{ id: 123 }];
          expectedResult = service.addJobAppToCollectionIfMissing(jobCollection, undefined, null);
          expect(expectedResult).toEqual(jobCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
