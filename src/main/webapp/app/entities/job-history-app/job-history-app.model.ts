import * as dayjs from 'dayjs';
import { IJobApp } from 'app/entities/job-app/job-app.model';
import { IDepartmentApp } from 'app/entities/department-app/department-app.model';
import { IEmployeeApp } from 'app/entities/employee-app/employee-app.model';
import { Language } from 'app/entities/enumerations/language.model';

export interface IJobHistoryApp {
  id?: number;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  language?: Language | null;
  job?: IJobApp | null;
  department?: IDepartmentApp | null;
  employee?: IEmployeeApp | null;
}

export class JobHistoryApp implements IJobHistoryApp {
  constructor(
    public id?: number,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public language?: Language | null,
    public job?: IJobApp | null,
    public department?: IDepartmentApp | null,
    public employee?: IEmployeeApp | null
  ) {}
}

export function getJobHistoryAppIdentifier(jobHistory: IJobHistoryApp): number | undefined {
  return jobHistory.id;
}
