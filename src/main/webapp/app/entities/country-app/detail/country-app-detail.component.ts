import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICountryApp } from '../country-app.model';

@Component({
  selector: 'jhi-country-app-detail',
  templateUrl: './country-app-detail.component.html',
})
export class CountryAppDetailComponent implements OnInit {
  country: ICountryApp | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ country }) => {
      this.country = country;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
