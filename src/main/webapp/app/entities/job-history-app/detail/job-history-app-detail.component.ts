import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJobHistoryApp } from '../job-history-app.model';

@Component({
  selector: 'jhi-job-history-app-detail',
  templateUrl: './job-history-app-detail.component.html',
})
export class JobHistoryAppDetailComponent implements OnInit {
  jobHistory: IJobHistoryApp | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobHistory }) => {
      this.jobHistory = jobHistory;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
