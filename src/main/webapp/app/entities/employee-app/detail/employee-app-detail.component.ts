import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmployeeApp } from '../employee-app.model';

@Component({
  selector: 'jhi-employee-app-detail',
  templateUrl: './employee-app-detail.component.html',
})
export class EmployeeAppDetailComponent implements OnInit {
  employee: IEmployeeApp | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employee }) => {
      this.employee = employee;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
