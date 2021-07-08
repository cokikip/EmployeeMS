import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RegionAppComponent } from '../list/region-app.component';
import { RegionAppDetailComponent } from '../detail/region-app-detail.component';
import { RegionAppUpdateComponent } from '../update/region-app-update.component';
import { RegionAppRoutingResolveService } from './region-app-routing-resolve.service';

const regionRoute: Routes = [
  {
    path: '',
    component: RegionAppComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RegionAppDetailComponent,
    resolve: {
      region: RegionAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RegionAppUpdateComponent,
    resolve: {
      region: RegionAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RegionAppUpdateComponent,
    resolve: {
      region: RegionAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(regionRoute)],
  exports: [RouterModule],
})
export class RegionAppRoutingModule {}
