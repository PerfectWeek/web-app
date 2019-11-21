import {Component, OnInit} from "@angular/core";
import {ProfileService} from '../../../core/services/profile.service';
import {Router } from "@angular/router";
import {RequestService} from '../../../core/services/request.service';
import {UsersService} from "../../../core/services/Requests/Users";

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.html',
  styleUrls: ['dashboard.scss', '../../../../scss/themes/main.scss']
})

export class DashboardComponent implements OnInit {


  constructor(private profileSrv: ProfileService,
              private requestSrv: RequestService,
              private usersSrv: UsersService,
              private router: Router) {
  }

  ngOnInit() {
    this.profileSrv.userProfile$.subscribe(user => {
      this.usersSrv.getUser(user.id).subscribe();
    });
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}
