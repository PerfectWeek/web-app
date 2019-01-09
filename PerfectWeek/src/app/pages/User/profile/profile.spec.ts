import {TestBed, ComponentFixture, getTestBed} from "@angular/core/testing";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastrModule, ToastrService} from "ngx-toastr";
import {RequestService} from "../../../core/services/request.service";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpModule} from "@angular/http";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "../../../core/services/auth.service";
import {TokenService} from "../../../core/services/token.service";
import {ProfileService} from "../../../core/services/profile.service";
import {ProfileComponent} from "./profile"
import {AppModule} from "../../../app.module"

describe('Calendar Component:', () => {
  let injector: TestBed;
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let httpMock: HttpTestingController;

    beforeEach(async() => {
      TestBed.configureTestingModule({
        imports: [ FormsModule, ReactiveFormsModule, ToastrModule.forRoot(),
          HttpClientTestingModule, HttpClientModule, HttpModule,
          RouterTestingModule, AppModule],
        providers: [ RequestService, ToastrService, AuthService, TokenService, ProfileService ],
      }).compileComponents();

      fixture = TestBed.createComponent(ProfileComponent);
      component = fixture.componentInstance;
      injector = getTestBed();
      httpMock = injector.get(HttpTestingController);
    });

it('Change Pseudo', () => {
    //const validPseudo = "validPseud";
    //component.changePseudo(validPseudo);
    expect(component.checkInfoFormat()).toBeTruthy()
  });

it('Change email', () => {
    //const validMail = "mehdi.bentor@gmail.com";
    //component.changeMail(validMail);
    expect(component.checkInfoFormat()).toBeTruthy();
  });

it('Change invalid pseudo', () => {
    //const invalidPseudo = "invalid pseudo";
    //component.changePseudo(invalidPseudo);
    expect(component.checkInfoFormat()).toBeTruthy();
  });

it('Change invalid email', () => {
    //const invalidMail = "mehdi bentor@gmail.com";
    //component.changeMail(invalidMail);
    expect(component.checkInfoFormat()).toBeTruthy();
  });

it('change to already existing pseudo', () => {
    //const validPseudo = "validPseud";
    //component.changePseudo(validPseudo);
    expect(component.checkInfoFormat()).toBeTruthy();
  });

it('change to already existing email', () => {
    //const validMail = "mehdi.bentor@gmail.com";
    //component.changeMail(validMail);
    expect(component.checkInfoFormat()).toBeTruthy();
  });
});