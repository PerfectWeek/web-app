import {Component} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { User } from "../../core/models/User";
import { RequestService } from "../../core/services/request.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import 'rxjs/add/operator/do';


@Component({
  selector: 'registration',
  templateUrl: 'registration.html',
  //templateUrl: 'test.html',
  styleUrls: ['registration.scss'],
  //providers: [ ToastrService ]
})
export class RegistrationComponent {

  registrationForm: FormGroup;
/*
  initRegistrationForm() {
    return this.fb.group({
      pseudo: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      confirm: [null, Validators.required]
    });
  }

  constructor(private fb: FormBuilder,
              private toastSrv: ToastrService,
              private requestSrv: RequestService,
              private router: Router) {
    this.registrationForm = this.initRegistrationForm();
  }
*/
  constructor (private fb: FormBuilder,
               private toastSrv: ToastrService,
               private requestSrv: RequestService,
               private router: Router) {
    this.registrationForm = fb.group({
      "pseudo": ['', Validators.required],
      "email": ['', [ Validators.required, Validators.email ] ],
      "password": ['', [Validators.required,
                        Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$"),
                        Validators.minLength(8)],
      ],
      "confirm": ['', [Validators.required,
                      Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$"),
                      Validators.minLength(8)]],
      })
  }

  submit() {
    const user: User = this.registrationForm.value;
    delete (<any>user).confirm;
    this.requestSrv.post('users', user)
      .do((response) => this.toastSrv.success('Vous vous êtes inscrit avec succès', 'Inscription effectué'))
      .do(
        () => this.router.navigate(['/login']),
        (err: HttpErrorResponse) => {
          if (err.status === 422) {
            err.error.forEach((element) => this.registrationForm.controls[element].reset());
          }
          this.toastSrv.error("Votre inscription s'est terminé sur un échec", "Inscription Refusé");
        })
      .subscribe();
  }

  /*
  submit_test(user: {pseudo: string, email: string, password: string}) {
    this.requestSrv.post('users', user)
      .do((response) => this.toastSrv.success('Vous vous êtes inscrit avec succès', 'Inscription effectué'))
      .do(
        () => this.router.navigate(['/login']),
        (err: HttpErrorResponse) => {
          if (err.status === 422) {
            err.error.forEach((element) => this.registrationForm.controls[element].reset());
          }
          this.toastSrv.error("Votre inscription s'est terminé sur un échec", "Inscription Refusé");
        })
      .subscribe();
  }
  */
}
