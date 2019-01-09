import {TestBed, ComponentFixture, getTestBed} from "@angular/core/testing";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastrModule, ToastrService} from "ngx-toastr";
import {RequestService} from "../../core/services/request.service";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpModule} from "@angular/http";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "../../core/services/auth.service";
import {TokenService} from "../../core/services/token.service";
import {ProfileService} from "../../core/services/profile.service";
import {CalendarComponent} from "./calendar"
import {AppModule} from "../../app.module"

describe('Calendar Component:', () => {
  let injector: TestBed;
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let httpMock: HttpTestingController;

    beforeEach(async() => {
      TestBed.configureTestingModule({
        imports: [ FormsModule, ReactiveFormsModule, ToastrModule.forRoot(),
          HttpClientTestingModule, HttpClientModule, HttpModule,
          RouterTestingModule, AppModule],
        providers: [ RequestService, ToastrService, AuthService, TokenService, ProfileService ],
      }).compileComponents();

      fixture = TestBed.createComponent(CalendarComponent);
      component = fixture.componentInstance;
      injector = getTestBed();
      httpMock = injector.get(HttpTestingController);
    });

it('Delete an event', () => {
    //const group = "perfectweek";
    //const event = "grosse ress chez benard";
    //componet.deleteEventForGroup(group, event);
    expect(component.createEvent()).toBeFalsy();
  });

it('Create an event', () => {
    //const group = "perfectweek";
    //const event = "grosse ress chez benard";
    //componet.createEventFromGroup(group, event);
    expect(component.createEvent()).toBeFalsy();
  });

it('Create event bad date', () => {
    //const event = "grosse ress chez benard";
    //const date = "1998-25-06";
    //componet.setDateEvent(event, badDate);
    expect(component.createEvent()).toBeFalsy();
  });

it('change name event', () => {
    //const event = "grosse ress chez benard";
    //const newName = "grosse ress chez bentor";
    //component.changeNameEvent(event, newName);
    expect(component.createEvent()).toBeFalsy();
  });

it('change description event', () => {
    //const event = "grosse ress chez benard";
    //const newDesc = "on fait ça chez bentor";
    //component.changeDescEvent(event, newDesc);
    expect(component.createEvent()).toBeFalsy();
  });
  
});