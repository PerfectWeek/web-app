//Angular Elements
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

//External Modules
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { InputsModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md'
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
  MAT_LABEL_GLOBAL_OPTIONS,
  MAT_DATE_LOCALE, MatDialogRef, MatPaginatorIntl } from "@angular/material";


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
import { DashboardComponent } from "./pages/dashboard/dashboard";
import { ProfileComponent } from "./pages/profile/profile";
import { GroupManagementComponent } from "./pages/groups/group-management";
import { GroupComponent } from "./pages/groups/group/group";


//Dialog
import { ConfirmDialog } from "./module/dialog/Confirm-dialog/Confirm-dialog";


//Guards
import { isLogged } from "./core/Guards/isLogged-guard";
import { IsLogout } from "./core/Guards/isLogout-guard";


@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    ConnectionComponent,
    NotFoundComponent,
    DashboardComponent,
    ProfileComponent,
    GroupManagementComponent,
    ConfirmDialog,
    GroupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InputsModule,
    WavesModule,
    ButtonsModule,
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
    MatIconModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
    MDBBootstrapModule.forRoot()
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
    ConfirmDialog
  ]
})
export class AppModule { }
