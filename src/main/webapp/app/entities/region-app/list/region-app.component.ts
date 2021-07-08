import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRegionApp } from '../region-app.model';
import { RegionAppService } from '../service/region-app.service';
import { RegionAppDeleteDialogComponent } from '../delete/region-app-delete-dialog.component';

@Component({
  selector: 'jhi-region-app',
  templateUrl: './region-app.component.html',
})
export class RegionAppComponent implements OnInit {
  regions?: IRegionApp[];
  isLoading = false;

  constructor(protected regionService: RegionAppService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.regionService.query().subscribe(
      (res: HttpResponse<IRegionApp[]>) => {
        this.isLoading = false;
        this.regions = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRegionApp): number {
    return item.id!;
  }

  delete(region: IRegionApp): void {
    const modalRef = this.modalService.open(RegionAppDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.region = region;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
