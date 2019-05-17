import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../../core/models/User";
import {RequestService} from "../../../core/services/request.service";
import {ProfileService} from "../../../core/services/profile.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../../core/services/auth.service";
import {UserService} from '../../Registration/UserService';
import {TokenService} from '../../../core/services/token.service';

import {MatDialog} from "@angular/material";
import {ConfirmDialog} from "../../../module/dialog/Confirm-dialog/Confirm-dialog";
import {filter, switchMap} from "rxjs/operators";
import {CreateEventDialog} from '../../../module/dialog/CreateEvent-dialog/CreateEvent-dialog';

declare var FB: any;

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

    image: any = null;

    constructor(private route: ActivatedRoute,
                private requestSrv: RequestService,
                private toastSrv: ToastrService,
                private authSrv: AuthService,
                private userSrv: UserService,
                private tokenSrv: TokenService,
                public dialog: MatDialog,
                private profileSrv: ProfileService) {

    }

    ngOnInit() {
        this.profileSrv.userProfile$.subscribe(user => {
            this.user = user;
            this.requestSrv.get(`users/${user.pseudo}/image`, {}, {Authorization: ''})
                .subscribe(ret => {
                    this.image = ret.image;
                });
        }, (error) => {
            console.log('error => ', error)
        });
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

    // Provider binding
    bindFB() {
        let self = this;
        FB.login(function (response) {
            if (response.status === 'connected') {
                self.requestSrv.put(`users/${self.user.pseudo}/providers/facebook`, {
                    access_token: response["authResponse"]["accessToken"],
                    refresh_token: ""
                }, {Authorization: ""})
                    .subscribe((resu) => self.toastSrv.success('Vous avez connecté votre compte Facebook avec succès'),
                        err => this.toastSrv.error('Une erreur est survenue lors de la connection à Facebook'))
            } else {
            }
        }, {scope: 'email,user_events'});
    }

    bindGoogle() {
        this.userSrv.bind();
    }

    onFileChange(event) {
        if (event.target.files && event.target.files.length == 1) {
            const file = event.target.files[0];

            this.profileSrv.userProfile$.subscribe(user => {
                this.requestSrv.postImage(`users/${user.pseudo}/upload-image`, file, {Authorization: ''})
                    .do(() => {
                            this.requestSrv.get(`users/${user.pseudo}/image`, {}, {Authorization: ''})
                                .subscribe(ret => {
                                    this.image = ret.image;
                                });
                            this.toastSrv.success("L'image a été uploadé avec succès");
                        }, err => this.toastSrv.error("Une erreur est survenue lors de l'upload de l'image")
                    ).subscribe();
            });
        }
    }
}
