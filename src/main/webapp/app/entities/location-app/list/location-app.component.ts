import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILocationApp } from '../location-app.model';
import { LocationAppService } from '../service/location-app.service';
import { LocationAppDeleteDialogComponent } from '../delete/location-app-delete-dialog.component';

@Component({
  selector: 'jhi-location-app',
  templateUrl: './location-app.component.html',
})
export class LocationAppComponent implements OnInit {
  locations?: ILocationApp[];
  isLoading = false;

  constructor(protected locationService: LocationAppService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.locationService.query().subscribe(
      (res: HttpResponse<ILocationApp[]>) => {
        this.isLoading = false;
        this.locations = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILocationApp): number {
    return item.id!;
  }

  delete(location: ILocationApp): void {
    const modalRef = this.modalService.open(LocationAppDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.location = location;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
