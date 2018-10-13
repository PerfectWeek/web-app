import {Component, OnInit} from "@angular/core";
import {RequestService} from "../../../core/services/request.service";
import {Router} from "@angular/router";
import {Group} from "../../../core/models/Group";
import {ToastrService} from "ngx-toastr";
import {ConfirmDialog} from "../../../module/dialog/Confirm-dialog/Confirm-dialog";
import {MatDialog} from "@angular/material";
import {ProfileService} from "../../../core/services/profile.service";
import {User} from "../../../core/models/User";

@Component({
  selector: 'group',
  templateUrl: 'group.html',
  styleUrls: ['group.scss', '../../../../scss/themes/main.scss']
})
export class GroupComponent implements OnInit {

  group: Group = {
    name: '',
    members: [],
    owner: {pseudo: ''}
  };

  group_id: number = null;

  constructor(private requestSrv: RequestService,
              public profileSrv: ProfileService,
              private toastSrv: ToastrService,
              private dialog: MatDialog,
              private router: Router) {

  }

  ngOnInit() {
    this.group_id = +(this.router.url.slice(this.router.url.lastIndexOf('/') + 1));
    this.requestSrv.get(`groups/${this.group_id}`, {}, {Authorization: ''})
      .subscribe(ret => {
        this.group = ret.group;
        this.group.members = this.group.members.filter(member => member.pseudo !== this.group.owner.pseudo);
        this.profileSrv.userProfile$.subscribe(user => {
          let isOk: boolean = false;
          if (this.group.owner.pseudo === user.pseudo)
            isOk = true;
          else
            this.group.members.forEach(member => {
              if (member.pseudo === user.pseudo)
                isOk = true;
            });
          if (isOk === false) {
            this.toastSrv.warning('Vous ne faites pas parti de ce groupe');
            this.router.navigate(['dashboard']);
          }
        })
      }, err => {
        this.toastSrv.error(err.error.message, 'Impossible de récupérer ce groupe');
        this.router.navigate(['dashboard']);
      });
  }

  deleteGroup() {
    let dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Suppression du profil',
        question: 'Voulez-vous vraiment supprimer ce groupe ?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true)
        this.requestSrv.delete(`groups/${this.group_id}`, {Authorization: ''})
          .subscribe(ret => {
            this.router.navigate(['/dashboard']);
            this.toastSrv.success(`Le groupe ${this.group.name} a été supprimé`);
            return true;
          }, err => {
            this.toastSrv.error(err.error.message, 'Une erreur est survenue');
            return false;
          });
    })
  }
}
