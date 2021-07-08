import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITaskApp, TaskApp } from '../task-app.model';

import { TaskAppService } from './task-app.service';

describe('Service Tests', () => {
  describe('TaskApp Service', () => {
    let service: TaskAppService;
    let httpMock: HttpTestingController;
    let elemDefault: ITaskApp;
    let expectedResult: ITaskApp | ITaskApp[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TaskAppService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        title: 'AAAAAAA',
        description: 'AAAAAAA',
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

      it('should create a TaskApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new TaskApp()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a TaskApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            title: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a TaskApp', () => {
        const patchObject = Object.assign({}, new TaskApp());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of TaskApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            title: 'BBBBBB',
            description: 'BBBBBB',
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

      it('should delete a TaskApp', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTaskAppToCollectionIfMissing', () => {
        it('should add a TaskApp to an empty array', () => {
          const task: ITaskApp = { id: 123 };
          expectedResult = service.addTaskAppToCollectionIfMissing([], task);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(task);
        });

        it('should not add a TaskApp to an array that contains it', () => {
          const task: ITaskApp = { id: 123 };
          const taskCollection: ITaskApp[] = [
            {
              ...task,
            },
            { id: 456 },
          ];
          expectedResult = service.addTaskAppToCollectionIfMissing(taskCollection, task);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a TaskApp to an array that doesn't contain it", () => {
          const task: ITaskApp = { id: 123 };
          const taskCollection: ITaskApp[] = [{ id: 456 }];
          expectedResult = service.addTaskAppToCollectionIfMissing(taskCollection, task);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(task);
        });

        it('should add only unique TaskApp to an array', () => {
          const taskArray: ITaskApp[] = [{ id: 123 }, { id: 456 }, { id: 90209 }];
          const taskCollection: ITaskApp[] = [{ id: 123 }];
          expectedResult = service.addTaskAppToCollectionIfMissing(taskCollection, ...taskArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const task: ITaskApp = { id: 123 };
          const task2: ITaskApp = { id: 456 };
          expectedResult = service.addTaskAppToCollectionIfMissing([], task, task2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(task);
          expect(expectedResult).toContain(task2);
        });

        it('should accept null and undefined values', () => {
          const task: ITaskApp = { id: 123 };
          expectedResult = service.addTaskAppToCollectionIfMissing([], null, task, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(task);
        });

        it('should return initial array if no TaskApp is added', () => {
          const taskCollection: ITaskApp[] = [{ id: 123 }];
          expectedResult = service.addTaskAppToCollectionIfMissing(taskCollection, undefined, null);
          expect(expectedResult).toEqual(taskCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
