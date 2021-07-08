import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { JobHistoryAppComponent } from './list/job-history-app.component';
import { JobHistoryAppDetailComponent } from './detail/job-history-app-detail.component';
import { JobHistoryAppUpdateComponent } from './update/job-history-app-update.component';
import { JobHistoryAppDeleteDialogComponent } from './delete/job-history-app-delete-dialog.component';
import { JobHistoryAppRoutingModule } from './route/job-history-app-routing.module';

@NgModule({
  imports: [SharedModule, JobHistoryAppRoutingModule],
  declarations: [JobHistoryAppComponent, JobHistoryAppDetailComponent, JobHistoryAppUpdateComponent, JobHistoryAppDeleteDialogComponent],
  entryComponents: [JobHistoryAppDeleteDialogComponent],
})
export class JobHistoryAppModule {}
