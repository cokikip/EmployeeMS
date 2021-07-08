import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmployeeApp } from '../employee-app.model';

import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { EmployeeAppService } from '../service/employee-app.service';
import { EmployeeAppDeleteDialogComponent } from '../delete/employee-app-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-employee-app',
  templateUrl: './employee-app.component.html',
})
export class EmployeeAppComponent implements OnInit {
  employees: IEmployeeApp[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected employeeService: EmployeeAppService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.employees = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.isLoading = true;

    this.employeeService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IEmployeeApp[]>) => {
          this.isLoading = false;
          this.paginateEmployees(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.employees = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEmployeeApp): number {
    return item.id!;
  }

  delete(employee: IEmployeeApp): void {
    const modalRef = this.modalService.open(EmployeeAppDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.employee = employee;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateEmployees(data: IEmployeeApp[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.employees.push(d);
      }
    }
  }
}
