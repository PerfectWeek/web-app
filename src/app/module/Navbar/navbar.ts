import {Component, OnInit} from '@angular/core';
import {AutthService} from '../../core/services/auth.service';
import {Router} from '@angular/router';
import {ProfileService} from '../../core/services/profile.service';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html',
  styleUrls: ['navbar.scss']
})
export class Navbar implements OnInit {

  isLogged$ = this.authSrv.isLogged();

  userProfile$ = this.profileSrv.userProfile$;

  constructor(private authSrv: AutthService,
              private router: Router,
              private profileSrv: ProfileService) {

  }

  ngOnInit() {

  }

    logout() {
	
	console.log(localStorage.getItem('user_pseudo'));
	this.authSrv.logout();
  }

}
