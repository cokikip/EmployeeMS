import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RegionAppComponent } from './list/region-app.component';
import { RegionAppDetailComponent } from './detail/region-app-detail.component';
import { RegionAppUpdateComponent } from './update/region-app-update.component';
import { RegionAppDeleteDialogComponent } from './delete/region-app-delete-dialog.component';
import { RegionAppRoutingModule } from './route/region-app-routing.module';

@NgModule({
  imports: [SharedModule, RegionAppRoutingModule],
  declarations: [RegionAppComponent, RegionAppDetailComponent, RegionAppUpdateComponent, RegionAppDeleteDialogComponent],
  entryComponents: [RegionAppDeleteDialogComponent],
})
export class RegionAppModule {}
