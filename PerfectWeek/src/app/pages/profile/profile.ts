import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {User} from "../../core/models/User";
import {RequestService} from "../../core/services/request.service";
import {ProfileService} from "../../core/services/profile.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../core/services/auth.service";
import {MatDialog} from "@angular/material";
import {ConfirmDialog} from "../../module/dialog/Confirm-dialog/Confirm-dialog";
import {filter, switchMap} from "rxjs/operators";

@Component({
  selector: 'profile',
  templateUrl: 'profile.html',
  styleUrls: ['profile.scss', '../../../scss/themes/main.scss']
})
export class ProfileComponent implements OnInit {

  user: User;

  modifying: boolean = false;

  pseudo: string = null;

  constructor(private route: ActivatedRoute,
              private requestSrv: RequestService,
              private toastSrv: ToastrService,
              private authSrv: AuthService,
              public dialog: MatDialog,
              private profileSrv: ProfileService) {

  }

  ngOnInit() {
    this.profileSrv.userProfile$.subscribe(user => {
      this.user = user;
    }, (error) => {console.log('error => ', error)});

  }

  modifyProfile() {
    this.profileSrv.modify$(this.pseudo).subscribe((user: any) => {
      this.user.pseudo = this.pseudo;
      this.modifying = false;
      this.pseudo = null;
      this.toastSrv.info('Votre profil a été modifié')
    }, err => this.toastSrv.error(err.error.message, 'Une erreur est survenue'));
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
          this.authSrv.logout().subscribe();
        }, (err) => this.toastSrv.error(err.error.message, 'Une erreur est survenue'))
    })
  }
}
