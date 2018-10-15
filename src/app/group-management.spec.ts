import {TestBed, ComponentFixture} from "@angular/core/testing";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
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
import {MatDialogModule} from "@angular/material";
import {GroupManagementComponent} from "./pages/groups/group-management";
import {MatFormFieldModule, MatChipsModule, MatIconModule} from '@angular/material';


describe('Group Management Component:', () => {

  let component: GroupManagementComponent;
  let fixture: ComponentFixture<GroupManagementComponent>;

    beforeEach(async() => {
      TestBed.configureTestingModule({
        imports: [ FormsModule, ReactiveFormsModule, ToastrModule.forRoot(),
          HttpClientTestingModule, HttpClientModule, HttpModule,
          RouterTestingModule, MatDialogModule,
          MatFormFieldModule, MatChipsModule, MatIconModule,
          MDBBootstrapModule ],
        declarations: [ GroupManagementComponent ],
        providers: [ RequestService, ToastrService, AuthService, TokenService, ProfileService ],
      }).compileComponents();

      fixture = TestBed.createComponent(GroupManagementComponent);
      component = fixture.componentInstance;
    });


it('Component defined', () => {
    expect(component).toBeDefined();
  });

  /*it('Create group', () => {
    component.name = "test";
    expect(component.createGroup()).toBeTruthy();
  });*/

});
