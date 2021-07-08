import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CountryAppService } from '../service/country-app.service';

import { CountryAppComponent } from './country-app.component';

describe('Component Tests', () => {
  describe('CountryApp Management Component', () => {
    let comp: CountryAppComponent;
    let fixture: ComponentFixture<CountryAppComponent>;
    let service: CountryAppService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CountryAppComponent],
      })
        .overrideTemplate(CountryAppComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CountryAppComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CountryAppService);

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
      expect(comp.countries?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
