import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RegionAppDetailComponent } from './region-app-detail.component';

describe('Component Tests', () => {
  describe('RegionApp Management Detail Component', () => {
    let comp: RegionAppDetailComponent;
    let fixture: ComponentFixture<RegionAppDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RegionAppDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ region: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(RegionAppDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RegionAppDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load region on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.region).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
