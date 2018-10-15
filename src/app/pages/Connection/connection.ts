import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AuthService} from "../../core/services/auth.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ProfileService} from "../../core/services/profile.service";


@Component({
  selector: 'connection',
  templateUrl: 'connection.html',
  styleUrls: ['connection.scss']
})
export class ConnectionComponent {

  connectionForm: FormGroup;

/*  initConnectionForm() {
    return this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }*/

  constructor(private fb: FormBuilder,
              private authSrv: AuthService,
              private profileSrv: ProfileService,
              private router: Router,
              private toastSrv: ToastrService) {
    this.connectionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$"),
                      Validators.minLength(8)]]
    });
  }

  submit() {
    this.authSrv.newConnection(this.connectionForm.value)
      .do(
        ((data: any) => {
          this.profileSrv.fetchUser$(data.user.pseudo).subscribe();
          this.router.navigate(['/dashboard']);
          return true;
        }),
        () => {
          this.connectionForm.reset();
          this.toastSrv.error('Erreur lors de la tentative de connexion.\n Veuillez réessayer', 'Erreur de connexion');
          return false;
        })
      .subscribe();
  }
}
