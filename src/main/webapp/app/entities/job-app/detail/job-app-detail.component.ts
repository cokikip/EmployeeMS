import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJobApp } from '../job-app.model';

@Component({
  selector: 'jhi-job-app-detail',
  templateUrl: './job-app-detail.component.html',
})
export class JobAppDetailComponent implements OnInit {
  job: IJobApp | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ job }) => {
      this.job = job;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
