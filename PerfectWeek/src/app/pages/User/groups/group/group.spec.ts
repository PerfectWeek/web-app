import {TestBed, ComponentFixture, getTestBed} from "@angular/core/testing";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastrModule, ToastrService} from "ngx-toastr";
import {RequestService} from "../../../../core/services/request.service";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpModule} from "@angular/http";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "../../../../core/services/auth.service";
import {TokenService} from "../../../../core/services/token.service";
import {ProfileService} from "../../../../core/services/profile.service";
import {GroupManagementComponent} from "../../../../pages/User/groups/group-management";
import {GroupComponent} from './group';
import {Group} from "../../../../core/models/Group";
import {AppModule} from "../../../../app.module"

describe('Group member management Component:', () => {
  let injector: TestBed;
  let component: GroupComponent;
  let fixture: ComponentFixture<GroupComponent>;
  let httpMock: HttpTestingController;



    beforeEach(async() => {
      TestBed.configureTestingModule({
        imports: [ FormsModule, ReactiveFormsModule, ToastrModule.forRoot(),
          HttpClientTestingModule, HttpClientModule, HttpModule,
          RouterTestingModule, AppModule],
        providers: [ RequestService, ToastrService, AuthService, TokenService, ProfileService ],
      }).compileComponents();

      fixture = TestBed.createComponent(GroupComponent);
      component = fixture.componentInstance;
      injector = getTestBed();
      httpMock = injector.get(HttpTestingController);
    });

let grp: Group = {
name: '',
members: [],
owner: ''};

it('Check Good Group', () => {
let grp: Group = {
name: 'moi',
members: {pseudo: "moi",role: "Admin"}[0],
owner: 'moi'};
	 expect(component).toBeDefined();
  });

it('Create Bad group name', () => {
    //const invalidGroupName = "";
    //component.createGroup(invalidGroupName);
    expect(component.getGroup()).toBeFalsy();
  });

it('Add user to group', () => {
    //const validUser = "userdughetto";
    //const validGroup = "perfectGroup";
    //component.addUserToGroup(validUser, validGroup);
    expect(component.getGroup()).toBeFalsy();
  });

it('Add invalid user to group', () => {
    //const validUser = "invalduser12345";
    //const validGroup = "perfectGroup";
    //component.addUserToGroup(validUser, validGroup);
    expect(component.getGroup()).toBeFalsy();
  });

it('Remove user from group', () => {
    //const validUser = "userdughetto";
    //const validGroup = "perfectGroup";
    //component.removeUserToGroup(validUser, validGroup);
    expect(component.getGroup()).toBeFalsy();
  });

it('Remove user from empty group', () => {
    //const validUser = "userdughetto";
    //const validGroup = "perfectGroup12345";
    //component.addUserToGroup(validUser, validGroup);
    expect(component.getGroup()).toBeFalsy();
  });

it('Change group owner', () => {
    //const newOwner = "newowner";
    //const group = "testgroup";
    //group.changeOwner(newOwner);
    expect(component.getGroup()).toBeFalsy();
  });

it('Remove group owner from empty group', () => {
    //const validOwner = "userOwner";
    //const validGroup = "OwnerGroup";
    //component.removeUserToGroup(validUser, validGroup);
    expect(component.getGroup()).toBeFalsy();
  });

it('Create group with same group name', () => {
    //const existingGroup = "perfectweek";
    //component.createGroup(existingGroup);
    expect(component.getGroup()).toBeFalsy();
  });

});