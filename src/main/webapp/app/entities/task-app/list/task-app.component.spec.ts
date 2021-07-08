import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TaskAppService } from '../service/task-app.service';

import { TaskAppComponent } from './task-app.component';

describe('Component Tests', () => {
  describe('TaskApp Management Component', () => {
    let comp: TaskAppComponent;
    let fixture: ComponentFixture<TaskAppComponent>;
    let service: TaskAppService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TaskAppComponent],
      })
        .overrideTemplate(TaskAppComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TaskAppComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TaskAppService);

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
      expect(comp.tasks?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
