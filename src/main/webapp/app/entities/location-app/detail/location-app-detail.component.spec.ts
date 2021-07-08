import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LocationAppDetailComponent } from './location-app-detail.component';

describe('Component Tests', () => {
  describe('LocationApp Management Detail Component', () => {
    let comp: LocationAppDetailComponent;
    let fixture: ComponentFixture<LocationAppDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LocationAppDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ location: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(LocationAppDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LocationAppDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load location on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.location).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
