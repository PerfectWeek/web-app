
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {User} from "../../../core/models/User";
import {RequestService} from "../../../core/services/request.service";
import {ProfileService} from "../../../core/services/profile.service";
import {ToastrService} from "ngx-toastr";
import {AutthService} from "../../../core/services/auth.service";
import {MatDialog} from "@angular/material";
import {ConfirmDialog} from "../../../module/dialog/Confirm-dialog/Confirm-dialog";
import {filter, switchMap} from "rxjs/operators";

@Component({
  selector: 'profile',
  templateUrl: 'profile.html',
  styleUrls: ['profile.scss', '../../../../scss/themes/main.scss']
})
export class ProfileComponent implements OnInit {

  user: User;

  modifying: boolean = false;

  pseudo: string = null;
  email: string = null;

  constructor(private route: ActivatedRoute,
              private requestSrv: RequestService,
              private toastSrv: ToastrService,
              private authSrv: AutthService,
              public dialog: MatDialog,
              private profileSrv: ProfileService) {

  }

  ngOnInit() {
    this.profileSrv.userProfile$.subscribe(user => {
      this.user = user;
    }, (error) => {console.log('error => ', error)});
  }

  checkInfoFormat() {
    if (this.pseudo && this.email && this.email.match("^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$"))
      return false;
    return true;
  }

  startModification() {
    this.modifying = true;
    this.pseudo = this.user.pseudo;
    this.email = this.user.email;
  }

  modifyProfile() {
    this.profileSrv.modify$({pseudo: this.pseudo, email: this.email}).subscribe((user: any) => {
      this.user.pseudo = this.pseudo;
      this.user.email = this.email;
      this.modifying = false;
      this.pseudo = null;
      this.email = null;
      this.toastSrv.info('Votre profil a été modifié')
      return true;
    }, err => {
      this.toastSrv.error(err.error.message, 'Une erreur est survenue');
      return false;
    });
  }

  deleteProfile() {
    let dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Suppression du profil',
        question: 'Voulez-vous vraiment supprimer votre profil ?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true)
        this.profileSrv.delete$().subscribe(ret => {
          this.toastSrv.info('Votre profil a été supprimé');
          this.authSrv.logout();
          return true;
        }, (err) => {
          this.toastSrv.error(err.error.message, 'Une erreur est survenue');
          return false;
        })
    })
  }
}
