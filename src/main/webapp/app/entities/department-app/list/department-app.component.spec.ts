import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DepartmentAppService } from '../service/department-app.service';

import { DepartmentAppComponent } from './department-app.component';

describe('Component Tests', () => {
  describe('DepartmentApp Management Component', () => {
    let comp: DepartmentAppComponent;
    let fixture: ComponentFixture<DepartmentAppComponent>;
    let service: DepartmentAppService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DepartmentAppComponent],
      })
        .overrideTemplate(DepartmentAppComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DepartmentAppComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(DepartmentAppService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.departments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
