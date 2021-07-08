import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICountryApp, getCountryAppIdentifier } from '../country-app.model';

export type EntityResponseType = HttpResponse<ICountryApp>;
export type EntityArrayResponseType = HttpResponse<ICountryApp[]>;

@Injectable({ providedIn: 'root' })
export class CountryAppService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/countries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(country: ICountryApp): Observable<EntityResponseType> {
    return this.http.post<ICountryApp>(this.resourceUrl, country, { observe: 'response' });
  }

  update(country: ICountryApp): Observable<EntityResponseType> {
    return this.http.put<ICountryApp>(`${this.resourceUrl}/${getCountryAppIdentifier(country) as number}`, country, {
      observe: 'response',
    });
  }

  partialUpdate(country: ICountryApp): Observable<EntityResponseType> {
    return this.http.patch<ICountryApp>(`${this.resourceUrl}/${getCountryAppIdentifier(country) as number}`, country, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICountryApp>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICountryApp[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCountryAppToCollectionIfMissing(
    countryCollection: ICountryApp[],
    ...countriesToCheck: (ICountryApp | null | undefined)[]
  ): ICountryApp[] {
    const countries: ICountryApp[] = countriesToCheck.filter(isPresent);
    if (countries.length > 0) {
      const countryCollectionIdentifiers = countryCollection.map(countryItem => getCountryAppIdentifier(countryItem)!);
      const countriesToAdd = countries.filter(countryItem => {
        const countryIdentifier = getCountryAppIdentifier(countryItem);
        if (countryIdentifier == null || countryCollectionIdentifiers.includes(countryIdentifier)) {
          return false;
        }
        countryCollectionIdentifiers.push(countryIdentifier);
        return true;
      });
      return [...countriesToAdd, ...countryCollection];
    }
    return countryCollection;
  }
}
