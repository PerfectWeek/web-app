//Angular Elements
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import {CommonModule, registerLocaleData} from "@angular/common";

//SocialMediaLogin
import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider,
    FacebookLoginProvider,
} from "angular-6-social-login";

//External Modules
import { ToastrModule } from 'ngx-toastr';
import {
  MatRadioModule,
  MatSelectModule,
  MatDialogModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatCardModule,
  MatAutocompleteModule,
  MatFormFieldModule,
  MatOptionModule,
  MatChipsModule,
  MatButtonModule,
  MatListModule,
  MatIconModule,
  MatMenuModule,
  MAT_LABEL_GLOBAL_OPTIONS,
  MAT_DATE_LOCALE, MatDialogRef, MatPaginatorIntl } from "@angular/material";
import {CalendarModule, DateAdapter} from "angular-calendar";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {FlatpickrModule} from "angularx-flatpickr";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";

//Internal modules
import { AppRoutingModule } from "./app-routing-module";

//Services
import { RequestService } from "./core/services/request.service";
import { TokenService } from "./core/services/token.service";
import { AuthService } from "./core/services/auth.service";
import {ProfileService} from "./core/services/profile.service";

//Interceptors
import { InterceptorToken } from "./core/Interceptors/token-interceptor";
import { InterceptorLogin } from "./core/Interceptors/interceptor-login";
import { InterceptorUrl } from "./core/Interceptors/url-interceptor";

//User Components
import { AppComponent } from './app.component';
import { RegistrationComponent } from "./pages/Registration/registration";
import { ConnectionComponent } from "./pages/Connection/connection";
import { NotFoundComponent } from "./pages/NotFound/not-found";
import { DashboardComponent } from "./pages/User/dashboard/dashboard";
import { ProfileComponent } from "./pages/User/profile/profile";
import { GroupManagementComponent } from "./pages/User/groups/group-management";
import { GroupComponent } from "./pages/User/groups/group/group";
import {CalendarHeaderComponent} from "./pages/calendar/demo-utils/calendar-header.component";
import {FormModalComponent} from "./pages/calendar/demo-utils/ModalForm/form-modal.component";
import {RegistrationConfirmationComponent} from "./pages/Registration_Confirmation/registration-confirmation";
import {CalendarComponent} from "./pages/calendar/calendar";
import {MainViewComponent} from "./pages/Main_View/main_view";
import { GroupListComponent } from "./pages/Main_View/group_list/group_list";
import {GroupInfoComponent} from "./pages/Main_View/group_info/group_info";
import { Navbar } from "./module/Navbar/navbar";
import { FriendsComponent } from './pages/Friends/friends';
import {FriendRequestComponent} from "./pages/Friends/Friend-requests/friend-request";
import {FriendListComponent} from "./pages/Friends/Friend-list/friend-list";
import {PublicProfileComponent} from "./pages/User/profile/public/public";

//Dialog
import { ConfirmDialog } from "./module/dialog/Confirm-dialog/Confirm-dialog";
import {GroupCreationDialog} from "./module/dialog/Group-creation-dialog/group-creation";
import {CreateEventDialog} from "./module/dialog/CreateEvent-dialog/CreateEvent-dialog";
import {ModifyEventDialog} from "./module/dialog/ModifyEvent-dialog/ModifyEvent";
import {ChangeValueDialog} from "./module/dialog/Change -value/change-value";
import {AddMemberDialog} from "./module/dialog/Add-member/add-member";
import {FoundSlotDialog} from './module/dialog/FoundSlot-dialog/FoundSlot-dialog';
import {FoundSlotConfirmDialog} from './module/dialog/FoundSlotConfirm-dialog/FoundSlotConfirm-dialog';
import {FriendInvitationDialog} from "./module/dialog/Friend-Invitation/invitation";

//import {MatRadioModule} from '@angular/material/radio';


//Guards
import { isLogged } from "./core/Guards/isLogged-guard";
import { IsLogout } from "./core/Guards/isLogout-guard";

import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

// export function getAuthServiceConfigs() {
//   let config = new AuthServiceConfig(
//       [
//         {
//           id: FacebookLoginProvider.PROVIDER_ID,
//           provider: new FacebookLoginProvider("Your-Facebook-app-id")
//         },
// 	{
//           id: GoogleLoginProvider.PROVIDER_ID,
//           provider: new GoogleLoginProvider("Your-Google-Client-Id")
//         },
//       ]
//   );
//   return config;
// }

@NgModule({
  declarations: [
    AppComponent,
    Navbar,
    RegistrationComponent,
    ConnectionComponent,
    NotFoundComponent,
    DashboardComponent,
    ProfileComponent,
    GroupManagementComponent,
    CalendarComponent,
    GroupComponent,
    CalendarHeaderComponent,
    FormModalComponent,
    RegistrationConfirmationComponent,
    MainViewComponent,
    GroupListComponent,
    GroupInfoComponent,
    PublicProfileComponent,
    FriendsComponent,
    FriendRequestComponent,
    FriendListComponent,
    ConfirmDialog,
    CreateEventDialog,
    GroupCreationDialog,
    ModifyEventDialog,
    FoundSlotDialog,
    FoundSlotConfirmDialog,
    GroupComponent,
    CalendarHeaderComponent,
    FormModalComponent,
    RegistrationConfirmationComponent,
    ChangeValueDialog,
    AddMemberDialog,
    FriendInvitationDialog,
  ],
  imports: [
    CommonModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    BrowserModule,
    MatRadioModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    MatDialogModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatCardModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatOptionModule,
    MatChipsModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
    SocialLoginModule,
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [
    RequestService,
    TokenService,
    AuthService,
    ProfileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorUrl,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorToken,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorLogin,
      multi: true
    },
    isLogged,
    IsLogout,
    // {
    //   provide: AuthServiceConfig,
    //   useFactory: getAuthServiceConfigs
    // }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmDialog,
    GroupCreationDialog,
    FormModalComponent,
    CreateEventDialog,
    ModifyEventDialog,
    FoundSlotDialog,
    FoundSlotConfirmDialog,
    ChangeValueDialog,
    AddMemberDialog,
    FriendInvitationDialog,
  ]
})
export class AppModule { }