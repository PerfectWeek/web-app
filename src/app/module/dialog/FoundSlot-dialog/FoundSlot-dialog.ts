import {Component, Inject, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {ProfileService} from "../../../core/services/profile.service";
import {RequestService} from "../../../core/services/request.service";
import {DatePipe, formatDate} from "@angular/common";
import {FoundSlotConfirmDialog} from '../FoundSlotConfirm-dialog/FoundSlotConfirm-dialog';

@Component({
  selector: 'FoundSlot-dialog',
  templateUrl: 'FoundSlot-dialog.html',
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
export class FoundSlotDialog {

  name: string = null;
  location: string = null;
  start: Date;
  end: Date;
  minute: number;
  heure: number;

  dialog_calendar_id: string = null;
  user: any = null;
  calendars_list: any;
  date_format: string = "yyyy-MM-ddThh:mm:ss";

  @ViewChild('userInput') userInput;

  constructor(private requestSrv: RequestService,
              private profileSrv: ProfileService,
              private toastSrv: ToastrService,
              public dialogRef: MatDialogRef<FoundSlotDialog>,

              public dialog: MatDialog,

              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.profileSrv.userProfile$.subscribe(user => {
      this.requestSrv.get(`users/${user.pseudo}/calendars`, {}, {Authorization: ''})
        .subscribe(ret => {
          this.calendars_list = ret.calendars;
          console.log('CAL', this.calendars_list);
        });
    });
  }


  ChooseSlot(route_id_calendar, slots) {
    // Open a New modal for choose a slot
    let dialogConfirmRef = this.dialog.open(FoundSlotConfirmDialog, {
      data: {
        calendar_id: route_id_calendar,
        slots: slots,
        events: this.data.events,
        refresh: this.data.refresh,
        actions: this.data.actions,
      }
    });
    dialogConfirmRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== null && result !== undefined) {
        console.log("Réponse enregistré");
      }
    });
  }

  FoundSlot() {
    let route_id_calendar;
    if (this.dialog_calendar_id != null) {
      route_id_calendar = this.dialog_calendar_id;
    } else {
      route_id_calendar = this.data.calendar_id;
    }
    this.requestSrv.get(`calendars/${route_id_calendar}/assistant/find-best-slots`,
        {duration: this.heure * 60 + this.minute, location: this.location, min_time: this.start, max_time: this.end}, {Authorization: ''})
      .subscribe(ret => {
        //console.log(ret);
        // this.data.refresh.next();
        // this.toastSrv.success("Recherche de créneau en cours");
        this.dialogRef.close();
        this.ChooseSlot(route_id_calendar, ret);
      },err => this.toastSrv.error("Une erreur est survenue lors de la recherche d'evenement"))
  }
}
