export class PermissionService {
    permission: any = {"admin": {"manage": true, "CRUD": true, "read": true, "frRole": "Administrateur"},
        "actor": {"manage": false, "CRUD": true, "read": true, "frRole": "Membre"},
        "spectator": {"manage": false, "CRUD": false, "read": true, "frRole": "Spectateur"},
        "outsider": {"manage": false, "CRUD": false, "read": true, "frRole": "Non Membre"}};

    permission_list: any = [
        {'role':"admin", 'text': "Administrateur"},
        {'role': "spectator", 'text': "Spectateur"},
        {'role': "actor", 'text': "Membre"},
        {'role': "outsider", 'text': "Non Membre"}
    ];
}
