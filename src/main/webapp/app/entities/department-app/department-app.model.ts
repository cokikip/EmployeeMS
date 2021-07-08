import { ILocationApp } from 'app/entities/location-app/location-app.model';
import { IEmployeeApp } from 'app/entities/employee-app/employee-app.model';

export interface IDepartmentApp {
  id?: number;
  departmentName?: string;
  location?: ILocationApp | null;
  employees?: IEmployeeApp[] | null;
}

export class DepartmentApp implements IDepartmentApp {
  constructor(
    public id?: number,
    public departmentName?: string,
    public location?: ILocationApp | null,
    public employees?: IEmployeeApp[] | null
  ) {}
}

export function getDepartmentAppIdentifier(department: IDepartmentApp): number | undefined {
  return department.id;
}
