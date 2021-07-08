import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EmployeeAppComponent } from './list/employee-app.component';
import { EmployeeAppDetailComponent } from './detail/employee-app-detail.component';
import { EmployeeAppUpdateComponent } from './update/employee-app-update.component';
import { EmployeeAppDeleteDialogComponent } from './delete/employee-app-delete-dialog.component';
import { EmployeeAppRoutingModule } from './route/employee-app-routing.module';

@NgModule({
  imports: [SharedModule, EmployeeAppRoutingModule],
  declarations: [EmployeeAppComponent, EmployeeAppDetailComponent, EmployeeAppUpdateComponent, EmployeeAppDeleteDialogComponent],
  entryComponents: [EmployeeAppDeleteDialogComponent],
})
export class EmployeeAppModule {}
