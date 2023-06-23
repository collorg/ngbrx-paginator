import { NgModule } from '@angular/core';
import { NgbrxPaginatorComponent } from './ngbrx-paginator.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    NgbrxPaginatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    StoreModule,
    NgbModule,
    NgbPaginationModule
  ],
  exports: [
    NgbrxPaginatorComponent
  ]
})
export class NgbrxPaginatorModule { }
