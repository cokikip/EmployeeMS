import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JobHistoryAppDetailComponent } from './job-history-app-detail.component';

describe('Component Tests', () => {
  describe('JobHistoryApp Management Detail Component', () => {
    let comp: JobHistoryAppDetailComponent;
    let fixture: ComponentFixture<JobHistoryAppDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [JobHistoryAppDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ jobHistory: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(JobHistoryAppDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(JobHistoryAppDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load jobHistory on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.jobHistory).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
