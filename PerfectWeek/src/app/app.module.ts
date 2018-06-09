//Angular Elements
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


//External Modules
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { InputsModule, WavesModule } from 'angular-bootstrap-md'

//Internal modules
import { AppRoutingModule } from "./app-routing-module";


//User Components
import { AppComponent } from './app.component';
import { RegistrationComponent } from "./pages/Registration/registration";
import { ConnectionComponent } from "./pages/Connection/connection";
import {NotFoundComponent} from "./pages/NotFound/not-found";


@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    ConnectionComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InputsModule,
    WavesModule,
    MDBBootstrapModule.forRoot()
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
