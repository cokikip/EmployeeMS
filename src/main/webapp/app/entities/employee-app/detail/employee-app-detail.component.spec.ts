import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmployeeAppDetailComponent } from './employee-app-detail.component';

describe('Component Tests', () => {
  describe('EmployeeApp Management Detail Component', () => {
    let comp: EmployeeAppDetailComponent;
    let fixture: ComponentFixture<EmployeeAppDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [EmployeeAppDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ employee: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(EmployeeAppDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EmployeeAppDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load employee on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.employee).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
