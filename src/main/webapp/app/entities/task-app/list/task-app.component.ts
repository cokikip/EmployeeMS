import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITaskApp } from '../task-app.model';
import { TaskAppService } from '../service/task-app.service';
import { TaskAppDeleteDialogComponent } from '../delete/task-app-delete-dialog.component';

@Component({
  selector: 'jhi-task-app',
  templateUrl: './task-app.component.html',
})
export class TaskAppComponent implements OnInit {
  tasks?: ITaskApp[];
  isLoading = false;

  constructor(protected taskService: TaskAppService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.taskService.query().subscribe(
      (res: HttpResponse<ITaskApp[]>) => {
        this.isLoading = false;
        this.tasks = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITaskApp): number {
    return item.id!;
  }

  delete(task: ITaskApp): void {
    const modalRef = this.modalService.open(TaskAppDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.task = task;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
