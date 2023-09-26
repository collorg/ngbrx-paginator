import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngbrx-paginator-search-icon',
  templateUrl: './search-icon.component.html',
  styleUrls: ['./search-icon.component.css']
})
export class SearchIconComponent {
  @Input({required: true}) showFilters: boolean | null = null;
}
