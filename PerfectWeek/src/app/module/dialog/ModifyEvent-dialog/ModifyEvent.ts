import {Component, Inject, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {ProfileService} from "../../../core/services/profile.service";
import {RequestService} from "../../../core/services/request.service";
import {DatePipe, formatDate} from "@angular/common";
import {CreateEventDialog} from "../CreateEvent-dialog/CreateEvent-dialog";

@Component({
  selector: 'event-modification-dialog',
  templateUrl: 'ModifyEvent.html',
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
export class ModifyEventDialog {

  event: {title: string, description: string, location: string, color: any, start: Date, end: Date, id: number};

  dialog_calendar_id: string = null;
  calendars_list: any;
  date_format: string = "yyyy-MM-ddThh:mm:ss";

  constructor(private requestSrv: RequestService,
              private profileSrv: ProfileService,
              private toastSrv: ToastrService,
              public dialogRef: MatDialogRef<ModifyEventDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.event = data.event;
  }

  modifyEvent() {
    this.requestSrv.put(`events/${this.event.id}`, {
      name: this.event.title,
      description: this.event.description,
      start_time: formatDate(this.event.start, this.date_format, this.data.calendar_locale),
      end_time: formatDate(this.event.end, this.date_format, this.data.calendar_locale),
      location: this.event.location
    }, {Authorization: ''})
      .subscribe(ret => {
          this.toastSrv.success("L'évènement a bien été modifié"),
          this.dialogRef.close(true);
        },
          err => {
            this.toastSrv.error("Une erreur est survenue")
            this.dialogRef.close(false);
          })
  }
}
