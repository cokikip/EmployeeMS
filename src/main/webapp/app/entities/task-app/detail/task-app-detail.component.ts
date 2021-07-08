import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITaskApp } from '../task-app.model';

@Component({
  selector: 'jhi-task-app-detail',
  templateUrl: './task-app-detail.component.html',
})
export class TaskAppDetailComponent implements OnInit {
  task: ITaskApp | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ task }) => {
      this.task = task;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
