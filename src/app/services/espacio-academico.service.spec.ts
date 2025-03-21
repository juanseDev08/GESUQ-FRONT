import { TestBed } from '@angular/core/testing';

import { EspacioAcademicoService } from './espacio-academico.service';

describe('EspacioAcademicoService', () => {
  let service: EspacioAcademicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspacioAcademicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
