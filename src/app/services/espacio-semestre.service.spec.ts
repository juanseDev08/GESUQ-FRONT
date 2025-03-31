import { TestBed } from '@angular/core/testing';

import { EspacioSemestreService } from './espacio-semestre.service';

describe('EspacioSemestreService', () => {
  let service: EspacioSemestreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspacioSemestreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
