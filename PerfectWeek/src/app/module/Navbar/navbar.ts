import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../core/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html',
  styleUrls: ['navbar.scss']
})
export class Navbar implements OnInit{

  isLogged$ = this.authSrv.isLogged();

  constructor(private authSrv: AuthService,
              private router: Router) {

  }

  ngOnInit() {

  }

  logout() {
    this.authSrv.logout();
  }

}
