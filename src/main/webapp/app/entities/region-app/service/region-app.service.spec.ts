import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRegionApp, RegionApp } from '../region-app.model';

import { RegionAppService } from './region-app.service';

describe('Service Tests', () => {
  describe('RegionApp Service', () => {
    let service: RegionAppService;
    let httpMock: HttpTestingController;
    let elemDefault: IRegionApp;
    let expectedResult: IRegionApp | IRegionApp[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RegionAppService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        regionName: 'AAAAAAA',
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

      it('should create a RegionApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new RegionApp()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a RegionApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            regionName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a RegionApp', () => {
        const patchObject = Object.assign({}, new RegionApp());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of RegionApp', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            regionName: 'BBBBBB',
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

      it('should delete a RegionApp', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRegionAppToCollectionIfMissing', () => {
        it('should add a RegionApp to an empty array', () => {
          const region: IRegionApp = { id: 123 };
          expectedResult = service.addRegionAppToCollectionIfMissing([], region);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(region);
        });

        it('should not add a RegionApp to an array that contains it', () => {
          const region: IRegionApp = { id: 123 };
          const regionCollection: IRegionApp[] = [
            {
              ...region,
            },
            { id: 456 },
          ];
          expectedResult = service.addRegionAppToCollectionIfMissing(regionCollection, region);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a RegionApp to an array that doesn't contain it", () => {
          const region: IRegionApp = { id: 123 };
          const regionCollection: IRegionApp[] = [{ id: 456 }];
          expectedResult = service.addRegionAppToCollectionIfMissing(regionCollection, region);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(region);
        });

        it('should add only unique RegionApp to an array', () => {
          const regionArray: IRegionApp[] = [{ id: 123 }, { id: 456 }, { id: 52888 }];
          const regionCollection: IRegionApp[] = [{ id: 123 }];
          expectedResult = service.addRegionAppToCollectionIfMissing(regionCollection, ...regionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const region: IRegionApp = { id: 123 };
          const region2: IRegionApp = { id: 456 };
          expectedResult = service.addRegionAppToCollectionIfMissing([], region, region2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(region);
          expect(expectedResult).toContain(region2);
        });

        it('should accept null and undefined values', () => {
          const region: IRegionApp = { id: 123 };
          expectedResult = service.addRegionAppToCollectionIfMissing([], null, region, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(region);
        });

        it('should return initial array if no RegionApp is added', () => {
          const regionCollection: IRegionApp[] = [{ id: 123 }];
          expectedResult = service.addRegionAppToCollectionIfMissing(regionCollection, undefined, null);
          expect(expectedResult).toEqual(regionCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
