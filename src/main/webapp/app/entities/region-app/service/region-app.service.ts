import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRegionApp, getRegionAppIdentifier } from '../region-app.model';

export type EntityResponseType = HttpResponse<IRegionApp>;
export type EntityArrayResponseType = HttpResponse<IRegionApp[]>;

@Injectable({ providedIn: 'root' })
export class RegionAppService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/regions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(region: IRegionApp): Observable<EntityResponseType> {
    return this.http.post<IRegionApp>(this.resourceUrl, region, { observe: 'response' });
  }

  update(region: IRegionApp): Observable<EntityResponseType> {
    return this.http.put<IRegionApp>(`${this.resourceUrl}/${getRegionAppIdentifier(region) as number}`, region, { observe: 'response' });
  }

  partialUpdate(region: IRegionApp): Observable<EntityResponseType> {
    return this.http.patch<IRegionApp>(`${this.resourceUrl}/${getRegionAppIdentifier(region) as number}`, region, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRegionApp>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRegionApp[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRegionAppToCollectionIfMissing(regionCollection: IRegionApp[], ...regionsToCheck: (IRegionApp | null | undefined)[]): IRegionApp[] {
    const regions: IRegionApp[] = regionsToCheck.filter(isPresent);
    if (regions.length > 0) {
      const regionCollectionIdentifiers = regionCollection.map(regionItem => getRegionAppIdentifier(regionItem)!);
      const regionsToAdd = regions.filter(regionItem => {
        const regionIdentifier = getRegionAppIdentifier(regionItem);
        if (regionIdentifier == null || regionCollectionIdentifiers.includes(regionIdentifier)) {
          return false;
        }
        regionCollectionIdentifiers.push(regionIdentifier);
        return true;
      });
      return [...regionsToAdd, ...regionCollection];
    }
    return regionCollection;
  }
}
