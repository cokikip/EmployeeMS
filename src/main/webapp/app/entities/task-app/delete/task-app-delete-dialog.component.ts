import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITaskApp } from '../task-app.model';
import { TaskAppService } from '../service/task-app.service';

@Component({
  templateUrl: './task-app-delete-dialog.component.html',
})
export class TaskAppDeleteDialogComponent {
  task?: ITaskApp;

  constructor(protected taskService: TaskAppService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.taskService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
