import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { User } from "../../core/models/User";
import { RequestService } from "../../core/services/request.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { PasswordValidation } from "../../module/MatchPassword/MatchPassword";


@Component({
  selector: 'registration',
  templateUrl: 'registration.html',
  styleUrls: ['registration.scss']
})
export class RegistrationComponent {

  registrationForm: FormGroup;

  initRegistrationForm() {
    return this.fb.group({
      pseudo: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$"), Validators.minLength(8)]],
      confirmPassword: [null, Validators.required]
    },
      {
        validator: PasswordValidation.MatchPassword
      });
  }

  constructor(private fb: FormBuilder,
              private toastSrv: ToastrService,
              private requestSrv: RequestService,
              private router: Router) {
    this.registrationForm = this.initRegistrationForm();
  }

  submit() {
    let ret;
    const user: User = this.registrationForm.value;
    delete (<any>user).confirmPassword;
    this.requestSrv.post('users', user)
      .do((response) => this.toastSrv.success('Vous vous êtes inscrit avec succès', 'Inscription effectué'))
      .do(
        () => {
          this.router.navigate(['/login'])
          ret =  true;
        },
        (err: HttpErrorResponse) => {
          if (err.status === 422) {
            err.error.forEach((element) => this.registrationForm.controls[element].reset());
          }
          this.toastSrv.error("Votre inscription s'est terminé sur un échec", "Inscription Refusé");
          ret = false;
        })
      .subscribe();
    return ret;
  }
}
