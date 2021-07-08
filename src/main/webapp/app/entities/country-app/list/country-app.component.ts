import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICountryApp } from '../country-app.model';
import { CountryAppService } from '../service/country-app.service';
import { CountryAppDeleteDialogComponent } from '../delete/country-app-delete-dialog.component';

@Component({
  selector: 'jhi-country-app',
  templateUrl: './country-app.component.html',
})
export class CountryAppComponent implements OnInit {
  countries?: ICountryApp[];
  isLoading = false;

  constructor(protected countryService: CountryAppService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.countryService.query().subscribe(
      (res: HttpResponse<ICountryApp[]>) => {
        this.isLoading = false;
        this.countries = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICountryApp): number {
    return item.id!;
  }

  delete(country: ICountryApp): void {
    const modalRef = this.modalService.open(CountryAppDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.country = country;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
