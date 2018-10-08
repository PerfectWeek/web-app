import {TestBed, ComponentFixture} from "@angular/core/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastrModule, ToastrService} from "ngx-toastr";
import {RequestService} from "./core/services/request.service";
import {RouterTestingModule} from "@angular/router/testing";
import {MDBBootstrapModule, MDBRootModule} from "angular-bootstrap-md";
import {HttpModule} from "@angular/http";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClientModule} from "@angular/common/http";
import {ConnectionComponent} from "./pages/Connection/connection";
import {AuthService} from "./core/services/auth.service";
import {TokenService} from "./core/services/token.service";


describe('Connection Component:', () => {

  let component: ConnectionComponent;
  let fixture: ComponentFixture<ConnectionComponent>;

    beforeEach(async() => {
      TestBed.configureTestingModule({
        imports: [ FormsModule, ReactiveFormsModule, ToastrModule.forRoot(),
          HttpClientTestingModule, HttpClientModule, HttpModule,
          RouterTestingModule,
          MDBBootstrapModule, MDBRootModule ],
        declarations: [ ConnectionComponent ],
        providers: [ RequestService, ToastrService, AuthService, TokenService ],
      }).compileComponents();

      fixture = TestBed.createComponent(ConnectionComponent);
      component = fixture.componentInstance;
      expect(component).toBeDefined();
    });

    const valid_email = "validemail@hotmail.fr";
    const valid_password = "validpassword1";

  it('Component defined', () => {
    expect(component).toBeDefined();
  });

  it('is form valid when empty', () => {
    expect(component.connectionForm.valid).toBeFalsy();
  });

  it('test of test', () => {
    let a = component.connectionForm.controls["email"];
    a.setValue("lol");
    expect(component.connectionForm.controls["email"].invalid).toBeTruthy();
  });

  it('valid input', () => {
    let itemEmail = component.connectionForm.controls["email"];
    itemEmail.setValue(valid_email);
    let itemPassword = component.connectionForm.controls["password"];
    itemPassword.setValue(valid_password);
    expect(component.connectionForm.valid).toBeTruthy();
  });

  /*it('invalid email', () => {
    let itemEmail = component.connectionForm.controls["email"];
    itemEmail.setValue("ThisIsNotAnEmail");
    let itemPassword = component.connectionForm.controls["password"];
    itemPassword.setValue(valid_password);
    expect(component.connectionForm.invalid).toBeTruthy();
  });*/

  /*it('confirm != password', () => {
    let itemPseudo = component.connectionForm.controls["pseudo"];
    itemPseudo.setValue(valid_pseudo);
    let itemEmail = component.connectionForm.controls["email"];
    itemEmail.setValue(valid_email);
    let itemPassword = component.connectionForm.controls["password"];
    itemPassword.setValue(valid_password);
    let itemConfirm = component.connectionForm.controls["confirm"];
    itemConfirm.setValue("othervalidpassword1");
    expect(component.connectionForm.invalid).toBeTruthy();
  });*/


  it('check submit function', () => {
    let itemEmail = component.connectionForm.controls["email"];
    itemEmail.setValue(valid_email);
    let itemPassword = component.connectionForm.controls["password"];
    itemPassword.setValue(valid_password);
    expect(component.submit()).toBeUndefined();
  });
});
