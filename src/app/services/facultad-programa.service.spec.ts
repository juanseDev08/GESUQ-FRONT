import { TestBed } from '@angular/core/testing';

import { FacultadProgramaService } from './facultad-programa.service';

describe('FacultadProgramaService', () => {
  let service: FacultadProgramaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacultadProgramaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
