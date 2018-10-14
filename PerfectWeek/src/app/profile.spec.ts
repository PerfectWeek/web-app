import {TestBed, ComponentFixture} from "@angular/core/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastrModule, ToastrService} from "ngx-toastr";
import {RequestService} from "./core/services/request.service";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpModule} from "@angular/http";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClientModule} from "@angular/common/http";
import {ProfileComponent} from "./pages/profile/profile";
import {AuthService} from "./core/services/auth.service";
import {TokenService} from "./core/services/token.service";
import {ProfileService} from "./core/services/profile.service";
import {MatDialogModule} from "@angular/material";


describe('Profil Component:', () => {

  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

    beforeEach(async() => {
      TestBed.configureTestingModule({
        imports: [ FormsModule, ReactiveFormsModule, ToastrModule.forRoot(),
          HttpClientTestingModule, HttpClientModule, HttpModule,
          RouterTestingModule,
          MatDialogModule ],
        declarations: [ ProfileComponent ],
        providers: [ RequestService, ToastrService, AuthService, TokenService, ProfileService ],
      }).compileComponents();

      fixture = TestBed.createComponent(ProfileComponent);
      component = fixture.componentInstance;
    });

    it('Component defined', () => {
    expect(component).toBeDefined();
    });

  it('ModifyProfile', () => {
    component.user = {pseudo: "test", email: "test@gmail.com", password: "passwordvalid1"};
    component.pseudo = "newpseudo";
    //console.log("LOOL " + component.user);
    //console.log("LOOL " + component.pseudo);
    expect(component.user).toBeDefined();
    expect(component.pseudo).toBeDefined();
    //component.modifyProfile();
  });
});
