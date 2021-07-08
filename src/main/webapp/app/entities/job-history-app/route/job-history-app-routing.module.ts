import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { JobHistoryAppComponent } from '../list/job-history-app.component';
import { JobHistoryAppDetailComponent } from '../detail/job-history-app-detail.component';
import { JobHistoryAppUpdateComponent } from '../update/job-history-app-update.component';
import { JobHistoryAppRoutingResolveService } from './job-history-app-routing-resolve.service';

const jobHistoryRoute: Routes = [
  {
    path: '',
    component: JobHistoryAppComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JobHistoryAppDetailComponent,
    resolve: {
      jobHistory: JobHistoryAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JobHistoryAppUpdateComponent,
    resolve: {
      jobHistory: JobHistoryAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JobHistoryAppUpdateComponent,
    resolve: {
      jobHistory: JobHistoryAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(jobHistoryRoute)],
  exports: [RouterModule],
})
export class JobHistoryAppRoutingModule {}
