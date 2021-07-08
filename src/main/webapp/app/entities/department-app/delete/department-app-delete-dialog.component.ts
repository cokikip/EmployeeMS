import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDepartmentApp } from '../department-app.model';
import { DepartmentAppService } from '../service/department-app.service';

@Component({
  templateUrl: './department-app-delete-dialog.component.html',
})
export class DepartmentAppDeleteDialogComponent {
  department?: IDepartmentApp;

  constructor(protected departmentService: DepartmentAppService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.departmentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
