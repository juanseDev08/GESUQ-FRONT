import { TestBed } from '@angular/core/testing';

import { EspacioProgramaService } from './espacio-programa.service';

describe('EspacioProgramaService', () => {
  let service: EspacioProgramaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspacioProgramaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
