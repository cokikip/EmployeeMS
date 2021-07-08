import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmployeeAppComponent } from '../list/employee-app.component';
import { EmployeeAppDetailComponent } from '../detail/employee-app-detail.component';
import { EmployeeAppUpdateComponent } from '../update/employee-app-update.component';
import { EmployeeAppRoutingResolveService } from './employee-app-routing-resolve.service';

const employeeRoute: Routes = [
  {
    path: '',
    component: EmployeeAppComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmployeeAppDetailComponent,
    resolve: {
      employee: EmployeeAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmployeeAppUpdateComponent,
    resolve: {
      employee: EmployeeAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmployeeAppUpdateComponent,
    resolve: {
      employee: EmployeeAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(employeeRoute)],
  exports: [RouterModule],
})
export class EmployeeAppRoutingModule {}
