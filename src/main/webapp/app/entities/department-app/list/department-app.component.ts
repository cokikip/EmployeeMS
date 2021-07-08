import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDepartmentApp } from '../department-app.model';
import { DepartmentAppService } from '../service/department-app.service';
import { DepartmentAppDeleteDialogComponent } from '../delete/department-app-delete-dialog.component';

@Component({
  selector: 'jhi-department-app',
  templateUrl: './department-app.component.html',
})
export class DepartmentAppComponent implements OnInit {
  departments?: IDepartmentApp[];
  isLoading = false;

  constructor(protected departmentService: DepartmentAppService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.departmentService.query().subscribe(
      (res: HttpResponse<IDepartmentApp[]>) => {
        this.isLoading = false;
        this.departments = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IDepartmentApp): number {
    return item.id!;
  }

  delete(department: IDepartmentApp): void {
    const modalRef = this.modalService.open(DepartmentAppDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.department = department;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
