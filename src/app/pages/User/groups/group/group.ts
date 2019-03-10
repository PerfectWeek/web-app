import {Component, OnInit} from "@angular/core";
import {RequestService} from "../../../../core/services/request.service";
import {Router} from "@angular/router";
import {Group} from "../../../../core/models/Group";
import {ToastrService} from "ngx-toastr";
import {ConfirmDialog} from "../../../../module/dialog/Confirm-dialog/Confirm-dialog";
import {MatDialog} from "@angular/material";
import {ProfileService} from "../../../../core/services/profile.service";
import {User} from "../../../../core/models/User";

@Component({
  selector: 'group',
  templateUrl: 'group.html',
  styleUrls: ['group.scss', '../../../../../scss/themes/main.scss']
})
export class GroupComponent implements OnInit {

  group: Group = {
    name: '',
    description: ''
  };

  group_id: number = null;

  calendar_id: number = null;

  display_members: any[] = [];

  user_role: string;

  modify: boolean = false;

  group_members = [];

  group_owner: null;

  roles: string[] = [
    "Admin",
    "Spectator"
  ];

  new_members: string[] = [];

  new_member: string = '';

  new_group_name: string;

  constructor(private requestSrv: RequestService,
              public profileSrv: ProfileService,
              private toastSrv: ToastrService,
              private dialog: MatDialog,
              private router: Router) {

  }

  ngOnInit() {
    this.getGroup();
  }

  refreshMembers(members) {
    this.group_members = members;
    this.display_members = members.filter(member => member.pseudo !== this.group_owner);
    this.profileSrv.userProfile$.subscribe(user => {
      let isOk: boolean = false;
      this.group_members.forEach(member => {
        if (member.pseudo === user.pseudo) {
          isOk = true;
          this.user_role = member.role;
        }
      });
      if (isOk === false) {
        this.toastSrv.warning('Vous ne faites pas parti de ce groupe');
        this.router.navigate(['dashboard']);
      }
    })
  }

  getGroup() {
    this.group_id = +(this.router.url.slice(this.router.url.lastIndexOf('/') + 1));
    this.requestSrv.get(`groups/${this.group_id}`, {}, {Authorization: ''})
      .subscribe(ret => {
        this.group.name = ret.group.name;
        this.group_owner = ret.group.owner;
        this.calendar_id = ret.group.calendar_id;
        this.group.description = ret.group.description;
        this.requestSrv.get(`groups/${this.group_id}/members`, {}, {Authorization: ''})
          .subscribe(members => {
            this.refreshMembers(members.members);
          });
      }, err => {
        this.toastSrv.error(err.error.message, 'Impossible de récupérer ce groupe');
        this.router.navigate(['dashboard']);
      });
  }

  goToCalendar() {
    this.router.navigate([`calendar/${this.calendar_id}`]);
  }

  Modifying() {
    this.modify = !this.modify;
    this.new_member = '';
    this.new_members = [];
  }

  modifyGroup() {
    let desc = this.group.description.length > 0 ? this.group.description : 'Pas de description';
    this.requestSrv.put(`groups/${this.group_id}`, {
      name: this.group.name,
      description: desc
    }, {Authorization: ''}).subscribe(ret => {
      this.group.name = ret.group.name;
      this.group.description = ret.group.description;
      this.toastSrv.success("Mise à jour du groupe effectuée");
      // this.display_members.forEach(member => this.requestSrv.put(`groups/${this.group_id}/members/${member.pseudo}`,
      //   {role: member.role}, {Authorization: ''}).subscribe());
      let users: string[] = this.new_members;
      if (this.new_members.length > 0)
        this.requestSrv.post(`groups/${this.group_id}/add-members`,
          {users},
          {Authorization: ''})
          .subscribe(ret => {
            this.toastSrv.success("User ajouté au groupe");
            this.refreshMembers(ret.members);
            this.new_members = [];
          },
          err => this.toastSrv.error("Une erreur est survenue lors de l'ajout du nouveau membre"))
      this.modify = false;
    }, err => {
      this.toastSrv.error("Une erreur est survenue lors de la modification du groupe");
      this.modify = false;
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

  addMember() {
    if (this.new_member == '')
      this.toastSrv.error('Veuillez entrer un pseudo');
    else {
      this.requestSrv.get(`users/${this.new_member}`, {}, {Authorization: ''})
        .subscribe(ret => {
          this.new_members.push(this.new_member);
          this.new_member = '';
        }, err => {
          this.toastSrv.error("Veuillez rentrer un utilisateur existant")
          this.new_member = '';
        });
    }
  }

  deleteTemp(idx) {this.new_members.splice(idx, 1);}

  deleteMember(member) {
    let dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Suppression du profil',
        question: 'Voulez-vous vraiment supprimer ce membre ?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true)
        this.requestSrv.delete(`groups/${this.group_id}/members/${member.pseudo}`, {Authorization: ''})
          .subscribe(ret => {
            this.toastSrv.success("Membre supprimé avec succès");
            this.refreshMembers(ret.members);
          }, ret => this.toastSrv.error("Une erreur est survenue lors de la suppression d\'un membre"))
    })
  }
}
