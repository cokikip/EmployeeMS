import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILocationApp } from '../location-app.model';

@Component({
  selector: 'jhi-location-app-detail',
  templateUrl: './location-app-detail.component.html',
})
export class LocationAppDetailComponent implements OnInit {
  location: ILocationApp | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ location }) => {
      this.location = location;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
