import {
    AfterContentInit,
    AfterViewInit, ChangeDetectorRef,
    Component, EventEmitter,
    Input,
    OnChanges,
    OnInit, Output,
    SimpleChange,
    SimpleChanges
} from "@angular/core";
import {RequestService} from "../../../core/services/request.service";
import {Group} from "../../../core/models/Group";
import {ToastrService} from "ngx-toastr";
import {ProfileService} from "../../../core/services/profile.service";
import {MatDialog} from "@angular/material";
import {GroupCreationDialog} from "../../../module/dialog/Group-creation-dialog/group-creation";
import {ChangeValueDialog} from "../../../module/dialog/Change -value/change-value";
import {ConfirmDialog} from "../../../module/dialog/Confirm-dialog/Confirm-dialog";
import {AddMemberDialog} from "../../../module/dialog/Add-member/add-member";

@Component({
    selector: 'group-info',
    templateUrl: "group_info.html",
    styleUrls: ['group_info.scss', '../../../../scss/themes/main.scss']
})
export class GroupInfoComponent implements OnInit, OnChanges {

    ready: boolean = false;

    @Input("group_id") group_id: number = null;

    @Output("group_modified") group_modified = new EventEmitter<number>();

    @Output('left_group') left_group = new EventEmitter<number>();

    @Output("group_image_modified") group_image_modified = new EventEmitter<number>();

    user: {pseudo: string, description: string, email: string} = {
        pseudo: '',
        description: '',
        email: ''
    };

    group: Group = {
        name: '',
        description: ''
    };

    user$ = this.profileSrv.userProfile$;

    image = null;

    user_role: string;

    group_members: {pseudo: string, role: string, image: any}[] = [];

    roles: string[] = [
        "Admin",
        "Spectator"
    ];

    new_member: string = '';

    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private dialog: MatDialog,
                private cd: ChangeDetectorRef,
                private toastSrv: ToastrService) {

    }

    ngOnInit() {
        this.getInformationData();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.group_id = changes.group_id.currentValue;
        this.getInformationData();
    }

    onFileChange(event) {

        if (event.target.files && event.target.files.length == 1) {
            const file = event.target.files[0];

        if (this.group_id === -1)
            this.user$.subscribe(user => {
                this.requestSrv.postFile(`users/${user.pseudo}/upload-image`, file, {Authorization: ''})
                    .do(() => {
                        this.requestSrv.get(`users/${user.pseudo}/image`, {}, {Authorization: ''})
                            .subscribe(ret => {
                                this.group_image_modified.emit(-1);
                                this.image = ret.image;
                            });
                        this.toastSrv.success("L'image a été uploadé avec succès");
                        }, err => this.toastSrv.error("Une erreur est survenue lors de l'upload de l'image")
                    ).subscribe();
            });
        else
            this.requestSrv.postFile(`groups/${this.group_id}/upload-image`, file, {Authorization: ''})
                .do(() => {
                    this.toastSrv.success("L'image a été uploadé avec succès");
                    this.requestSrv.get(`groups/${this.group_id}/image`, {}, {Authorization: ''})
                        .subscribe(ret => {
                            this.group_image_modified.emit(this.group_id);
                            this.image = ret.image;
                        });
                    }, err => this.toastSrv.error("Une erreur est survenue lors de l'upload de l'image"))
                .subscribe();
        }
    }

    getUserInformation() {
        this.user$.subscribe(user => {
            this.user.pseudo = user.pseudo;
            this.user.email = user.email;
            this.user.description = "Regroupement de tous vos évènements";
            this.requestSrv.get(`users/${user.pseudo}/image`, {}, {Authorization: ''})
                .subscribe(ret => {
                    this.image = ret.image;
                    this.ready = true;
                });
        })
    }

    getGroupInformation() {
        this.requestSrv.get(`groups/${this.group_id}`, {}, {Authorization: ""})
            .subscribe(ret => {
                this.group.name = ret.group.name;
                this.group.description =
                    (ret.group.description == "" || !ret.group.description) ? "Pas de description" : ret.group.description;
                this.requestSrv.get(`groups/${ret.group.id}/members`, {}, {Authorization: ''})
                    .subscribe(ret => {
                        this.group_members = ret.members;
                        this.group_members.forEach((member, index) => {
                            this.requestSrv.get(`users/${member.pseudo}/image`, {}, {Authorization: ''})
                                .subscribe(ret => {
                                    member.image = ret.image;
                                    if (index === this.group_members.length - 1)
                                        this.ready = true;
                                });
                        })
                    });
                this.requestSrv.get(`groups/${ret.group.id}/image`, {}, {Authorization: ''})
                    .subscribe(ret => {
                        this.image = ret.image;
                    });
            });
    }

    getInformationData() {
        this.ready = false;
        if (this.group_id === -1) {
            this.getUserInformation();
        }
        else {
            this.getGroupInformation();
        }
    }

    changeUser(value: string, fieldname: string) {
        this.user$.subscribe(user => {

            let dialogRef = this.dialog.open(ChangeValueDialog, {
                data: {fieldname: fieldname, value: value}
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result != null && result.value != user[`${fieldname}`]) {
                    let user_pseudo = user.pseudo;
                    user[`${fieldname}`] = result.value;
                    this.requestSrv.put(`users/${user_pseudo}`, {
                        pseudo: user.pseudo,
                        email: user.email
                    }, {Authorization: ''})
                        .subscribe(ret => {
                            user[`${fieldname}`] = ret.user[`${fieldname}`];
                            this.user[`${fieldname}`] = ret.user[`${fieldname}`];
                            this.toastSrv.success(`Votre ${fieldname} a bien été modifié`);
                        });
                }
            });
        });
    }

    changeGroupBasicInfo(value: string, fieldname: string) {
        let dialogRef = this.dialog.open(ChangeValueDialog, {
            data: {fieldname: fieldname, value: value}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != null && result.value != this.group[`${fieldname}`]) {
                this.group[`${fieldname}`] = result.value;
                this.requestSrv.put(`groups/${this.group_id}`, {
                    name: this.group.name,
                    description: this.group.description
                }, {Authorization: ''})
                    .subscribe(ret => {
                        this.group[`${fieldname}`] = ret.group[`${fieldname}`];
                        if (fieldname === 'name') {
                            this.group_modified.emit(ret.group.id);
                        }
                        this.toastSrv.success(`Le ${fieldname} de ce groupe a bien été modifié`);
                    })
            }
        })
    }

    addMember() {
        let dialogRef = this.dialog.open(AddMemberDialog, {
            data: {members: this.group_members}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== null) {
                let users = [result];
                this.requestSrv.post(`groups/${this.group_id}/add-members`,
                    {users},
                    {Authorization: ''})
                    .subscribe(ret => {
                        this.ready = false;
                        this.group_members = ret.members;
                        this.group_members.forEach((member, index) => {
                            this.requestSrv.get(`users/${member.pseudo}/image`, {}, {Authorization: ''})
                                .subscribe(ret => {
                                    member.image = ret.image;
                                    if (index === this.group_members.length - 1)
                                        this.ready = true;
                                });
                        });
                            this.toastSrv.success("User ajouté au groupe");
                        },err => this.toastSrv.error("Une erreur est survenue lors de l'ajout du nouveau membre"))
            }
        })
    }

    leaveGroup() {
        this.user$.subscribe(user => {
            let dialogRef = this.dialog.open(ConfirmDialog, {
                data: {
                    title: 'Quitter le groupe',
                    question: 'Voulez-vous vraiment quitter ce groupe ?'
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === true)
                    this.requestSrv.delete(`groups/${this.group_id}/members/${user.pseudo}`, {Authorization: ''})
                        .subscribe(ret => {
                            this.left_group.emit(this.group_id);
                            this.toastSrv.success("Vous avez n'êtes désormais plus membre de ce groupe");
                        }, ret => this.toastSrv.error("Une erreur est survenue. Vous n'avez pas pu quitter ce groupe"))
            })
        })
    }

    fireFromGroup(pseudo: string) {
        this.user$.subscribe(user => {
            if (this.group_members.find(member => member.pseudo === user.pseudo).role === 'Admin') {
                let dialogRef = this.dialog.open(ConfirmDialog, {
                    data: {
                        title: 'Suppression du profil',
                        question: 'Voulez-vous vraiment supprimer ce membre ?'
                    }
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result === true)
                        this.requestSrv.delete(`groups/${this.group_id}/members/${pseudo}`, {Authorization: ''})
                            .subscribe(ret => {
                                this.toastSrv.success("Membre supprimé avec succès");
                                this.group_members.splice(this.group_members.findIndex(member => member.pseudo === pseudo), 1);
                            }, ret => this.toastSrv.error("Une erreur est survenue lors de la suppression d\'un membre"))
                })
            }
        })
    }
}
