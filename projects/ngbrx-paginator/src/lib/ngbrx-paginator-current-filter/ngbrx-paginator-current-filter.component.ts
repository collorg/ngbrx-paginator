import { Component, Input, OnInit } from '@angular/core';
import { NgbrxPaginatorService } from '../ngbrx-paginator.service';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'ngbrx-paginator-current-filter-desc',
  templateUrl: './ngbrx-paginator-current-filter.component.html',
  styleUrls: ['./ngbrx-paginator-current-filter.component.css']
})
export class NgbrxPaginatorCurrentFilterComponent implements OnInit {
  @Input({required: true}) key: string = '';
  currentFilterDesc$: Observable<string> = EMPTY;

  constructor(
    private service: NgbrxPaginatorService
  ) { }

  ngOnInit(): void {
    this.currentFilterDesc$ = this.service.currentFiltersDesc$(this.key);
  }

}
