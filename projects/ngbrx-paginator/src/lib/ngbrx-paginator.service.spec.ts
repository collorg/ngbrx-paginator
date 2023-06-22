import { TestBed } from '@angular/core/testing';

import { NgbrxPaginatorService } from './ngbrx-paginator.service';

describe('NgbrxPaginatorService', () => {
  let service: NgbrxPaginatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgbrxPaginatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
