import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DepartmentAppComponent } from '../list/department-app.component';
import { DepartmentAppDetailComponent } from '../detail/department-app-detail.component';
import { DepartmentAppUpdateComponent } from '../update/department-app-update.component';
import { DepartmentAppRoutingResolveService } from './department-app-routing-resolve.service';

const departmentRoute: Routes = [
  {
    path: '',
    component: DepartmentAppComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DepartmentAppDetailComponent,
    resolve: {
      department: DepartmentAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DepartmentAppUpdateComponent,
    resolve: {
      department: DepartmentAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DepartmentAppUpdateComponent,
    resolve: {
      department: DepartmentAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(departmentRoute)],
  exports: [RouterModule],
})
export class DepartmentAppRoutingModule {}
