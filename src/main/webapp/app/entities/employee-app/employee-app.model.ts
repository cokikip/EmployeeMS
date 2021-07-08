import * as dayjs from 'dayjs';
import { IJobApp } from 'app/entities/job-app/job-app.model';
import { IDepartmentApp } from 'app/entities/department-app/department-app.model';

export interface IEmployeeApp {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  hireDate?: dayjs.Dayjs | null;
  salary?: number | null;
  commissionPct?: number | null;
  jobs?: IJobApp[] | null;
  manager?: IEmployeeApp | null;
  department?: IDepartmentApp | null;
}

export class EmployeeApp implements IEmployeeApp {
  constructor(
    public id?: number,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string | null,
    public phoneNumber?: string | null,
    public hireDate?: dayjs.Dayjs | null,
    public salary?: number | null,
    public commissionPct?: number | null,
    public jobs?: IJobApp[] | null,
    public manager?: IEmployeeApp | null,
    public department?: IDepartmentApp | null
  ) {}
}

export function getEmployeeAppIdentifier(employee: IEmployeeApp): number | undefined {
  return employee.id;
}
