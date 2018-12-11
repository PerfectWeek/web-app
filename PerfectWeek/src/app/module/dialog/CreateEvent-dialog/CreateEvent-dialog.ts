import {Component, Inject, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {ProfileService} from "../../../core/services/profile.service";
import {RequestService} from "../../../core/services/request.service";

@Component({
  selector: 'createEvent-creation-dialog',
  templateUrl: 'CreateEvent-dialog.html',
  styles: ['.mat-raised-button {\n' +
  '  box-sizing: border-box;\n' +
  '  position: relative;\n' +
  '  -webkit-user-select: none;\n' +
  '  -moz-user-select: none;\n' +
  '  -ms-user-select: none;\n' +
  '  user-select: none;\n' +
  '  cursor: pointer;\n' +
  '  outline: 0;\n' +
  '  border: none;\n' +
  '  -webkit-tap-highlight-color: transparent;\n' +
  '  display: inline-block;\n' +
  '  white-space: nowrap;\n' +
  '  text-decoration: none;\n' +
  '  vertical-align: baseline;\n' +
  '  text-align: center;\n' +
  '  margin: 0;\n' +
  '  min-width: 88px;\n' +
  '  line-height: 36px;\n' +
  '  padding: 0 16px;\n' +
  '  border-radius: 2px;\n' +
  '  overflow: visible;\n' +
  '  transform: translate3d(0, 0, 0);\n' +
  '  transition: background .4s cubic-bezier(.25, .8, .25, 1), box-shadow 280ms cubic-bezier(.4, 0, .2, 1);\n' +
  '  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);\n' +
  '}']
})
export class CreateEventDialog {

  name: string = null;
  description: string = null;
  location: string = null;
  color: any;
  start: Date;
  end: Date;

  user: any = null;
  @ViewChild('userInput') userInput;

  constructor(private requestSrv: RequestService,
              private profileSrv: ProfileService,
              private toastSrv: ToastrService,
              public dialogRef: MatDialogRef<CreateEventDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}


  createEvent() {
    this.requestSrv.post(`calendars/${this.data.calendar_id}/events`,{
      name: this.name,
      description: this.description,
      location: this.location,
      start_time: this.start,
      end_time: this.end}, {Authorization: ''})
      .subscribe(ret => {
        this.data.events.push({
          title: this.name,
          description: this.description,
          location: this.location,
          start: this.start,
          end: this.end,
          color: this.color,
          draggable: true,
          actions: this.data.actions,
          resizable: {
            beforeStart: true,
            afterEnd: true
          },
          id: ret.event.id,
        });
        this.data.refresh.next();
        this.toastSrv.success("Evenement ajouté au groupe");
        this.dialogRef.close();
      },err => this.toastSrv.error("Une erreur est survenue lors de l'ajout du nouvel evenement"))
  }
}
