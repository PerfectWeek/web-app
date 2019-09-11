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
import {Router} from "@angular/router";
import {UsersService} from "../../../core/services/Requests/Users";
import {GroupsService} from "../../../core/services/Requests/Groups";
import {PermissionService} from '../../../core/services/permission.service';
import {ModifyEventDialog} from '../../../module/dialog/ModifyEvent-dialog/ModifyEvent';

@Component({
    selector: 'group-info',
    templateUrl: "group_info.html",
    styleUrls: ['group_info.scss', '../../../../scss/themes/main.scss']
})
export class GroupInfoComponent implements OnInit, OnChanges {

    ready: boolean = false;

    rolesfr: {'admin': string, 'outsider': string, 'spectator': string, 'actor': string}  = {
        "admin": "administrateur",
        "spectator": 'spectateur',
        "actor": 'membre',
        "outsider": 'non-membre'
    };

    userRole: string = '';

    @Input("group_id") group_id: number = null;

    @Output("group_modified") group_modified = new EventEmitter<number>();

    @Output('left_group') left_group = new EventEmitter<number>();

    @Output("group_image_modified") group_image_modified = new EventEmitter<number>();

    user: { pseudo: string, description: string, email: string } = {
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
    rawRole: string;

    isAdmin: boolean = false;

    group_members: { pseudo: string, role: string, image: any }[] = [];

    roles: string[] = [
        "Admin",
        "Spectator"
    ];

    new_member: string = '';

    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private usersSrv: UsersService,
                private groupsSrv: GroupsService,
                private dialog: MatDialog,
                private router: Router,
                private cd: ChangeDetectorRef,
                private toastSrv: ToastrService,
                private PermSrv: PermissionService) {

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
                    this.usersSrv.postImage(user.pseudo, file)
                        .do(() => {
                                this.usersSrv.getImage(user.pseudo)
                                    .subscribe(ret => {
                                        this.group_image_modified.emit(-1);
                                        this.image = ret.image;
                                    });
                                this.toastSrv.success("L'image a été uploadé avec succès");
                            }, err => this.toastSrv.error("Une erreur est survenue lors de l'upload de l'image")
                        ).subscribe();
                });
            else
                this.groupsSrv.uploadImage(this.group_id, file)
                    .do(() => {
                        this.toastSrv.success("L'image a été uploadé avec succès");
                        this.groupsSrv.getImage(this.group_id)
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
            this.usersSrv.getImage(user.pseudo)
                .subscribe(ret => {
                    this.image = ret.image;
                    this.ready = true;
                });
        })
    }

    getGroupInformation() {
        this.groupsSrv.getGroup(this.group_id)
            .subscribe(ret => {
                this.group.name = ret.group.name;
                this.group.description =
                    (ret.group.description == "" || !ret.group.description) ? "Pas de description" : ret.group.description;
                this.groupsSrv.getGroupMembers(ret.group.id)
                    .subscribe(ret => {
                        this.group_members = ret.members;
                        this.group_members.forEach((member, index) => {
                            if (member.pseudo === this.profileSrv.user.pseudo) {
                                this.rawRole = member.role;
                                this.userRole = this.rolesfr[`${member.role}`];
                                this.isAdmin = member.role === 'admin';
                            }
                            this.usersSrv.getImage(member.pseudo)
                                .subscribe(ret => {
                                    member.image = ret.image;
                                    if (index === this.group_members.length - 1)
                                        this.ready = true;
                                });
                        })
                    });
                this.groupsSrv.getImage(ret.group.id)
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
                if (result != null && result.value != user[`${fieldname}`]) {
                    let user_pseudo = user.pseudo;
                    user[`${fieldname}`] = result.value;
                    this.usersSrv.modifyUser(user_pseudo, {
                        pseudo: user.pseudo,
                        email: user.email
                    }).subscribe(ret => {
                            user[`${fieldname}`] = ret.user[`${fieldname}`];
                            this.user[`${fieldname}`] = ret.user[`${fieldname}`];
                            this.toastSrv.success(`Votre ${fieldname} a bien été modifié`);
                        });
                }
            });
        });
    }

    changeGroupBasicInfo(value: string, fieldname: string) {
        if (this.isAdmin !== true)
            return;
        let dialogRef = this.dialog.open(ChangeValueDialog, {
            data: {fieldname: fieldname, value: value}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != null && result.value != this.group[`${fieldname}`]) {
                this.group[`${fieldname}`] = result.value;
                this.groupsSrv.modifyGroup(this.group_id, {
                    name: this.group.name,
                    description: this.group.description
                }).subscribe(ret => {
                        this.group[`${fieldname}`] = ret.group[`${fieldname}`];
                        if (fieldname === 'name') {
                            this.group_modified.emit(ret.group.id);
                        }
                        this.toastSrv.success(`Le ${fieldname === 'name' ? 'nom' : fieldname} de ce groupe a bien été modifié`);
                    })
            }
        })
    }


    formatBody(body) {
        console.log('body => ', body);
        let field = 'users';
        let found: boolean = false;
        let end = '"role":"actor"}';
        let str = 'users":[';
        for (let key in body) {
            if (key.toString().indexOf(field) != -1) {
                found = true;
                str += JSON.stringify(body[key]) + ',';
            }
        }
        str = str.slice(0, str.length - 1);
        str += ']';
        let result = JSON.stringify(body);
        return found === true ? (result.substring(0, result.indexOf('users[0]')) + str + result.substring(result.lastIndexOf(end) + end.length)) : result;
    }

    addMember() {
        let dialogRef = this.dialog.open(AddMemberDialog, {
            data: {members: this.group_members}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== null && result != undefined) {
                this.groupsSrv.addMembers(this.group_id, this.formatBody(result))
                    .subscribe(ret => {
                        this.ready = false;
                        this.group_members = ret.members;
                        (<any>window).ga('send', 'event', 'Group', 'Adding Members', `Group Name: ${result.name}`);
                        this.group_members.forEach((member, index) => {
                            this.usersSrv.getImage(member.pseudo)
                                .subscribe(ret => {
                                    member.image = ret.image;
                                    if (index === this.group_members.length - 1)
                                        this.ready = true;
                                });
                        });
                        this.toastSrv.success("User ajouté au groupe");
                    }, err => this.toastSrv.error("Une erreur est survenue lors de l'ajout du nouveau membre"))
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
                    this.groupsSrv.removeMember(this.group_id, user.pseudo)
                        .subscribe(ret => {
                            (<any>window).ga('send', 'event', 'Group', 'Leaving Group', `Member: ${user.pseudo} | Group Name: ${this.group.name}`);
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
                        this.groupsSrv.removeMember(this.group_id, pseudo)
                            .subscribe(ret => {
                                (<any>window).ga('send', 'event', 'Group', 'Removing From Group', `Member: ${pseudo} | Group Name: ${this.group.name}`);
                                this.toastSrv.success("Membre supprimé avec succès");
                                this.group_members.splice(this.group_members.findIndex(member => member.pseudo === pseudo), 1);
                            }, ret => this.toastSrv.error("Une erreur est survenue lors de la suppression d\'un membre"))
                })
            }
        })
    }

    goToProfile(pseudo) {
        (<any>window).ga('send', 'event', 'Routing', 'Visiting Profile', `Profile of: ${pseudo}`);
        this.router.navigate([`profile/${pseudo}`]);
    }

    addFriend(pseudo) {
        this.usersSrv.inviteFriend(pseudo)
            .subscribe(() => {
                (<any>window).ga('send', 'event', 'Friends', 'Sending Friend Request', `Request to: ${pseudo}`);
                this.toastSrv.info("La demande d'ami a été envoyée");
                }, err => this.toastSrv.warning('Vous avez déjà demandé cette personne en ami'))
    }

    changeMemberPermission(member, new_role) {
        console.log(member, new_role);
        // this.groupsSrv.mod
        this.groupsSrv.modifyMemberRole(this.group_id, member.pseudo, new_role).subscribe(ret => {
            member.role = new_role;
            this.toastSrv.info(`${member.pseudo} est maintenant ${this.PermSrv.permission[new_role].frRole} du calendrier ${this.group.name}.`);
        }, error => {this.toastSrv.error(`Une erreur est suvenue durant la modification du role de ${member.pseudo}`)});
    }
}
