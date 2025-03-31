import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SedeFacultadComponent } from './sede-facultad.component';

describe('SedeFacultadComponent', () => {
  let component: SedeFacultadComponent;
  let fixture: ComponentFixture<SedeFacultadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SedeFacultadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SedeFacultadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
