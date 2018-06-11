import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {User} from "../../core/models/User";
import {RequestService} from "../../core/services/request.service";

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.html',
  styleUrls: ['dashboard.scss', '../../../scss/themes/main.scss']
})
export class DashboardComponent implements OnInit {

  user: User;

  constructor(private route: ActivatedRoute,
              private requestSrv: RequestService) {

  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        if (params.user_pseudo)
          this.requestSrv.get('users/' + params.user_pseudo)
            .do((user) => this.user = user.user)
            .subscribe()
        })
  }
}
