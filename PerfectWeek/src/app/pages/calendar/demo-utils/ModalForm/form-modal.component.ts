import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html'
})
export class FormModalComponent {
  @Input()id: number;
  myForm: FormGroup;
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }
  private createForm() {
    this.myForm = this.formBuilder.group({
      title: '',
      description: '',
      location: '',
      color: '',
      start: '',
      end: '',
    // username: '',
    //   password: ''
    });
  }
  private submitForm() {
    this.activeModal.close(this.myForm.value);
  }
}
