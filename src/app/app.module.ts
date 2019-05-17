//Angular Elements
import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CommonModule, registerLocaleData} from '@angular/common';

//Google Api Modules
import {
    GoogleApiModule,
    GoogleApiService,
    GoogleAuthService,
    NgGapiClientConfig,
    NG_GAPI_CONFIG,
    GoogleApiConfig
} from "ng-gapi";
import {UserService} from './pages/Registration/UserService';
import {SheetResource} from './pages/Registration/SheetResource';

//External Modules
import {ToastrModule} from 'ngx-toastr';
import {
    MatRadioModule,
    MatSelectModule,
    MatDialogModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatCardModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatOptionModule,
    MatChipsModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MAT_LABEL_GLOBAL_OPTIONS,
    MAT_DATE_LOCALE, MatDialogRef, MatPaginatorIntl
} from '@angular/material';

// import {CalendarModule, DateAdapter} from "angular-calendar";


import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {FlatpickrModule} from 'angularx-flatpickr';
// import {adapterFactory} from "angular-calendar/date-adapters/date-fns";

//Internal modules
import {AppRoutingModule} from './app-routing-module';

//Services
import {RequestService} from './core/services/request.service';
import {TokenService} from './core/services/token.service';
import {AuthService} from './core/services/auth.service';
import {ProfileService} from './core/services/profile.service';

//Interceptors
import {InterceptorToken} from './core/Interceptors/token-interceptor';
import {InterceptorLogin} from './core/Interceptors/interceptor-login';
import {InterceptorUrl} from './core/Interceptors/url-interceptor';

//User Components
import {AppComponent} from './app.component';
import {RegistrationComponent} from './pages/Registration/registration';
import {ConnectionComponent} from './pages/Connection/connection';
import {NotFoundComponent} from './pages/NotFound/not-found';
import {DashboardComponent} from './pages/User/dashboard/dashboard';
import {ProfileComponent} from './pages/User/profile/profile';
// import {CalendarHeaderComponent} from "./pages/calendar/demo-utils/calendar-header.component";
import {FormModalComponent} from './pages/calendar/demo-utils/ModalForm/form-modal.component';
import {RegistrationConfirmationComponent} from './pages/Registration_Confirmation/registration-confirmation';
import {CalendarComponent} from './pages/calendar/calendar';
import {Navbar} from './module/Navbar/navbar';
import {FullCalendarModule} from '@fullcalendar/angular'; // for FullCalendar!
import {MainViewComponent} from "./pages/Main_View/main_view";
import {GroupListComponent} from "./pages/Main_View/group_list/group_list";
import {GroupInfoComponent} from "./pages/Main_View/group_info/group_info";
import {FriendsComponent} from './pages/Friends/friends';
import {FriendRequestComponent} from "./pages/Friends/Friend-requests/friend-request";
import {FriendListComponent} from "./pages/Friends/Friend-list/friend-list";
import {PublicProfileComponent} from "./pages/User/profile/public/public";

//Dialog
import {ConfirmDialog} from './module/dialog/Confirm-dialog/Confirm-dialog';
import {GroupCreationDialog} from './module/dialog/Group-creation-dialog/group-creation';
import {CreateEventDialog} from './module/dialog/CreateEvent-dialog/CreateEvent-dialog';
import {ModifyEventDialog} from './module/dialog/ModifyEvent-dialog/ModifyEvent';
import {FoundSlotDialog} from './module/dialog/FoundSlot-dialog/FoundSlot-dialog';
import {ChangeValueDialog} from "./module/dialog/Change -value/change-value";
import {AddMemberDialog} from "./module/dialog/Add-member/add-member";
import {FriendInvitationDialog} from "./module/dialog/Friend-Invitation/invitation";
import {FoundSlotConfirmDialog} from './module/dialog/FoundSlotConfirm-dialog/FoundSlotConfirm-dialog';
import {AcceptInvitationDialog} from "./module/dialog/Accept-invitation-dialog/accept-invitation";
//import {MatRadioModule} from '@angular/material/radio';


//Guards
import {isLogged} from './core/Guards/isLogged-guard';
import {IsLogout} from './core/Guards/isLogout-guard';

import localeFr from '@angular/common/locales/fr';
import {environment} from "../environments/environment";
import {BestSlotCalendarComponent} from './pages/calendar/BestSlotCalendar/best-slot-calendar';
import {SWIPER_CONFIG, SwiperConfigInterface, SwiperModule} from 'ngx-swiper-wrapper';
//import {FlexLayoutModule} from '@angular/flex-layout';

registerLocaleData(localeFr);

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 'auto'
};

let gapiClientConfig: NgGapiClientConfig = {
    client_id: environment.google_client_id,
    discoveryDocs: ["https://analyticsreporting.googleapis.com/$discovery/rest?version=v4"],
    ux_mode: "popup",
    scope: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
    ].join(" ")
};


@NgModule({
    declarations: [
        AppComponent,
        Navbar,
        RegistrationComponent,
        ConnectionComponent,
        NotFoundComponent,
        DashboardComponent,
        ProfileComponent,
        CalendarComponent,
        BestSlotCalendarComponent,
        FormModalComponent,
        RegistrationConfirmationComponent,
        MainViewComponent,
        GroupListComponent,
        GroupInfoComponent,
        PublicProfileComponent,
        FriendsComponent,
        FriendRequestComponent,
        FriendListComponent,
        ConfirmDialog,
        CreateEventDialog,
        GroupCreationDialog,
        ModifyEventDialog,
        FoundSlotDialog,
        FoundSlotConfirmDialog,
        ChangeValueDialog,
        AddMemberDialog,
        FriendInvitationDialog,
        AcceptInvitationDialog,
    ],
    imports: [
        //FlexLayoutModule,
        SwiperModule,
        CommonModule,
        NgbModalModule,
        FlatpickrModule.forRoot(),
        BrowserModule,
        MatRadioModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSelectModule,
        MatDialogModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatCardModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatOptionModule,
        MatChipsModule,
        MatButtonModule,
        MatListModule,
        MatMenuModule,
        MatIconModule,
        MatDividerModule,
        FullCalendarModule,
        GoogleApiModule.forRoot({
            provide: NG_GAPI_CONFIG,
            useValue: gapiClientConfig
        }),
        ToastrModule.forRoot({
            timeOut: 10000,
            positionClass: 'toast-bottom-center',
            preventDuplicates: true,
        }),
    ],
    schemas: [ NO_ERRORS_SCHEMA ],
    providers: [
        RequestService,
        TokenService,
        AuthService,
        ProfileService,
        {
            provide: SWIPER_CONFIG,
            useValue: DEFAULT_SWIPER_CONFIG
        },
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
        isLogged,
        IsLogout,
        UserService,
        SheetResource
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        ConfirmDialog,
        GroupCreationDialog,
        FormModalComponent,
        CreateEventDialog,
        ModifyEventDialog,
        FoundSlotDialog,
        FoundSlotConfirmDialog,
        ChangeValueDialog,
        AddMemberDialog,
        FriendInvitationDialog,
        AcceptInvitationDialog,
    ]
})
export class AppModule {
}
