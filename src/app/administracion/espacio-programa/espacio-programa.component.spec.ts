import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspacioProgramaComponent } from './espacio-programa.component';

describe('EspacioProgramaComponent', () => {
  let component: EspacioProgramaComponent;
  let fixture: ComponentFixture<EspacioProgramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EspacioProgramaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EspacioProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
