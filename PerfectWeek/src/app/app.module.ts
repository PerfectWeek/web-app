//Angular Elements
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

//External Modules
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { InputsModule, WavesModule } from 'angular-bootstrap-md'
import {ToastContainerModule, ToastrModule, ToastrService} from 'ngx-toastr';

//Internal modules
import { AppRoutingModule } from "./app-routing-module";

//Services
import { RequestService } from "./core/services/request.service";
import { TokenService } from "./core/services/token.service";
import { AuthService } from "./core/services/auth.service";

//Interceptors
import { InterceptorToken } from "./core/Interceptors/token-interceptor";
import { InterceptorLogin } from "./core/Interceptors/interceptor-login";
import { InterceptorUrl } from "./core/Interceptors/url-interceptor";

//User Components
import { AppComponent } from './app.component';
import { RegistrationComponent } from "./pages/Registration/registration";
import { ConnectionComponent } from "./pages/Connection/connection";
import { NotFoundComponent } from "./pages/NotFound/not-found";
import {DashboardComponent} from "./pages/dashboard/dashboard";
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing";
import {TestRequest} from "@angular/common/http/testing";


@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    ConnectionComponent,
    NotFoundComponent,
    DashboardComponent,
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
    HttpClientModule,
    //ToastrService,
    //TestRequest,
    ToastContainerModule,
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
