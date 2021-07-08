import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LocationAppComponent } from './list/location-app.component';
import { LocationAppDetailComponent } from './detail/location-app-detail.component';
import { LocationAppUpdateComponent } from './update/location-app-update.component';
import { LocationAppDeleteDialogComponent } from './delete/location-app-delete-dialog.component';
import { LocationAppRoutingModule } from './route/location-app-routing.module';

@NgModule({
  imports: [SharedModule, LocationAppRoutingModule],
  declarations: [LocationAppComponent, LocationAppDetailComponent, LocationAppUpdateComponent, LocationAppDeleteDialogComponent],
  entryComponents: [LocationAppDeleteDialogComponent],
})
export class LocationAppModule {}
