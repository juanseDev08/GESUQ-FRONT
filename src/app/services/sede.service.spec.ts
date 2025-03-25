import { TestBed } from '@angular/core/testing';

import { sedeService } from './sede.service';



describe('FacultadService', () => {
  let service: sedeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(sedeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
