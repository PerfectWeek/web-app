import {TestBed, ComponentFixture} from "@angular/core/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastrModule, ToastrService} from "ngx-toastr";
import {RequestService} from "./core/services/request.service";
import {RouterTestingModule} from "@angular/router/testing";
import {MDBBootstrapModule, MDBRootModule} from "angular-bootstrap-md";
import {HttpModule} from "@angular/http";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "./core/services/auth.service";
import {TokenService} from "./core/services/token.service";
import {ProfileService} from "./core/services/profile.service";
import {GroupComponent} from "./pages/groups/group/group";
import {MatDialogModule} from "@angular/material";


describe('Group Component:', () => {

  let component: GroupComponent;
  let fixture: ComponentFixture<GroupComponent>;

    beforeEach(async() => {
      TestBed.configureTestingModule({
        imports: [ FormsModule, ReactiveFormsModule, ToastrModule.forRoot(),
          HttpClientTestingModule, HttpClientModule, HttpModule,
          RouterTestingModule, MatDialogModule,
          MDBBootstrapModule, MDBRootModule ],
        declarations: [ GroupComponent ],
        providers: [ RequestService, ToastrService, AuthService, TokenService, ProfileService ],
      }).compileComponents();

      fixture = TestBed.createComponent(GroupComponent);
      component = fixture.componentInstance;
    });


  it('Component defined', () => {
    expect(component).toBeDefined();
  });

});
