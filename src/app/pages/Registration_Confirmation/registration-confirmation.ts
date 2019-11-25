import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../core/services/request.service";
import {ToastrService} from "ngx-toastr";
import {AuthenticationService} from "../../core/services/Requests/Authentication";

@Component({
  selector: "registration-confirmation",
  templateUrl: "registration-confirmation.html",
  styleUrls: ["registration-confirmation.scss", '../../../scss/themes/main.scss']
})
export class RegistrationConfirmationComponent implements OnInit {

  isOk: boolean = null;
  error_message: string = null;

  constructor(public router: Router,
              private route: ActivatedRoute,
              private authSrv: AuthenticationService,
              public requestSrv: RequestService,
              public toastSrv: ToastrService) {

  }

  ngOnInit() {
      console.log('on init registration confirm');
        this.route.params.subscribe(params => {
          this.authSrv.validateEmail(params['id'])
              .subscribe(
                  ret => {
                      this.isOk = true;
                  },
                  err => {
                    this.toastSrv.error('Une erreur est survenue')
                    this.isOk = false;
                    this.error_message = err.error.message;
                  })
        });
  }

  confirmRegistration() {
      (<any>window).ga('send', 'event', 'Button', 'Confirming Registration', 'Confirming Registration');
      this.router.navigate(['/login'])
  }
}
