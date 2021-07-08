import { IJobApp } from 'app/entities/job-app/job-app.model';

export interface ITaskApp {
  id?: number;
  title?: string | null;
  description?: string | null;
  jobs?: IJobApp[] | null;
}

export class TaskApp implements ITaskApp {
  constructor(public id?: number, public title?: string | null, public description?: string | null, public jobs?: IJobApp[] | null) {}
}

export function getTaskAppIdentifier(task: ITaskApp): number | undefined {
  return task.id;
}
