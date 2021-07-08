import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Language } from 'app/entities/enumerations/language.model';
import { IJobHistoryApp, JobHistoryApp } from '../job-history-app.model';

import { JobHistoryAppService } from './job-history-app.service';

describe('Service Tests', () => {
  describe('JobHistoryApp Service', () => {
    let service: JobHistoryAppService;
    let httpMock: HttpTestingController;
    let elemDefault: IJobHistoryApp;
    let expectedResult: IJobHistoryApp | IJobHistoryApp[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(JobHistoryAppService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        startDate: currentDate,
        endDate: currentDate,
        language: Language.FRENCH,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            startDate: currentDate.format(DATE_TIME_FORMAT),
            endDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a JobHistoryApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            startDate: currentDate.format(DATE_TIME_FORMAT),
            endDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.create(new JobHistoryApp()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a JobHistoryApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            startDate: currentDate.format(DATE_TIME_FORMAT),
            endDate: currentDate.format(DATE_TIME_FORMAT),
            language: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a JobHistoryApp', () => {
        const patchObject = Object.assign(
          {
            endDate: currentDate.format(DATE_TIME_FORMAT),
          },
          new JobHistoryApp()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            startDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of JobHistoryApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            startDate: currentDate.format(DATE_TIME_FORMAT),
            endDate: currentDate.format(DATE_TIME_FORMAT),
            language: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a JobHistoryApp', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addJobHistoryAppToCollectionIfMissing', () => {
        it('should add a JobHistoryApp to an empty array', () => {
          const jobHistory: IJobHistoryApp = { id: 123 };
          expectedResult = service.addJobHistoryAppToCollectionIfMissing([], jobHistory);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(jobHistory);
        });

        it('should not add a JobHistoryApp to an array that contains it', () => {
          const jobHistory: IJobHistoryApp = { id: 123 };
          const jobHistoryCollection: IJobHistoryApp[] = [
            {
              ...jobHistory,
            },
            { id: 456 },
          ];
          expectedResult = service.addJobHistoryAppToCollectionIfMissing(jobHistoryCollection, jobHistory);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a JobHistoryApp to an array that doesn't contain it", () => {
          const jobHistory: IJobHistoryApp = { id: 123 };
          const jobHistoryCollection: IJobHistoryApp[] = [{ id: 456 }];
          expectedResult = service.addJobHistoryAppToCollectionIfMissing(jobHistoryCollection, jobHistory);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(jobHistory);
        });

        it('should add only unique JobHistoryApp to an array', () => {
          const jobHistoryArray: IJobHistoryApp[] = [{ id: 123 }, { id: 456 }, { id: 95992 }];
          const jobHistoryCollection: IJobHistoryApp[] = [{ id: 123 }];
          expectedResult = service.addJobHistoryAppToCollectionIfMissing(jobHistoryCollection, ...jobHistoryArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const jobHistory: IJobHistoryApp = { id: 123 };
          const jobHistory2: IJobHistoryApp = { id: 456 };
          expectedResult = service.addJobHistoryAppToCollectionIfMissing([], jobHistory, jobHistory2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(jobHistory);
          expect(expectedResult).toContain(jobHistory2);
        });

        it('should accept null and undefined values', () => {
          const jobHistory: IJobHistoryApp = { id: 123 };
          expectedResult = service.addJobHistoryAppToCollectionIfMissing([], null, jobHistory, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(jobHistory);
        });

        it('should return initial array if no JobHistoryApp is added', () => {
          const jobHistoryCollection: IJobHistoryApp[] = [{ id: 123 }];
          expectedResult = service.addJobHistoryAppToCollectionIfMissing(jobHistoryCollection, undefined, null);
          expect(expectedResult).toEqual(jobHistoryCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
