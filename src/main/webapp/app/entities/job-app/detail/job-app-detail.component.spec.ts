import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JobAppDetailComponent } from './job-app-detail.component';

describe('Component Tests', () => {
  describe('JobApp Management Detail Component', () => {
    let comp: JobAppDetailComponent;
    let fixture: ComponentFixture<JobAppDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [JobAppDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ job: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(JobAppDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(JobAppDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load job on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.job).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
