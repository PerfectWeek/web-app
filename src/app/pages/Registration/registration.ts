import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { User } from "../../core/models/User";
import { RequestService } from "../../core/services/request.service";
import { AutthService } from "../../core/services/auth.service";
import { ProfileService } from "../../core/services/profile.service";
import { TokenService } from "../../core/services/token.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { PasswordValidation } from "../../module/MatchPassword/MatchPassword";
import { GoogleAuthService } from 'ng-gapi';
import { UserService } from './UserService';
import { GoogleApiService } from 'ng-gapi';
import { SheetResource } from './SheetResource';
declare var FB: any;

@Component({
  selector: 'registration',
  templateUrl: 'registration.html',
  styleUrls: ['registration.scss']
})
export class RegistrationComponent {

    registrationForm: FormGroup;
    
    initRegistrationForm() {
	return this.fb.group({
	    pseudo: [null, Validators.required],
	    email: [null, Validators.compose([Validators.email, Validators.pattern("^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$"), Validators.required])],
	    password: [null, Validators.compose([Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$"), Validators.minLength(8), Validators.required])],
	    confirmPassword: [null, Validators.required]
	},
			     {
            validator: PasswordValidation.MatchPassword
	});
    }
    
    constructor(private fb: FormBuilder,
		private toastSrv: ToastrService,
		private requestSrv: RequestService,
		private profileSrv: ProfileService,
		private authSrv: AutthService,
		private tokenSrv: TokenService,
		public router: Router,
		private userService: UserService,
		private sheetResource: SheetResource,
		private authService: GoogleAuthService,
		private gapiService: GoogleApiService) {
	this.registrationForm = this.initRegistrationForm();
	this.gapiService.onLoad().subscribe();
    }
    
    submit() {
	const user: User = this.registrationForm.value;
	delete (<any>user).confirmPassword;
	this.requestSrv.post('users', user)
	    .do((response) => this.toastSrv.success('Vous vous êtes inscrit avec succès', 'Inscription effectué'))
	    .do(
		() => {
		    this.router.navigate(['/login'])
		    return true;
		    
		},
		(err: HttpErrorResponse) => {
		    if (err.status === 422) {
			err.error.forEach((element) => this.registrationForm.controls[element].reset());
		    }
		    this.toastSrv.error("Votre inscription s'est terminé sur un échec", "Inscription Refusé");
		    return false;
		})
	    .subscribe();
    }
    
    public signInGoogle() {
	this.userService.signIn();
	this.requestSrv.get("auth/providers/google/callback",{
	    access_token: this.userService.getToken(),
	    refresh_token: ""
	}, {})
	    .subscribe((resu) => {
		this.tokenSrv.token = resu["token"];
		localStorage.setItem('user_pseudo', resu["user"]["pseudo"]);
		this.authSrv.logged = true;
		this.profileSrv.fetchUser$(resu["user"]["pseudo"]).subscribe();
		this.router.navigate(['/dashboard']);
	    })
    }
    
    signInWithFB(): void {
	let self = this;
	FB.login(function(response) {
	    console.log(response);
	    if (response.status === 'connected') {
		console.log(response["authResponse"]["accessToken"]);
		self.requestSrv.get("auth/providers/facebook/callback",{
		    access_token: response["authResponse"]["accessToken"],
		    refresh_token: ""
		}, {})
		    .subscribe((resu) => {
			self.tokenSrv.token = resu["token"];
			localStorage.setItem('user_pseudo', resu["user"]["pseudo"]);
			self.authSrv.logged = true;
			self.profileSrv.fetchUser$(resu["user"]["pseudo"]).subscribe();
			self.router.navigate(['/dashboard']);
		    })
	    } else {
	    }
	}, {scope: 'email,user_events'});
    }

    public isLoggedIn(): boolean {
	return this.userService.isUserSignedIn();
    }
    
    ngOnInit() {
	(window as any).fbAsyncInit = function() {
	    FB.init({
		appId      : '2107497569541133',
		cookie     : true,
		xfbml      : true,
		version    : 'v3.1'
	    });
	    FB.AppEvents.logPageView();
	};
	
	(function(d, s, id){
	    var js, fjs = d.getElementsByTagName(s)[0];
	    if (d.getElementById(id)) {return;}
	    js = d.createElement(s); js.id = id;
	    js.src = "https://connect.facebook.net/en_US/sdk.js";
	    fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
    }
    
}
