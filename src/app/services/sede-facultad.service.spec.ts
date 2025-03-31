import { TestBed } from '@angular/core/testing';

import { SedeFacultadService } from './sede-facultad.service';

describe('SedeFacultadService', () => {
  let service: SedeFacultadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SedeFacultadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
