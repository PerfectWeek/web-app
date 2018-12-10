import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
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

  constructor(private authSrv: AuthService,
              private router: Router,
              private profileSrv: ProfileService) {

  }

  ngOnInit() {

  }

  logout() {
    this.authSrv.logout();
  }

}
