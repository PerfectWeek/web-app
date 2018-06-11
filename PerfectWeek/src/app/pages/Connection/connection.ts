import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AuthService} from "../../core/services/auth.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'connection',
  templateUrl: 'connection.html',
  styleUrls: ['connection.scss']
})
export class ConnectionComponent {

  connectionForm: FormGroup;

  initConnectionForm() {
    return this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  constructor(private fb: FormBuilder,
              private authSrv: AuthService,
              private router: Router,
              private toastSrv: ToastrService) {
    this.connectionForm = this.initConnectionForm();
  }

  submit() {
    this.authSrv.newConnection(this.connectionForm.value)
      .do(
        ((user: any) => {
          console.log('user => ', user.user.pseudo);
          this.router.navigate(['/dashboard'], {queryParams: {user_pseudo: user.user.pseudo}})
        } ),
        () => {
          this.connectionForm.reset();
          this.toastSrv.error('Erreur lors de la tentative de connexion.\n Veuillez réessayer', 'Erreur de connexion');
        })
      .subscribe();
  }
}
