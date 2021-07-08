import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LocationAppComponent } from '../list/location-app.component';
import { LocationAppDetailComponent } from '../detail/location-app-detail.component';
import { LocationAppUpdateComponent } from '../update/location-app-update.component';
import { LocationAppRoutingResolveService } from './location-app-routing-resolve.service';

const locationRoute: Routes = [
  {
    path: '',
    component: LocationAppComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LocationAppDetailComponent,
    resolve: {
      location: LocationAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LocationAppUpdateComponent,
    resolve: {
      location: LocationAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LocationAppUpdateComponent,
    resolve: {
      location: LocationAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(locationRoute)],
  exports: [RouterModule],
})
export class LocationAppRoutingModule {}
