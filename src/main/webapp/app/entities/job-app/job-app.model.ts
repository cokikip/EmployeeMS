import { ITaskApp } from 'app/entities/task-app/task-app.model';
import { IEmployeeApp } from 'app/entities/employee-app/employee-app.model';

export interface IJobApp {
  id?: number;
  jobTitle?: string | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  tasks?: ITaskApp[] | null;
  employee?: IEmployeeApp | null;
}

export class JobApp implements IJobApp {
  constructor(
    public id?: number,
    public jobTitle?: string | null,
    public minSalary?: number | null,
    public maxSalary?: number | null,
    public tasks?: ITaskApp[] | null,
    public employee?: IEmployeeApp | null
  ) {}
}

export function getJobAppIdentifier(job: IJobApp): number | undefined {
  return job.id;
}
