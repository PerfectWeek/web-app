import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AutthService} from '../../core/services/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ProfileService} from '../../core/services/profile.service';
import {RequestService} from '../../core/services/request.service';
import {UserService} from '../Registration/UserService';
import {TokenService} from '../../core/services/token.service';
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
      password: [null, Validators.compose([Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'), Validators.minLength(8), Validators.required])],
    });
  }

  constructor(private fb: FormBuilder,
              private authSrv: AutthService,
              private profileSrv: ProfileService,
	      private tokenSrv: TokenService,
	      private requestSrv: RequestService,
	      private userService: UserService,
              public router: Router,
              private toastSrv: ToastrService) {
    this.connectionForm = this.initConnectionForm();
  }

  submit() {
    this.authSrv.newConnection(this.connectionForm.value)
      .do(
        ((data: any) => {
          this.profileSrv.fetchUser$(data.user.pseudo).subscribe();
          this.router.navigate(['/dashboard']);
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
