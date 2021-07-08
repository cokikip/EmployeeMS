import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITaskApp, TaskApp } from '../task-app.model';
import { TaskAppService } from '../service/task-app.service';

@Component({
  selector: 'jhi-task-app-update',
  templateUrl: './task-app-update.component.html',
})
export class TaskAppUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    title: [],
    description: [],
  });

  constructor(protected taskService: TaskAppService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ task }) => {
      this.updateForm(task);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const task = this.createFromForm();
    if (task.id !== undefined) {
      this.subscribeToSaveResponse(this.taskService.update(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.create(task));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITaskApp>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(task: ITaskApp): void {
    this.editForm.patchValue({
      id: task.id,
      title: task.title,
      description: task.description,
    });
  }

  protected createFromForm(): ITaskApp {
    return {
      ...new TaskApp(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
