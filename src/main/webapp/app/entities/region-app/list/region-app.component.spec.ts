import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RegionAppService } from '../service/region-app.service';

import { RegionAppComponent } from './region-app.component';

describe('Component Tests', () => {
  describe('RegionApp Management Component', () => {
    let comp: RegionAppComponent;
    let fixture: ComponentFixture<RegionAppComponent>;
    let service: RegionAppService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RegionAppComponent],
      })
        .overrideTemplate(RegionAppComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RegionAppComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(RegionAppService);

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
      expect(comp.regions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
