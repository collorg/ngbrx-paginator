import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunesComponent } from './communes/communes.component';

const routes: Routes = [

  { path: '', component: CommunesComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
