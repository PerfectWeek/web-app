import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ChangeValueDialog} from "../Change -value/change-value";
import {FormBuilder} from "@angular/forms";

@Component({
    selector: 'accept-invitation',
    templateUrl: 'accept-invitation.html',
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
export class AcceptInvitationDialog {

    title: string = '';

    constructor(public dialogRef: MatDialogRef<AcceptInvitationDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data.type === 'group')
            this.title = `Voulez-vous accepter l\'invitation au calendrier ${data.body.name} ?`;
        else if (data.type === 'friend')
            this.title = `Voulez-vous accepter la demande d'ami de ${data.body.user.name} ?`;
        else
            this.title = `Voulez-vous participer à l\'évènement ${data.body.name} ?`;
    }
}