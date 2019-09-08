import {Component, NgZone} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../core/services/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ProfileService} from '../../core/services/profile.service';
import {RequestService} from '../../core/services/request.service';
import {UserService} from '../Registration/UserService';
import {TokenService} from '../../core/services/token.service';
import {environment} from "../../../environments/environment";
import {AuthenticationService} from "../../core/services/Requests/Authentication";
import {UsersService} from "../../core/services/Requests/Users";

declare var FB: any;

@Component({
    selector: 'connection',
    templateUrl: 'connection.html',
    styleUrls: ['connection.scss']
})
export class ConnectionComponent {

    connectionForm: FormGroup;

    initConnectionForm() {
        return this.fb.group({
            email: [null, Validators.compose([Validators.email, Validators.pattern("^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$"), Validators.required])],
            password: [null, Validators.compose([Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+).{7,}$'), Validators.required])],
        });
    }

    constructor(private fb: FormBuilder,
                private authSrv: AuthService,
                private authReqService: AuthenticationService,
                private profileSrv: ProfileService,
                private usersSrv: UsersService,
                private tokenSrv: TokenService,
                private requestSrv: RequestService,
                private userService: UserService,
                public router: Router,
                private ngZone: NgZone,
                private toastSrv: ToastrService) {
        this.connectionForm = this.initConnectionForm();
    }

    submit() {
        if (this.connectionForm.invalid)
            return ;
        this.authSrv.newConnection(this.connectionForm.value)
            .do(
                ((data: any) => {
                    this.profileSrv.fetchUser$(data.user.pseudo).subscribe();
                    (<any>window).ga('send', 'event', 'Login', 'Connection', data.user.pseudo);
                    this.router.navigate(['/dashboard']);
                    this.usersSrv.putTimezone(data.user.pseudo).subscribe();
                    return true;
                }),
                () => {
                    this.connectionForm.reset();
                    this.toastSrv.error('Utilisateur ou mot de passe incorrect', 'Erreur lors de la tentative de connexion');
                    return false;
                })
            .subscribe();
    }

    public signInGoogle() {
        this.userService.signIn();
    }

    signInWithFB(): void {
        let self = this;
        FB.login(function (response) {
            if (response.status === 'connected') {
                self.authReqService.facebookAuth(response["authResponse"]["accessToken"], "")
                    .subscribe((resu) => {
                        self.tokenSrv.token = resu["token"];
                        localStorage.setItem('user_pseudo', resu["user"]["pseudo"]);
                        self.authSrv.auth = {email: resu["user"]["email"], pseudo: resu["user"]["pseudo"]};
                        self.authSrv.logged = true;
                        self.profileSrv.fetchUser$(resu["user"]["pseudo"]).subscribe(() => self.ngZone.run(() => {
                            (<any>window).ga('send', 'event', 'Login', 'FB Connection', resu["user"]["pseudo"]);
                            self.router.navigate(['/dashboard']);
                        }));
                    })
            } else {
            }
        }, {scope: 'email,user_events'});
    }

    public isLoggedIn(): boolean {
        return this.userService.isUserSignedIn();
    }

    ngOnInit() {
        (window as any).fbAsyncInit = function () {
            FB.init({
                appId: environment.facebook_client_id,
                cookie: true,
                xfbml: true,
                version: 'v3.1'
            });
            FB.AppEvents.logPageView();
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
}
