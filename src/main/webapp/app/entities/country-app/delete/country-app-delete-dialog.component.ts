import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICountryApp } from '../country-app.model';
import { CountryAppService } from '../service/country-app.service';

@Component({
  templateUrl: './country-app-delete-dialog.component.html',
})
export class CountryAppDeleteDialogComponent {
  country?: ICountryApp;

  constructor(protected countryService: CountryAppService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.countryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
