import { Component } from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: "registration-confirmation",
  templateUrl: "registration-confirmation.html",
  styleUrls: ["registration-confirmation.scss", '../../../scss/themes/main.scss']
})
export class RegistrationConfirmationComponent {

  constructor(public router: Router) {

  }
}
