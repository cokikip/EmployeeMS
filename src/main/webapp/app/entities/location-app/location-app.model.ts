import { ICountryApp } from 'app/entities/country-app/country-app.model';

export interface ILocationApp {
  id?: number;
  streetAddress?: string | null;
  postalCode?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  country?: ICountryApp | null;
}

export class LocationApp implements ILocationApp {
  constructor(
    public id?: number,
    public streetAddress?: string | null,
    public postalCode?: string | null,
    public city?: string | null,
    public stateProvince?: string | null,
    public country?: ICountryApp | null
  ) {}
}

export function getLocationAppIdentifier(location: ILocationApp): number | undefined {
  return location.id;
}
