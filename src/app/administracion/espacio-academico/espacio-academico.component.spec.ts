import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspacioAcademicoComponent } from './espacio-academico.component';

describe('EspacioAcademicoComponent', () => {
  let component: EspacioAcademicoComponent;
  let fixture: ComponentFixture<EspacioAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EspacioAcademicoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EspacioAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
