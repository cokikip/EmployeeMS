import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRegionApp } from '../region-app.model';

@Component({
  selector: 'jhi-region-app-detail',
  templateUrl: './region-app-detail.component.html',
})
export class RegionAppDetailComponent implements OnInit {
  region: IRegionApp | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ region }) => {
      this.region = region;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
