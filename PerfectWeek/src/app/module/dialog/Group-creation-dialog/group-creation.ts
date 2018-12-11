import {Component, Inject, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {ToastrService} from "ngx-toastr";
import {ProfileService} from "../../../core/services/profile.service";
import {RequestService} from "../../../core/services/request.service";
import {Router} from "@angular/router";

@Component({
  selector: 'group-creation-dialog',
  templateUrl: 'group-creation.html',
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
export class GroupCreationDialog {

  name: string = null;

  selectable: boolean = true;
  removable: boolean = true;
  visible: boolean = true;
  addOnBlur: boolean = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  user: any = null;
  selectedUsers: any[] = [];
  userCtrl: FormControl = new FormControl();
  userFiltered: any[] = [];
  @ViewChild('userInput') userInput;

  constructor(private requestSrv: RequestService,
              private profileSrv: ProfileService,
              private toastSrv: ToastrService,
              private router: Router,
              public dialogRef: MatDialogRef<GroupCreationDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  addUser(event) {
    const input = event.input;
    const value = event.value;
    this.requestSrv.get(`users/${value}`, {}, {Authorization: ''})
      .subscribe(ret => {
          let id: number = -1;
          this.selectedUsers.forEach((atm_user, index) => {
            if (atm_user.pseudo === value)
              id = index;
          });
          if (id != -1)
            this.selectedUsers.splice(id, 1);
          else
            this.selectedUsers.push(value);

        },
        err => {
          this.toastSrv.error(err.error.message, 'Une erreur est survenue')
        });
    input.value = '';
  }

  removeUser(user) {
    const index = this.selectedUsers.indexOf(user);

    if (index >= 0)
      this.selectedUsers.splice(index, 1);
  }

  createGroup() {
    this.profileSrv.userProfile$.subscribe(user => {
      let id = -1;
      this.selectedUsers.forEach((pseudo, index) => {
        if (pseudo === user.pseudo)
          id = index;
      });
      if (id === -1)
        this.selectedUsers.push(user.pseudo);
      let body = {name: this.name};
      this.selectedUsers.forEach((user, index) => {
        body[`members[${index}]`] = user;
      });
      this.requestSrv.post('groups', body, {Authorization: ''}).subscribe(ret => {
          this.toastSrv.success(`Votre groupe ${ret.group.name} a bien été créé`);
          this.dialogRef.close(ret.group.id);
          return true;
        },
        err => {
          this.toastSrv.error(err.error.message, 'Une erreur est survenue');
          return false;
        });
    }, (error) => {console.log('error => ', error)});
  }

}
