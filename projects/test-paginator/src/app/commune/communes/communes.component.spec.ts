import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunesComponent } from './communes.component';

describe('CommunesComponent', () => {
  let component: CommunesComponent;
  let fixture: ComponentFixture<CommunesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunesComponent]
    });
    fixture = TestBed.createComponent(CommunesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
