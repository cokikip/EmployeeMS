import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { JobAppComponent } from './list/job-app.component';
import { JobAppDetailComponent } from './detail/job-app-detail.component';
import { JobAppUpdateComponent } from './update/job-app-update.component';
import { JobAppDeleteDialogComponent } from './delete/job-app-delete-dialog.component';
import { JobAppRoutingModule } from './route/job-app-routing.module';

@NgModule({
  imports: [SharedModule, JobAppRoutingModule],
  declarations: [JobAppComponent, JobAppDetailComponent, JobAppUpdateComponent, JobAppDeleteDialogComponent],
  entryComponents: [JobAppDeleteDialogComponent],
})
export class JobAppModule {}
