import {Component, OnInit, ViewChild} from "@angular/core";
import {RequestService} from "../../core/services/request.service";
import {FormControl} from "@angular/forms";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {ToastrService} from "ngx-toastr";
import {ProfileService} from "../../core/services/profile.service";
import {Router} from "@angular/router";

@Component({
  selector: 'group-management',
  templateUrl: 'group-management.html',
  styleUrls: ['group-management.scss']
})
export class GroupManagementComponent implements OnInit {

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
              private router: Router) {

  }

  ngOnInit() {
  }

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
        this.router.navigate([`group/${ret.group.id}`]);
        return true;
        },
        err => {
        this.toastSrv.error(err.error.message, 'Une erreur est survenue');
        return false;
        });
    }, (error) => {console.log('error => ', error)});
  }
}
