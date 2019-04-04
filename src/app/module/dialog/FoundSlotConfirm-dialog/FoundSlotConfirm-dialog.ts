import {Component, Inject, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {ProfileService} from "../../../core/services/profile.service";
import {RequestService} from "../../../core/services/request.service";
import {DatePipe, formatDate} from "@angular/common";
import {FoundSlotDialog} from '../FoundSlot-dialog/FoundSlot-dialog';
import {st} from '@angular/core/src/render3';

@Component({
    selector: 'FoundSlotConfirm-dialog',
    templateUrl: 'FoundSlotConfirm-dialog.html',
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
export class FoundSlotConfirmDialog {

    // name: string = null;
    // location: string = null;
    // start: Date;
    // end: Date;
    // minute: number;
    // heure: number;
    //
    // dialog_calendar_id: string = null;
    // user: any = null;
    date_format: string = "yyyy-MM-ddThh:mm:ss";
    finalChoose: string = null;
    calendars_list: any;
    slot_formated: string[] = [];
    dialog_calendar_id: string = null;
    // date_format: string = "yyyy-MM-ddThh:mm:ss";

    @ViewChild('userInput') userInput;

    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private toastSrv: ToastrService,
                public dialogRef: MatDialogRef<FoundSlotConfirmDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.profileSrv.userProfile$.subscribe(user => {
            this.requestSrv.get(`users/${user.pseudo}/calendars`, {}, {Authorization: ''})
                .subscribe(ret => {
                    this.calendars_list = ret.calendars;
                    // console.log('CAL', this.calendars_list);
                });
        });
        for (const idx in this.data.slots.slots) {
            // console.log(typeof this.data.slots.slots[idx].start_time);
            // console.log(this.data.slots.slots[idx].start_time);
            // console.log("envoie a l'api pouet\n",
            //     "start", this.data.slots.slots[idx].start_time, typeof this.data.slots.slots[idx].start_time, "\n",
            //     "end", this.data.slots.slots[idx].end_time, typeof this.data.slots.slots[idx].end_time, "\n");

            let begin = new DatePipe('fr').transform(
                this.data.slots.slots[idx].start_time,
                "E d MMM H:mm",
                'fr');

            let end = new DatePipe('fr').transform(
                this.data.slots.slots[idx].end_time,
                "E d MMM H:mm",
                'fr');

            let final_str = begin + "\n" + end;
            // console.log(typeof final_str);
            // console.log(final_str);
            this.slot_formated.push(final_str);
        }
        this.slot_formated.push("Aucun de ces choix");
    }


    FoundSlotConfirm() {
        // console.log('final choose',
        //     this.data.slots.slots[this.finalChoose].start_time,
        //     this.data.slots.slots[this.finalChoose].end_time);
        let route_id_calendar;
        if (this.dialog_calendar_id != null) {
            route_id_calendar = this.dialog_calendar_id;
        } else {
            route_id_calendar = this.data.calendar_id;
        }
        // console.log(this.finalChoose, this.data.slots.slots.length);
        if (this.finalChoose === this.data.slots.slots.length)
        {
            this.dialogRef.close();
            return;
        }
        // console.log("envoie a l'api RAW\n",
        //     "start", this.data.slots.slots[this.finalChoose].start_time, typeof this.data.slots.slots[this.finalChoose].start_time, "\n",
        //     "end", this.data.slots.slots[this.finalChoose].end_time, typeof this.data.slots.slots[this.finalChoose].end_time, "\n");


        // let start = formatDate(this.data.slots.slots[this.finalChoose].start_time, this.date_format, 'fr');
        // let end = formatDate(this.data.slots.slots[this.finalChoose].end_time, this.date_format, 'fr')

        let start = this.data.slots.slots[this.finalChoose].start_time;
        let end = this.data.slots.slots[this.finalChoose].end_time;


        this.requestSrv.post(`calendars/${route_id_calendar}/events`,{
            name: "trouver un creneau !!!",
            description: "oui",
            location: "ici",
            start_time: start,
            end_time: end
        }, {Authorization: ''})
            .subscribe(ret => {
                this.data.events.push({
                    title: "trouver un creneau !!!",
                    description: "oui",
                    location: "ici",
                    start: new Date(start),
                    end: new Date(end),
                    color: '#FFFFFF',
                    draggable: true,
                    actions: this.data.actions,
                    resizable: {
                        beforeStart: true,
                        afterEnd: true
                    },
                    id: ret.event.id,
                });
                // console.log("envoie a l'api\n",
                //     "start", start, typeof start, "\n",
                //     "end", end, typeof end, "\n");

                this.data.refresh.next();
                this.toastSrv.success("Evenement ajouté au groupe");
                this.dialogRef.close();
            },err => this.toastSrv.error("Une erreur est survenue lors de l'ajout du nouvel evenement"))
    }
}
