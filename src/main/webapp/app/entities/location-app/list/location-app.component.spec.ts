import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LocationAppService } from '../service/location-app.service';

import { LocationAppComponent } from './location-app.component';

describe('Component Tests', () => {
  describe('LocationApp Management Component', () => {
    let comp: LocationAppComponent;
    let fixture: ComponentFixture<LocationAppComponent>;
    let service: LocationAppService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LocationAppComponent],
      })
        .overrideTemplate(LocationAppComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LocationAppComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LocationAppService);

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
      expect(comp.locations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
