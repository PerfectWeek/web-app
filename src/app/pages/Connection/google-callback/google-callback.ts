import {AfterViewInit, Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../../core/services/Requests/Authentication";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../../core/services/auth.service";
import {ProfileService} from "../../../core/services/profile.service";
import {UsersService} from "../../../core/services/Requests/Users";

@Component({
    selector: "google-callback",
    template: "<section></section>"
})
export class GoogleCallbackComponent implements OnInit {
    constructor(private router: Router,
                private route: ActivatedRoute,
                private toastSrv: ToastrService,
                private profileSrv: ProfileService,
                private authSrv: AuthService,
                private usersSrv: UsersService,
                private authReqSrv: AuthenticationService) {
        console.log('construct');
    }

    ngOnInit(): void {
        console.log('on init');
        this.route.queryParamMap.subscribe((params: any) => {
            console.log('params => ', params);
            this.authReqSrv.googleCallback(params.params.code)
                .subscribe(ret => {
                    console.log('ret => ', ret);
                    this.authSrv.newGoogleConnection(ret);
                    this.profileSrv.fetchUser$().subscribe(user => {
                        console.log('fetch user => ', user);
                        (<any>window).ga('send', 'event', 'Login', 'Connection', ret.user.name);
                        this.router.navigate(['/dashboard']);
                        this.usersSrv.putTimezone().subscribe();
                    });
                });
        })
    }
}