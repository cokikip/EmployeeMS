import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DepartmentAppDetailComponent } from './department-app-detail.component';

describe('Component Tests', () => {
  describe('DepartmentApp Management Detail Component', () => {
    let comp: DepartmentAppDetailComponent;
    let fixture: ComponentFixture<DepartmentAppDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DepartmentAppDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ department: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(DepartmentAppDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DepartmentAppDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load department on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.department).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
