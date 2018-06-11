import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { User } from "../../core/models/User";
import { RequestService } from "../../core/services/request.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";


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

  submit() {
    const user: User = this.registrationForm.value;
    delete (<any>user).confirm;
    console.log('User => ', user);
    this.requestSrv.post('users', user)
      .do((response) => {
        this.toastSrv.success('Vous vous êtes inscrit avec succès', 'Inscription effectué');
        console.log(response)
      })
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
}
