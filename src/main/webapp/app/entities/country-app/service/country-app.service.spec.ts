import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICountryApp, CountryApp } from '../country-app.model';

import { CountryAppService } from './country-app.service';

describe('Service Tests', () => {
  describe('CountryApp Service', () => {
    let service: CountryAppService;
    let httpMock: HttpTestingController;
    let elemDefault: ICountryApp;
    let expectedResult: ICountryApp | ICountryApp[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CountryAppService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        countryName: 'AAAAAAA',
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

      it('should create a CountryApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new CountryApp()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a CountryApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            countryName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a CountryApp', () => {
        const patchObject = Object.assign({}, new CountryApp());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of CountryApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            countryName: 'BBBBBB',
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

      it('should delete a CountryApp', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCountryAppToCollectionIfMissing', () => {
        it('should add a CountryApp to an empty array', () => {
          const country: ICountryApp = { id: 123 };
          expectedResult = service.addCountryAppToCollectionIfMissing([], country);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(country);
        });

        it('should not add a CountryApp to an array that contains it', () => {
          const country: ICountryApp = { id: 123 };
          const countryCollection: ICountryApp[] = [
            {
              ...country,
            },
            { id: 456 },
          ];
          expectedResult = service.addCountryAppToCollectionIfMissing(countryCollection, country);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a CountryApp to an array that doesn't contain it", () => {
          const country: ICountryApp = { id: 123 };
          const countryCollection: ICountryApp[] = [{ id: 456 }];
          expectedResult = service.addCountryAppToCollectionIfMissing(countryCollection, country);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(country);
        });

        it('should add only unique CountryApp to an array', () => {
          const countryArray: ICountryApp[] = [{ id: 123 }, { id: 456 }, { id: 86835 }];
          const countryCollection: ICountryApp[] = [{ id: 123 }];
          expectedResult = service.addCountryAppToCollectionIfMissing(countryCollection, ...countryArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const country: ICountryApp = { id: 123 };
          const country2: ICountryApp = { id: 456 };
          expectedResult = service.addCountryAppToCollectionIfMissing([], country, country2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(country);
          expect(expectedResult).toContain(country2);
        });

        it('should accept null and undefined values', () => {
          const country: ICountryApp = { id: 123 };
          expectedResult = service.addCountryAppToCollectionIfMissing([], null, country, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(country);
        });

        it('should return initial array if no CountryApp is added', () => {
          const countryCollection: ICountryApp[] = [{ id: 123 }];
          expectedResult = service.addCountryAppToCollectionIfMissing(countryCollection, undefined, null);
          expect(expectedResult).toEqual(countryCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
