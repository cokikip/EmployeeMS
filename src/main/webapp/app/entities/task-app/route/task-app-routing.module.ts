import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TaskAppComponent } from '../list/task-app.component';
import { TaskAppDetailComponent } from '../detail/task-app-detail.component';
import { TaskAppUpdateComponent } from '../update/task-app-update.component';
import { TaskAppRoutingResolveService } from './task-app-routing-resolve.service';

const taskRoute: Routes = [
  {
    path: '',
    component: TaskAppComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TaskAppDetailComponent,
    resolve: {
      task: TaskAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TaskAppUpdateComponent,
    resolve: {
      task: TaskAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TaskAppUpdateComponent,
    resolve: {
      task: TaskAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(taskRoute)],
  exports: [RouterModule],
})
export class TaskAppRoutingModule {}
