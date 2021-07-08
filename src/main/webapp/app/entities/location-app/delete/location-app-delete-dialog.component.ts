import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILocationApp } from '../location-app.model';
import { LocationAppService } from '../service/location-app.service';

@Component({
  templateUrl: './location-app-delete-dialog.component.html',
})
export class LocationAppDeleteDialogComponent {
  location?: ILocationApp;

  constructor(protected locationService: LocationAppService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.locationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
