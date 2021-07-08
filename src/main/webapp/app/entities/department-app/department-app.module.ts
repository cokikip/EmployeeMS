import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DepartmentAppComponent } from './list/department-app.component';
import { DepartmentAppDetailComponent } from './detail/department-app-detail.component';
import { DepartmentAppUpdateComponent } from './update/department-app-update.component';
import { DepartmentAppDeleteDialogComponent } from './delete/department-app-delete-dialog.component';
import { DepartmentAppRoutingModule } from './route/department-app-routing.module';

@NgModule({
  imports: [SharedModule, DepartmentAppRoutingModule],
  declarations: [DepartmentAppComponent, DepartmentAppDetailComponent, DepartmentAppUpdateComponent, DepartmentAppDeleteDialogComponent],
  entryComponents: [DepartmentAppDeleteDialogComponent],
})
export class DepartmentAppModule {}
