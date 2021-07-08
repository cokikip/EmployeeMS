import { IRegionApp } from 'app/entities/region-app/region-app.model';

export interface ICountryApp {
  id?: number;
  countryName?: string | null;
  region?: IRegionApp | null;
}

export class CountryApp implements ICountryApp {
  constructor(public id?: number, public countryName?: string | null, public region?: IRegionApp | null) {}
}

export function getCountryAppIdentifier(country: ICountryApp): number | undefined {
  return country.id;
}
