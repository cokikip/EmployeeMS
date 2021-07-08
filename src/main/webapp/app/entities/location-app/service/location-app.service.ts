import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILocationApp, getLocationAppIdentifier } from '../location-app.model';

export type EntityResponseType = HttpResponse<ILocationApp>;
export type EntityArrayResponseType = HttpResponse<ILocationApp[]>;

@Injectable({ providedIn: 'root' })
export class LocationAppService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/locations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(location: ILocationApp): Observable<EntityResponseType> {
    return this.http.post<ILocationApp>(this.resourceUrl, location, { observe: 'response' });
  }

  update(location: ILocationApp): Observable<EntityResponseType> {
    return this.http.put<ILocationApp>(`${this.resourceUrl}/${getLocationAppIdentifier(location) as number}`, location, {
      observe: 'response',
    });
  }

  partialUpdate(location: ILocationApp): Observable<EntityResponseType> {
    return this.http.patch<ILocationApp>(`${this.resourceUrl}/${getLocationAppIdentifier(location) as number}`, location, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILocationApp>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILocationApp[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLocationAppToCollectionIfMissing(
    locationCollection: ILocationApp[],
    ...locationsToCheck: (ILocationApp | null | undefined)[]
  ): ILocationApp[] {
    const locations: ILocationApp[] = locationsToCheck.filter(isPresent);
    if (locations.length > 0) {
      const locationCollectionIdentifiers = locationCollection.map(locationItem => getLocationAppIdentifier(locationItem)!);
      const locationsToAdd = locations.filter(locationItem => {
        const locationIdentifier = getLocationAppIdentifier(locationItem);
        if (locationIdentifier == null || locationCollectionIdentifiers.includes(locationIdentifier)) {
          return false;
        }
        locationCollectionIdentifiers.push(locationIdentifier);
        return true;
      });
      return [...locationsToAdd, ...locationCollection];
    }
    return locationCollection;
  }
}
