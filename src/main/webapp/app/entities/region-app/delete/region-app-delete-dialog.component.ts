import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRegionApp } from '../region-app.model';
import { RegionAppService } from '../service/region-app.service';

@Component({
  templateUrl: './region-app-delete-dialog.component.html',
})
export class RegionAppDeleteDialogComponent {
  region?: IRegionApp;

  constructor(protected regionService: RegionAppService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.regionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
