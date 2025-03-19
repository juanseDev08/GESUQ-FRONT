import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultadProgramaComponent } from './facultad-programa.component';

describe('FacultadProgramaComponent', () => {
  let component: FacultadProgramaComponent;
  let fixture: ComponentFixture<FacultadProgramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacultadProgramaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacultadProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
