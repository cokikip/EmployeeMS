import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IJobHistoryApp } from '../job-history-app.model';
import { JobHistoryAppService } from '../service/job-history-app.service';

@Component({
  templateUrl: './job-history-app-delete-dialog.component.html',
})
export class JobHistoryAppDeleteDialogComponent {
  jobHistory?: IJobHistoryApp;

  constructor(protected jobHistoryService: JobHistoryAppService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jobHistoryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
