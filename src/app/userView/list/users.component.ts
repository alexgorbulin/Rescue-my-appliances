import { Component } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { LoginService } from '../../login/login.service'; //
import { FormGroup, FormControl, Validators } from '@angular/forms';



interface User {
    name: string;
    email: string;
    phone: number;
    street: string;
}
@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css'],
})
export class UsersComponent {
    title: string;
    content: string;

    usersCol: AngularFirestoreCollection<User>;
    users: any;
    public success = {
        color: 'white',
        backgroundColor: 'green',
    };
    public progress = {
        color: 'black',
        backgroundColor: 'yellow',
    };
    public notTouched = {
        color: 'black',
        backgroundColor: 'white',
    };
    // creacting the form 
    // inside the FormGroup constructor we will pass the filds of the form
    // we use it here to remember selected options (status)
    formTemplate = new FormGroup({
        status: new FormControl(''),
    })
    constructor(private afs: AngularFirestore, private _router: Router, private _loginService: LoginService) { }

    ngOnInit() {
        this.usersCol = this.afs.collection('users/' + this._loginService.loggedInUser + '/clients');

        // list all the jobs for logged in user
        this.users = this.usersCol.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as User;
                    const id = a.payload.doc.id;
                    return { id, data };
                });
            })
        );
    }
    // add the record
    add() {
        this._router.navigate(['add']);
    }

    // Delete the job
    delete(userId, name) {
        this.afs.doc('users/' + userId).delete();
        if (confirm('Are you sure you want to delete ' + name + '?')) {
            this.afs.doc('users/' + this._loginService.loggedInUser + '/clients/' + userId).delete();
        }
    }
    // Change status of the task, update firebase status property
    changeStatus(event, recordId) {
        this.users.status = event.target.value;
        console.log(event);
        console.log(recordId);
        this.formTemplate.setValue({
            status: (this.users.status)
        });
        this.afs
            .collection('users')
            .doc(this._loginService.loggedInUser + '/clients/' + recordId)
            .update({
                status: event.target.value,
            });
    }
}
