import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IJobHistoryApp } from '../job-history-app.model';

import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { JobHistoryAppService } from '../service/job-history-app.service';
import { JobHistoryAppDeleteDialogComponent } from '../delete/job-history-app-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-job-history-app',
  templateUrl: './job-history-app.component.html',
})
export class JobHistoryAppComponent implements OnInit {
  jobHistories: IJobHistoryApp[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected jobHistoryService: JobHistoryAppService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.jobHistories = [];
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

    this.jobHistoryService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IJobHistoryApp[]>) => {
          this.isLoading = false;
          this.paginateJobHistories(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.jobHistories = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IJobHistoryApp): number {
    return item.id!;
  }

  delete(jobHistory: IJobHistoryApp): void {
    const modalRef = this.modalService.open(JobHistoryAppDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.jobHistory = jobHistory;
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

  protected paginateJobHistories(data: IJobHistoryApp[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.jobHistories.push(d);
      }
    }
  }
}
