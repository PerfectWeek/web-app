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
import {FriendsComponent} from './pages/Friends/friends';


import {CalendarComponent} from './pages/calendar/calendar';
import {RegistrationConfirmationComponent} from "./pages/Registration_Confirmation/registration-confirmation";
import {MainViewComponent} from "./pages/Main_View/main_view";
import {PublicProfileComponent} from "./pages/User/profile/public/public";

const routes: Routes = [
  { path: '', redirectTo: '/registration', pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent, canActivate: [ IsLogout ] },
  { path: 'auth/validate-email/:id', component: RegistrationConfirmationComponent, canActivate: [IsLogout] },
  { path: 'login', component: ConnectionComponent, canActivate: [ IsLogout ] },
  { path: 'dashboard', component: MainViewComponent, canActivate: [isLogged ] },
  { path: 'group/:id', component: GroupComponent, canActivate: [isLogged] },
  { path: 'calendar/:id', component: CalendarComponent, canActivate: [ isLogged ] },
  { path: 'profile', component: ProfileComponent, canActivate: [isLogged] },
  { path: 'profile/:name', component: PublicProfileComponent, canActivate: [isLogged] },
  { path: 'groups', component: GroupManagementComponent, canActivate: [isLogged] },
  { path: 'friends', component: FriendsComponent, canActivate: [isLogged] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule {}
