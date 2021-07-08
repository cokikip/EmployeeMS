import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CountryAppDetailComponent } from './country-app-detail.component';

describe('Component Tests', () => {
  describe('CountryApp Management Detail Component', () => {
    let comp: CountryAppDetailComponent;
    let fixture: ComponentFixture<CountryAppDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CountryAppDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ country: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CountryAppDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CountryAppDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load country on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.country).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
