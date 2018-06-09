import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'registration',
  templateUrl: 'registration.html',
  styleUrls: ['registration.scss']
})
export class RegistrationComponent {

  registrationForm: FormGroup;

  initRegistrationForm() {
    return this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
      confirm: [null, Validators.required]
    });
  }

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.initRegistrationForm();
  }

  submit() {
    console.log('values => ', this.registrationForm.value);
  }
}
