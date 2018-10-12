import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

import {RegistrationComponent} from "./pages/Registration/registration";
import {ConnectionComponent} from "./pages/Connection/connection";
import {NotFoundComponent} from "./pages/NotFound/not-found";
import {DashboardComponent} from "./pages/dashboard/dashboard";
import {ProfileComponent} from "./pages/profile/profile";
import {isLogged} from "./core/Guards/isLogged-guard";
import {IsLogout} from "./core/Guards/isLogout-guard";

const routes: Routes = [
  { path: '', redirectTo: '/registration', pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent, canActivate: [ IsLogout ] },
  { path: 'login', component: ConnectionComponent, canActivate: [ IsLogout ] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [isLogged ] },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule {}
