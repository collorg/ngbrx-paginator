import { Component, Input, OnInit } from '@angular/core';
import { NgbrxPaginatorService } from '../ngbrx-paginator.service';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'ngbrx-paginator-filter-desc',
  templateUrl: './ngbrx-paginator-filter-desc.component.html',
  styleUrls: ['./ngbrx-paginator-filter-desc.component.css']
})
export class NgbrxPaginatorFilterDesc implements OnInit {
  @Input({required: true}) key: string = '';
  currentFilterDesc$: Observable<string> = EMPTY;
  numberOfFilteredItems$: Observable<number> = EMPTY;

  constructor(
    private service: NgbrxPaginatorService
  ) { }

  ngOnInit(): void {
    this.currentFilterDesc$ = this.service.currentFiltersDesc$(this.key);
    this.numberOfFilteredItems$ = this.service.numberOfFilteredItems$(this.key);
  }

}
