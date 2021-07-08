import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { JobAppComponent } from '../list/job-app.component';
import { JobAppDetailComponent } from '../detail/job-app-detail.component';
import { JobAppUpdateComponent } from '../update/job-app-update.component';
import { JobAppRoutingResolveService } from './job-app-routing-resolve.service';

const jobRoute: Routes = [
  {
    path: '',
    component: JobAppComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JobAppDetailComponent,
    resolve: {
      job: JobAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JobAppUpdateComponent,
    resolve: {
      job: JobAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JobAppUpdateComponent,
    resolve: {
      job: JobAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(jobRoute)],
  exports: [RouterModule],
})
export class JobAppRoutingModule {}
