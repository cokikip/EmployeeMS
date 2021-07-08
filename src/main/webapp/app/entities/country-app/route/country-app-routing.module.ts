import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CountryAppComponent } from '../list/country-app.component';
import { CountryAppDetailComponent } from '../detail/country-app-detail.component';
import { CountryAppUpdateComponent } from '../update/country-app-update.component';
import { CountryAppRoutingResolveService } from './country-app-routing-resolve.service';

const countryRoute: Routes = [
  {
    path: '',
    component: CountryAppComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CountryAppDetailComponent,
    resolve: {
      country: CountryAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CountryAppUpdateComponent,
    resolve: {
      country: CountryAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CountryAppUpdateComponent,
    resolve: {
      country: CountryAppRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(countryRoute)],
  exports: [RouterModule],
})
export class CountryAppRoutingModule {}
