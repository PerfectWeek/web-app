import {Component, OnInit} from "@angular/core";
import {ProfileService} from "../../core/services/profile.service";
import {Router} from "@angular/router";
import {RequestService} from "../../core/services/request.service";

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.html',
  styleUrls: ['dashboard.scss', '../../../scss/themes/main.scss']
})

export class DashboardComponent implements OnInit {


  constructor(private profileSrv: ProfileService,
              private requestSrv: RequestService,
              private router: Router) {
  }

  ngOnInit() {
    this.profileSrv.userProfile$.subscribe(user => {
      console.log('user => ', user);
      this.requestSrv.get(`users/${user.pseudo}`, {}, {Authorization: ''}).subscribe(ret => console.log('ret => ', ret));
    })
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`])
  }
}
