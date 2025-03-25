import { TestBed } from '@angular/core/testing';

import { ReservaEspacioService } from './reserva-espacio.service';

describe('ReservaEspacioService', () => {
  let service: ReservaEspacioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservaEspacioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
