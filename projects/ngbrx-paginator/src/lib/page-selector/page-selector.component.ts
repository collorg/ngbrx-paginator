import { Component, Input, OnInit } from '@angular/core';
import { NgbrxPaginatorService } from '../ngbrx-paginator.service';
import { EMPTY, Observable, distinctUntilChanged, tap } from 'rxjs';
import { Pagination } from '../ngbrx-paginator.model';

@Component({
  selector: 'ngbrx-paginator-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.css']
})
export class PageSelectorComponent implements OnInit {
  @Input({ required: true }) key: string = '';
  @Input() extension: string | undefined;

  collection$: Observable<any[]> = EMPTY;
  page: number = 1;
  fullKey = this.key;
  pagination$: Observable<Pagination> = EMPTY;
  FILTER_PAG_REGEX = /[^0-9]/g;
  pagesCount$: Observable<number> = EMPTY;

  constructor(
    private service: NgbrxPaginatorService
  ) {
  }

  ngOnInit(): void {
    this.fullKey = this.service.getKey(this.key, this.extension);
    this.pagination$ = this.service.pagination$(this.fullKey).pipe(
      distinctUntilChanged(),
      tap(pagination => this.page = pagination.page)
    );
    this.pagesCount$ = this.service.pagesCount$(this.fullKey);
    this.collection$ = this.service.filteredCollection$(this.fullKey);
  }

  setPage = () => this.service.setPage(this.fullKey, this.page)

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(this.FILTER_PAG_REGEX, '');
  }

}
