//Angular Elements
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import {CommonModule, registerLocaleData} from "@angular/common";

//External Modules
import { ToastrModule } from 'ngx-toastr';
import {
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


//Dialog
import { ConfirmDialog } from "./module/dialog/Confirm-dialog/Confirm-dialog";
import {GroupCreationDialog} from "./module/dialog/Group-creation-dialog/group-creation";
import {CreateEventDialog} from "./module/dialog/CreateEvent-dialog/CreateEvent-dialog";
import {ModifyEventDialog} from "./module/dialog/ModifyEvent-dialog/ModifyEvent";
import {ChangeValueDialog} from "./module/dialog/Change -value/change-value";
import {AddMemberDialog} from "./module/dialog/Add-member/add-member";


//Guards
import { isLogged } from "./core/Guards/isLogged-guard";
import { IsLogout } from "./core/Guards/isLogout-guard";

import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

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
    ConfirmDialog,
    CreateEventDialog,
    GroupCreationDialog,
    ModifyEventDialog,
    ChangeValueDialog,
    AddMemberDialog,
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
    IsLogout
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmDialog,
    GroupCreationDialog,
    FormModalComponent,
    CreateEventDialog,
    ModifyEventDialog,
    ChangeValueDialog,
    AddMemberDialog,
  ]
})
export class AppModule { }
