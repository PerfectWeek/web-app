import {TestBed, ComponentFixture} from "@angular/core/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RegistrationComponent} from "./pages/Registration/registration";
import {ToastrModule, ToastrService} from "ngx-toastr";
import {RequestService} from "./core/services/request.service";
import {Router, RouterModule} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing";
import {MDBBootstrapModule, MdbInputDirective, MDBRootModule} from "angular-bootstrap-md";
import {HttpModule, Request} from "@angular/http";
import {HttpClientTestingModule, TestRequest} from "@angular/common/http/testing";
import {HttpHeaders, HttpParams, HttpClient, HttpClientModule} from "@angular/common/http";
import {Injectable} from "@angular/core";


describe('RegistrationComponent:', () => {

  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

    beforeEach(async() => {
      TestBed.configureTestingModule({
        imports: [ FormsModule, ReactiveFormsModule, ToastrModule.forRoot(),
          HttpClientTestingModule, HttpClientModule, HttpModule,
          RouterTestingModule,//, HttpClient, HttpHeaders, HttpParams,
          MDBBootstrapModule, MDBRootModule ],
                      //,RouterTestingModule,
                     //ToastrService, ToastrModule, RequestService, RouterModule ],
        declarations: [ RegistrationComponent ],
        //providers: [ ToastrService ],
        providers: [ RequestService, ToastrService ],
      }).compileComponents();

      fixture = TestBed.createComponent(RegistrationComponent);
      component = fixture.componentInstance;
      expect(component).toBeDefined();
    });

    const valid_pseudo = "ValidPseudo";
    const valid_email = "validemail@hotmail.fr";
    const valid_password = "validpassword1";

  it('Component defined', () => {
    expect(component).toBeDefined();
  });

  it('is form valid when empty', () => {
    expect(component.registrationForm.valid).toBeFalsy();
  });

  it('test individual form email invalid', () => {
    let a = component.registrationForm.controls["email"];
    a.setValue("lol");
    expect(component.registrationForm.controls["email"].invalid).toBeTruthy();
  });

  it('valid input', () => {
    let itemPseudo = component.registrationForm.controls["pseudo"];
    itemPseudo.setValue(valid_pseudo);
    let itemEmail = component.registrationForm.controls["email"];
    itemEmail.setValue(valid_email);
    let itemPassword = component.registrationForm.controls["password"];
    itemPassword.setValue(valid_password);
    let itemConfirm = component.registrationForm.controls["confirmPassword"];
    itemConfirm.setValue(valid_password);
    expect(component.registrationForm.valid).toBeTruthy();
  });

  it('invalid email', () => {
    let itemPseudo = component.registrationForm.controls["pseudo"];
    itemPseudo.setValue(valid_pseudo);
    let itemEmail = component.registrationForm.controls["email"];
    itemEmail.setValue("ThisIsNotAnEmail");
    let itemPassword = component.registrationForm.controls["password"];
    itemPassword.setValue(valid_password);
    let itemConfirm = component.registrationForm.controls["confirmPassword"];
    itemConfirm.setValue(valid_password);
    expect(component.registrationForm.invalid).toBeTruthy();
  });

  it('invalid password: because there is no number', () => {
    let itemPseudo = component.registrationForm.controls["pseudo"];
    itemPseudo.setValue(valid_pseudo);
    let itemEmail = component.registrationForm.controls["email"];
    itemEmail.setValue(valid_email);
    let itemPassword = component.registrationForm.controls["password"];
    itemPassword.setValue("notvalidpassword");
    let itemConfirm = component.registrationForm.controls["confirmPassword"];
    itemConfirm.setValue("notvalidpassword");
    expect(component.registrationForm.invalid).toBeTruthy();
  });

  it('invalid password: because size is < 8', () => {
    let itemPseudo = component.registrationForm.controls["pseudo"];
    itemPseudo.setValue(valid_pseudo);
    let itemEmail = component.registrationForm.controls["email"];
    itemEmail.setValue(valid_email);
    let itemPassword = component.registrationForm.controls["password"];
    itemPassword.setValue("abc123");
    let itemConfirm = component.registrationForm.controls["confirmPassword"];
    itemConfirm.setValue("abc123");
    expect(component.registrationForm.invalid).toBeTruthy();
  });

  it('confirm != password', () => {
    let itemPseudo = component.registrationForm.controls["pseudo"];
    itemPseudo.setValue(valid_pseudo);
    let itemEmail = component.registrationForm.controls["email"];
    itemEmail.setValue(valid_email);
    let itemPassword = component.registrationForm.controls["password"];
    itemPassword.setValue(valid_password);
    let itemConfirm = component.registrationForm.controls["confirmPassword"];
    itemConfirm.setValue("othervalidpassword1");
    expect(component.registrationForm.invalid).toBeTruthy();
  });


  /*it('check submit function', () => {
    let itemPseudo = component.registrationForm.controls["pseudo"];
    itemPseudo.setValue(valid_pseudo);
    let itemEmail = component.registrationForm.controls["email"];
    itemEmail.setValue(valid_email);
    let itemPassword = component.registrationForm.controls["password"];
    itemPassword.setValue(valid_password);
    let itemConfirm = component.registrationForm.controls["confirmPassword"];
    itemConfirm.setValue(valid_password);
    expect(component.submit()).toBeTruthy();
  });*/
});
