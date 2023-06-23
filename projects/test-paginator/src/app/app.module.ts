import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DepartementModule } from 'projects/test-paginator/departement/departement.module';
import { CommuneModule } from 'projects/test-paginator/commune/commune.module';
import { StoreModule } from '@ngrx/store';
import * as fromAppState from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    DepartementModule,
    CommuneModule,
    StoreModule.forRoot(fromAppState.reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      features: {
        pause: false,
        lock: true,
        persist: true
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
