import { Component } from "@angular/core";
import {RequestService} from "../../core/services/request.service";

@Component({
  selector: 'not-found',
  templateUrl: 'not-found.html',
  styleUrls: ['not-found.scss']
})
export class NotFoundComponent {

  constructor(private requestSrv: RequestService) {
    this.requestSrv.get('users/test')
      .do((users) => console.log('users => ', users))
      .subscribe()
  }
}
