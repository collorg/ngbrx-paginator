import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbrxPaginatorComponent } from './ngbrx-paginator.component';

describe('NgbrxPaginatorComponent', () => {
  let component: NgbrxPaginatorComponent;
  let fixture: ComponentFixture<NgbrxPaginatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgbrxPaginatorComponent]
    });
    fixture = TestBed.createComponent(NgbrxPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
