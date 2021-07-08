import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILocationApp, LocationApp } from '../location-app.model';

import { LocationAppService } from './location-app.service';

describe('Service Tests', () => {
  describe('LocationApp Service', () => {
    let service: LocationAppService;
    let httpMock: HttpTestingController;
    let elemDefault: ILocationApp;
    let expectedResult: ILocationApp | ILocationApp[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LocationAppService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        streetAddress: 'AAAAAAA',
        postalCode: 'AAAAAAA',
        city: 'AAAAAAA',
        stateProvince: 'AAAAAAA',
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

      it('should create a LocationApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new LocationApp()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a LocationApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            streetAddress: 'BBBBBB',
            postalCode: 'BBBBBB',
            city: 'BBBBBB',
            stateProvince: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a LocationApp', () => {
        const patchObject = Object.assign(
          {
            streetAddress: 'BBBBBB',
            postalCode: 'BBBBBB',
            city: 'BBBBBB',
          },
          new LocationApp()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of LocationApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            streetAddress: 'BBBBBB',
            postalCode: 'BBBBBB',
            city: 'BBBBBB',
            stateProvince: 'BBBBBB',
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

      it('should delete a LocationApp', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLocationAppToCollectionIfMissing', () => {
        it('should add a LocationApp to an empty array', () => {
          const location: ILocationApp = { id: 123 };
          expectedResult = service.addLocationAppToCollectionIfMissing([], location);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(location);
        });

        it('should not add a LocationApp to an array that contains it', () => {
          const location: ILocationApp = { id: 123 };
          const locationCollection: ILocationApp[] = [
            {
              ...location,
            },
            { id: 456 },
          ];
          expectedResult = service.addLocationAppToCollectionIfMissing(locationCollection, location);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a LocationApp to an array that doesn't contain it", () => {
          const location: ILocationApp = { id: 123 };
          const locationCollection: ILocationApp[] = [{ id: 456 }];
          expectedResult = service.addLocationAppToCollectionIfMissing(locationCollection, location);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(location);
        });

        it('should add only unique LocationApp to an array', () => {
          const locationArray: ILocationApp[] = [{ id: 123 }, { id: 456 }, { id: 53343 }];
          const locationCollection: ILocationApp[] = [{ id: 123 }];
          expectedResult = service.addLocationAppToCollectionIfMissing(locationCollection, ...locationArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const location: ILocationApp = { id: 123 };
          const location2: ILocationApp = { id: 456 };
          expectedResult = service.addLocationAppToCollectionIfMissing([], location, location2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(location);
          expect(expectedResult).toContain(location2);
        });

        it('should accept null and undefined values', () => {
          const location: ILocationApp = { id: 123 };
          expectedResult = service.addLocationAppToCollectionIfMissing([], null, location, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(location);
        });

        it('should return initial array if no LocationApp is added', () => {
          const locationCollection: ILocationApp[] = [{ id: 123 }];
          expectedResult = service.addLocationAppToCollectionIfMissing(locationCollection, undefined, null);
          expect(expectedResult).toEqual(locationCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
