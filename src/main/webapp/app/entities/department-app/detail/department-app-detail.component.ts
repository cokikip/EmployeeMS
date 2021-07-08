import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDepartmentApp } from '../department-app.model';

@Component({
  selector: 'jhi-department-app-detail',
  templateUrl: './department-app-detail.component.html',
})
export class DepartmentAppDetailComponent implements OnInit {
  department: IDepartmentApp | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ department }) => {
      this.department = department;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
