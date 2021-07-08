export interface IRegionApp {
  id?: number;
  regionName?: string | null;
}

export class RegionApp implements IRegionApp {
  constructor(public id?: number, public regionName?: string | null) {}
}

export function getRegionAppIdentifier(region: IRegionApp): number | undefined {
  return region.id;
}
