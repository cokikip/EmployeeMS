import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TaskAppComponent } from './list/task-app.component';
import { TaskAppDetailComponent } from './detail/task-app-detail.component';
import { TaskAppUpdateComponent } from './update/task-app-update.component';
import { TaskAppDeleteDialogComponent } from './delete/task-app-delete-dialog.component';
import { TaskAppRoutingModule } from './route/task-app-routing.module';

@NgModule({
  imports: [SharedModule, TaskAppRoutingModule],
  declarations: [TaskAppComponent, TaskAppDetailComponent, TaskAppUpdateComponent, TaskAppDeleteDialogComponent],
  entryComponents: [TaskAppDeleteDialogComponent],
})
export class TaskAppModule {}
