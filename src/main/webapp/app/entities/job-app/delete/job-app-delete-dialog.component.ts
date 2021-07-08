import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IJobApp } from '../job-app.model';
import { JobAppService } from '../service/job-app.service';

@Component({
  templateUrl: './job-app-delete-dialog.component.html',
})
export class JobAppDeleteDialogComponent {
  job?: IJobApp;

  constructor(protected jobService: JobAppService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jobService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
