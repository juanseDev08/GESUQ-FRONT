import { TestBed } from '@angular/core/testing';

import { GrupoRelacionService } from './grupo-relacion.service';

describe('GrupoRelacionService', () => {
  let service: GrupoRelacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrupoRelacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
