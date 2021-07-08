import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TaskAppDetailComponent } from './task-app-detail.component';

describe('Component Tests', () => {
  describe('TaskApp Management Detail Component', () => {
    let comp: TaskAppDetailComponent;
    let fixture: ComponentFixture<TaskAppDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TaskAppDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ task: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(TaskAppDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TaskAppDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load task on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.task).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
