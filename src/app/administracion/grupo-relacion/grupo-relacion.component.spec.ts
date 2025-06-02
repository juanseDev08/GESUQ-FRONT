import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoRelacionComponent } from './grupo-relacion.component';

describe('GrupoRelacionComponent', () => {
  let component: GrupoRelacionComponent;
  let fixture: ComponentFixture<GrupoRelacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrupoRelacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrupoRelacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
