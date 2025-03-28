import { TestBed } from '@angular/core/testing';

import { EspacioAcademicoProgramaService } from './espacio-academico-programa.service';

describe('EspacioAcademicoProgramaService', () => {
  let service: EspacioAcademicoProgramaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspacioAcademicoProgramaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
