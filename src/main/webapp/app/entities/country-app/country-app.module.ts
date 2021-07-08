import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CountryAppComponent } from './list/country-app.component';
import { CountryAppDetailComponent } from './detail/country-app-detail.component';
import { CountryAppUpdateComponent } from './update/country-app-update.component';
import { CountryAppDeleteDialogComponent } from './delete/country-app-delete-dialog.component';
import { CountryAppRoutingModule } from './route/country-app-routing.module';

@NgModule({
  imports: [SharedModule, CountryAppRoutingModule],
  declarations: [CountryAppComponent, CountryAppDetailComponent, CountryAppUpdateComponent, CountryAppDeleteDialogComponent],
  entryComponents: [CountryAppDeleteDialogComponent],
})
export class CountryAppModule {}
