import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'region-app',
        data: { pageTitle: 'Regions' },
        loadChildren: () => import('./region-app/region-app.module').then(m => m.RegionAppModule),
      },
      {
        path: 'country-app',
        data: { pageTitle: 'Countries' },
        loadChildren: () => import('./country-app/country-app.module').then(m => m.CountryAppModule),
      },
      {
        path: 'location-app',
        data: { pageTitle: 'Locations' },
        loadChildren: () => import('./location-app/location-app.module').then(m => m.LocationAppModule),
      },
      {
        path: 'department-app',
        data: { pageTitle: 'Departments' },
        loadChildren: () => import('./department-app/department-app.module').then(m => m.DepartmentAppModule),
      },
      {
        path: 'task-app',
        data: { pageTitle: 'Tasks' },
        loadChildren: () => import('./task-app/task-app.module').then(m => m.TaskAppModule),
      },
      {
        path: 'employee-app',
        data: { pageTitle: 'Employees' },
        loadChildren: () => import('./employee-app/employee-app.module').then(m => m.EmployeeAppModule),
      },
      {
        path: 'job-app',
        data: { pageTitle: 'Jobs' },
        loadChildren: () => import('./job-app/job-app.module').then(m => m.JobAppModule),
      },
      {
        path: 'job-history-app',
        data: { pageTitle: 'JobHistories' },
        loadChildren: () => import('./job-history-app/job-history-app.module').then(m => m.JobHistoryAppModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
