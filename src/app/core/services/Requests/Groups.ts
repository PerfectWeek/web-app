import {Injectable} from "@angular/core";
import {RequestService} from "../request.service";
import {Observable} from "rxjs/Rx";
import {a} from "@angular/core/src/render3";

@Injectable()
export class GroupsService {

    constructor(private requestSrv: RequestService) {}

    createGroup(body: any): Observable<any> {
        return this.requestSrv.postJSON('groups', body, {Authorization: ''});
    }

    getGroup(group_id: number): Observable<any> {
        return this.requestSrv.get(`groups/${group_id}`, {}, {Authorization: ''});
    }

    modifyGroup(group_id: number, body: any): Observable<any> {
        return this.requestSrv.put(`groups/${group_id}`, body, {Authorization: ''});
    }

    deleteGroup(group_id: number): Observable<any> {
        return this.requestSrv.delete(`groups/${group_id}`, {Authorization: ''});
    }

    getGroupMembers(group_id: number): Observable<any> {
        return this.requestSrv.get(`groups/${group_id}/members`, {}, {Authorization: ''});
    }

    modifyMemberRole(group_id: number, pseudo: string, role: string): Observable<any> {
        return this.requestSrv.put(`groups/${group_id}.members/${pseudo}`, {role}, {Authorization: ''});
    }

    removeMember(group_id: number, pseudo: string): Observable<any> {
        return this.requestSrv.delete(`groups/${group_id}/members/${pseudo}`, {Authorization: ''});
    }

    addMembers(group_id: number, users): Observable<any> {
        return this.requestSrv.post(`groups/${group_id}/add-members`,
            {users},
            {Authorization: ''})
    }

    uploadImage(group_id: number, file: any): Observable<any> {
        return this.requestSrv.postImage(`groups/${group_id}/upload-image`, file, {Authorization: ''});
    }

    getImage(group_id: number): Observable<any> {
        return this.requestSrv.get(`groups/${group_id}/image`, {}, {Authorization: ''})
    }

    getGroupInvitations(): Observable<any> {
        return this.requestSrv.get('group-invites', {}, {Authorization: ''});
    }

    acceptInvitation(invitation_id: any, body: any): Observable<any> {
        return this.requestSrv.postJSON(`group-invites/${invitation_id}/accept-invite`, body, {Authorization: ''})
    }

    declineInvitation(invitation_id: any, body: any): Observable<any> {
        return this.requestSrv.postJSON(`group-invites/${invitation_id}/decline-invite`, body, {Authorization: ''})
    }
}