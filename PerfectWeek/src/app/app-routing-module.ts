import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {RegistrationComponent} from './pages/Registration/registration';
import {ConnectionComponent} from './pages/Connection/connection';
import {NotFoundComponent} from './pages/NotFound/not-found';
import {DashboardComponent} from './pages/User/dashboard/dashboard';
import {ProfileComponent} from './pages/User/profile/profile';
import {isLogged} from './core/Guards/isLogged-guard';
import {IsLogout} from './core/Guards/isLogout-guard';
import {GroupComponent} from './pages/User/groups/group/group';
import {GroupManagementComponent} from './pages/User/groups/group-management';

import {CalendarComponent} from './pages/calendar/calendar';

const routes: Routes = [
  { path: '', redirectTo: '/registration', pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent, canActivate: [ IsLogout ] },
  { path: 'login', component: ConnectionComponent, canActivate: [ IsLogout ] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [isLogged ] },
  { path: 'group/:id', component: GroupComponent, canActivate: [isLogged] },
  { path: 'calendar/:id', component: CalendarComponent, canActivate: [ isLogged ] },
  { path: 'profile', component: ProfileComponent, canActivate: [isLogged] },
  { path: 'groups', component: GroupManagementComponent, canActivate: [isLogged] },
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
