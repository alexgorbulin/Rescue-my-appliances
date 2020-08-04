import { Injectable } from '@angular/core';
import { User } from '../user';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoginService } from '../login/./login.service';
import { Users1 } from '../users1.model';

// import { from } from "rxjs";

@Injectable({
    providedIn: 'root',
})
// Employee is just a class in employee.model.ts
export class ManagerPageService {
    formData: Users1;

    constructor(private afs: AngularFirestore, private _loginService: LoginService) {}

    // getEmployeesTasks(optionalName?: string) {
    //   if (optionalName != "") {
    //     let usedName = optionalName;
    //     return this.afs
    //       .collection("users/" + usedName + "/clients")
    //       .snapshotChanges();
    //   } else {
    //     return this.afs
    //       .collection("users/" + this._loginService.loggedInUser + "/clients")
    //       .snapshotChanges();
    //   }
    getEmployeesTasks() {
        return this.afs.collection('users/' + this._loginService.loggedInUser + '/clients').snapshotChanges();
    }
    getEmployeesTasksByName(name: string) {
        return this.afs.collection('users/' + name + '/clients').snapshotChanges();
    }
    getEmployeeNames() {
        return this.afs.collection('users').snapshotChanges();
    }
    getCurrentUserName() {
        return this.afs.collection('users/' + this._loginService.loggedInUser + '/name').snapshotChanges();
    }
}
