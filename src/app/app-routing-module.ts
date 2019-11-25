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
import {FriendsComponent} from './pages/Friends/friends';


import {CalendarComponent} from './pages/calendar/calendar';
import {RegistrationConfirmationComponent} from "./pages/Registration_Confirmation/registration-confirmation";
import {EventSuggestionsComponent} from './pages/EventSuggestions/event_suggestions';
import {MainViewComponent} from "./pages/Main_View/main_view";
import {PublicProfileComponent} from "./pages/User/profile/public/public";
import {EventComponent} from './pages/Event/event';
import {GoogleCallbackComponent} from "./pages/Connection/google-callback/google-callback";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent, canActivate: [ IsLogout ] },
  { path: 'auth/validate-email/:id', component: RegistrationConfirmationComponent, canActivate: [IsLogout] },
  { path: 'login', component: ConnectionComponent, canActivate: [ IsLogout ] },
  { path: 'dashboard', component: MainViewComponent, canActivate: [isLogged ] },
  { path: 'event-suggestions', component: EventSuggestionsComponent, canActivate: [isLogged ]},
  { path: 'calendar/:id', component: CalendarComponent, canActivate: [ isLogged ] },
  { path: 'profile', component: ProfileComponent, canActivate: [isLogged] },
  { path: 'profile/:id', component: PublicProfileComponent, canActivate: [isLogged] },
  { path: 'friends', component: FriendsComponent, canActivate: [isLogged] },
  { path: 'login/google-callback', component: GoogleCallbackComponent, canActivate: [IsLogout]},
  { path: 'event/:id', component: EventComponent, canActivate: [isLogged ] },

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
