import { Component } from '@angular/core';
import { NgbrxPaginatorService } from 'ngbrx-paginator';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'test-paginator';
  paginatorKeys$: Observable<string[]> = this.paginationService.paginatorKeys$;

  constructor(
    private paginationService: NgbrxPaginatorService
  ) { }

}
