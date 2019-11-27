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
import {CalendarsService} from "../../../core/services/Requests/Calendars";

import * as imageUtils from "../../../core/helpers/image";
import {User} from "../../../core/models/User";
import {InvitationsService} from "../../../core/services/Requests/Invitations";

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

    user: User = {name: null, email: null};

    group: Group = {name: ""};

    user$ = this.profileSrv.userProfile$;

    image = null;

    user_role: string;
    rawRole: string;

    isAdmin: boolean = false;

    group_members: { name: string, role: string, image: any, id: number }[] = [];

    roles: string[] = [
        "Admin",
        "Spectator"
    ];

    new_member: string = '';

    CalendarsUpdate = this.profileSrv.CalendarsUpdate$.subscribe(hasChanged => {
        if (hasChanged === true) {
            console.log("Gropu info has changed");
            this.getInformationData();
        }
    });

    constructor(private requestSrv: RequestService,
                private profileSrv: ProfileService,
                private usersSrv: UsersService,
                private calendarSrv: CalendarsService,
                private invitationsSrv: InvitationsService,
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
                    this.usersSrv.putImage(file)
                        .do(() => {
                            this.usersSrv.getImage(user.id)
                                .subscribe(ret => {
                                    imageUtils.createImageFromBlob(ret, this.user);
                                    setTimeout(() => {this.image = this.user.image}, 50);
                                }, err => console.log('err => ', err.message));
                                this.toastSrv.success("L'image a été uploadé avec succès");
                            }, err => this.toastSrv.error("Une erreur est survenue lors de l'upload de l'image")
                        ).subscribe();
                });
            else
                this.calendarSrv.uploadImage(this.group_id, file)
                    .do(() => {
                        this.toastSrv.success("L'image a été uploadé avec succès");
                        this.calendarSrv.getImage(this.group_id)
                            .subscribe(ret => {
                                let obj = {image: null};
                                imageUtils.createImageFromBlob(ret, obj);
                                setTimeout(() => {
                                    this.image = obj.image;
                                    this.group_image_modified.emit(this.group_id);
                                }, 50);
                            }, err => console.log('err => ', err.message));
                    }, err => this.toastSrv.error("Une erreur est survenue lors de l'upload de l'image"))
                    .subscribe();
        }
    }

    getUserInformation() {
        this.user$.subscribe(user => {
            this.user.name = user.name;
            this.user.email = user.email;
            this.user.description = "Regroupement de tous vos évènements";
            this.usersSrv.getImage(user.id)
                .subscribe(ret => {
                    imageUtils.createImageFromBlob(ret, this.user);
                    setTimeout(() => {
                        this.image = this.user.image;
                        this.ready = true;
                        }, 100);
                }, err => console.log('err => ', err.message));
        })
    }

    getGroupInformation() {
        this.calendarSrv.getCalendar(this.group_id)
            .subscribe(ret => {
                this.group.name = ret.calendar.name;
                this.group_members = ret.calendar.members.filter(member => member.invitation_confirmed === true);
                this.group_members.forEach((member, index) => {
                    if (member.id === this.profileSrv.user.id) {
                        this.rawRole = member.role;
                        this.userRole = this.rolesfr[`${member.role}`];
                        this.isAdmin = member.role === 'admin';
                    }
                    this.usersSrv.getImage(member.id)
                        .subscribe(ret => {
                            imageUtils.createImageFromBlob(ret, member);
                            if (index === this.group_members.length - 1)
                                this.ready = true;
                        });
                });
                this.calendarSrv.getImage(this.group_id)
                    .subscribe(ret => {
                        let obj = {image: null};
                        imageUtils.createImageFromBlob(ret, obj);
                        setTimeout(() => {
                            this.image = obj.image;
                        }, 100);
                    }, err => console.log('err => ', err.message));
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
                    let user_pseudo = user.name;
                    user[`${fieldname}`] = result.value;
                    this.usersSrv.modifyUser({
                        name: user.name,
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
                this.calendarSrv.modifyCalendar(this.group_id, this.group.name).subscribe(ret => {
                        this.group[`${fieldname}`] = ret.group[`${fieldname}`];
                        if (fieldname === 'name') {
                            this.group_modified.emit(ret.group.id);
                        }
                        this.toastSrv.success(`Le ${fieldname === 'name' ? 'nom' : fieldname} de ce calendrier a bien été modifié`);
                    })
            }
        })
    }


    formatBody(body) {
        let field = 'members';
        let found: boolean = false;
        let end = '"role":"spectator"}';
        let str = 'members":[';
        for (let key in body) {
            if (key.toString().indexOf(field) != -1) {
                found = true;
                str += JSON.stringify(body[key]) + ',';
            }
        }
        str = str.slice(0, str.length - 1);
        str += ']';
        let result = JSON.stringify(body);
        return found === true ? (result.substring(0, result.indexOf('members[0]')) + str + result.substring(result.lastIndexOf(end) + end.length)) : result;
    }

    addMember() {
        let dialogRef = this.dialog.open(AddMemberDialog, {
            data: {members: this.group_members}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== null && result != undefined) {
                this.calendarSrv.inviteUsers(this.group_id, this.formatBody(result))
                    .subscribe(ret => {
                        this.group_members = ret.members.filter(member => member.member.invitation_confirmed === true);
                        (<any>window).ga('send', 'event', 'Group', 'Adding Members', `Group Name: ${result.name}`);
                        this.group_members.forEach(member => {
                            this.usersSrv.getImage(member.id)
                                .subscribe(ret => {
                                    imageUtils.createImageFromBlob(ret, member);
                                });
                        });
                        this.toastSrv.success("User ajouté au calendrier");
                    }, err => this.toastSrv.error("Une erreur est survenue lors de l'ajout du nouveau membre"))
            }
        })
    }

    leaveGroup() {
        this.user$.subscribe(user => {
            let dialogRef = this.dialog.open(ConfirmDialog, {
                data: {
                    title: 'Quitter le calendrier',
                    question: 'Voulez-vous vraiment quitter ce calendrier ?'
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === true)
                    this.calendarSrv.removeMember(this.group_id, user.id)
                        .subscribe(ret => {
                            (<any>window).ga('send', 'event', 'Group', 'Leaving Group', `Member: ${user.name} | Group Name: ${this.group.name}`);
                            this.left_group.emit(this.group_id);
                            this.toastSrv.success("Vous avez n'êtes désormais plus membre de ce calendrier");
                        }, ret => this.toastSrv.error("Une erreur est survenue. Vous n'avez pas pu quitter ce calendrier"))
            })
        })
    }

    fireFromGroup(pseudo: string) {
        this.user$.subscribe(user => {
            if (this.group_members.find(member => member.name === user.name).role === 'Admin') {
                let id = this.group_members.find(member => member.name === user.name).id;
                let dialogRef = this.dialog.open(ConfirmDialog, {
                    data: {
                        title: 'Suppression du profil',
                        question: 'Voulez-vous vraiment supprimer ce membre ?'
                    }
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result === true)
                        this.calendarSrv.removeMember(this.group_id, id)
                            .subscribe(ret => {
                                (<any>window).ga('send', 'event', 'Group', 'Removing From Group', `Member: ${pseudo} | Group Name: ${this.group.name}`);
                                this.toastSrv.success("Membre supprimé avec succès");
                                this.group_members.splice(this.group_members.findIndex(member => member.name === pseudo), 1);
                            }, ret => this.toastSrv.error("Une erreur est survenue lors de la suppression d\'un membre"))
                })
            }
        })
    }

    goToProfile(id) {
        (<any>window).ga('send', 'event', 'Routing', 'Visiting Profile', `Profile of: ${id}`);
        this.router.navigate([`profile/${id}`]);
    }

    addFriend(user) {
        this.invitationsSrv.inviteFriend(user.id)
            .subscribe(() => {
                (<any>window).ga('send', 'event', 'Friends', 'Sending Friend Request', `Request to: ${user.name}`);
                this.toastSrv.info("La demande d'ami a été envoyée");
                }, err => this.toastSrv.warning('Vous avez déjà demandé cette personne en ami'))
    }

    changeMemberPermission(member, new_role) {
        // this.groupsSrv.mod
        this.calendarSrv.editUserRole(this.group_id, member.id, new_role).subscribe(ret => {
            member.role = new_role;
            this.toastSrv.info(`${member.name} est maintenant ${this.PermSrv.permission[new_role].frRole} du calendrier ${this.group.name}.`);
        }, error => {this.toastSrv.error(`Une erreur est suvenue durant la modification du role de ${member.name}`)});
    }
}
