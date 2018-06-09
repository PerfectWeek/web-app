import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

import {RegistrationComponent} from "./pages/Registration/registration";
import {ConnectionComponent} from "./pages/Connection/connection";

const routes: Routes = [
  { path: '', redirectTo: '/registration', pathMatch: 'full' },
  { path:'registration', component: RegistrationComponent },
  { path:'login', component: ConnectionComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule {}
