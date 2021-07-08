import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmployeeApp } from '../employee-app.model';
import { EmployeeAppService } from '../service/employee-app.service';

@Component({
  templateUrl: './employee-app-delete-dialog.component.html',
})
export class EmployeeAppDeleteDialogComponent {
  employee?: IEmployeeApp;

  constructor(protected employeeService: EmployeeAppService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.employeeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
