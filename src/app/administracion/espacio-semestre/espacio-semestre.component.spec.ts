import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspacioSemestreComponent } from './espacio-semestre.component';

describe('EspacioSemestreComponent', () => {
  let component: EspacioSemestreComponent;
  let fixture: ComponentFixture<EspacioSemestreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EspacioSemestreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EspacioSemestreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
