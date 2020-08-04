import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';

import { User } from '../../user';
import { Observable } from 'rxjs';

import { LoginService } from '../../login/login.service';
import { ManagerPageService } from '../../managersView/managerPage.service';
import { map, catchError } from 'rxjs/operators';

@Component({
    selector: 'user-form',
    templateUrl: 'user-form.component.html',
})
export class UserFormComponent {
    id;
    form: FormGroup;
    title: string;
    user = new User();
    // variable for reference firebase storage of the image in the task
    private refPict;
    // variable for reference firebase storage ot the task
    private ref;
    private task;
    private uploadProgress;
    // variable for 
    // private uploadState;
    private downloadURL;
    private url;
    private uploadSrc;

    userDoc: AngularFirestoreDocument<User>;
    singleUser: Observable<User>;

    constructor(
        fb: FormBuilder,
        private _router: Router,
        private afs: AngularFirestore,
        private _route: ActivatedRoute,
        private _loginService: LoginService,
        private _service: ManagerPageService,
        private _afStorage: AngularFireStorage
    ) {
        //
        this.form = fb.group({
            username: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            status: ['', Validators.required],
            model: [null],
            serial: [null],
            problem: [null],
            date: [null],
            type: [null],
            recommendation: [null]
        });
    }

    upload(event) {
        // this._afStorage.upload(('users/' + this._loginService.loggedInUser + '/clients/' + this.id), event.target.files[0]);
        // create a random id
        const randomId = Math.random().toString(36).substring(2);
        // create a reference to the storage bucket location
        this.refPict = this._afStorage.ref('users/' + this._loginService.loggedInUser + '/clients/' + this.id + '/' + randomId);
        // the put method creates an AngularFireUploadTask
        // and kicks off the upload
        this.task = this.refPict.put(event.target.files[0]);
        this.uploadProgress = this.task.percentageChanges();


        // this.uploadURL = this.task.uploadURL();
        // this.ref = this._afStorage.ref('users/' + this._loginService.loggedInUser + '/clients/' + this.id + '/');
    }
    ngOnInit() {
        this._route.params.subscribe(params => {
            this.id = params['id'];
        });

        if (!this.id) {
            this.title = 'Add new job';
        } else {
            this.title = 'Edit a job';
            //this.afs.doc('users/'+this.id);
            this.userDoc = this.afs.doc('users/' + this._loginService.loggedInUser + '/clients/' + this.id + '/'); //
            this.singleUser = this.userDoc.valueChanges();
            this.singleUser.subscribe(user => {
                this.form.get('username').setValue(user.name);
                this.form.get('email').setValue(user.email);
                this.form.get('phone').setValue(user.phone);
                this.form.get('status').setValue(user.status);
                this.form.get('model').setValue(user.model);
                this.form.get('serial').setValue(user.serial);
                this.form.get('problem').setValue(user.problem);
                this.form.get('date').setValue(user.date);
                this.form.get('type').setValue(user.type);
                this.form.get('recommendation').setValue(user.recommendation);
            });
        }
        // console.log('retriving images object ', this._afStorage.ref('users/' + this._loginService.loggedInUser + '/clients/' + this.id + '/0f2nf51rc84q').getDownloadURL());
        // this.downloadURL = this._afStorage.ref('users/' + this._loginService.loggedInUser + '/clients/' + this.id).getDownloadURL();
        var storage = this._afStorage.ref('');
        console.log('return firebase storage', storage);

    }


    submit() {
        if (this.id) {
            //this.afs.doc('users/'+this.id).update({
            this.afs.doc('users/' + this._loginService.loggedInUser + '/clients/' + this.id).update({
                //
                name: this.user.name,
                email: this.user.email,
                phone: this.user.phone,
                status: this.user.status,
                model: this.user.model,
                serial: this.user.serial,
                problem: this.user.problem,
                date: this.user.date,
                type: this.user.type,
                recommendation: this.user.recommendation
            });
        } else {
            // n83vLeE4hrgzwiLl8unF8TrtImr2
            // .doc(this._loginService.loggedInUser)
            // .doc("mxYfwQXZzMMYDTRTThkRkLobc792")
            this.afs
                .collection('users')
                .doc('n83vLeE4hrgzwiLl8unF8TrtImr2')
                .collection('clients')
                .add({
                    //this.afs.collection('users').add({
                    name: this.user.name,
                    email: this.user.email,
                    phone: this.user.phone,
                    status: this.user.status,
                    model: this.user.model,
                    serial: this.user.serial,
                    problem: this.user.problem,
                    date: this.user.date,
                    type: this.user.type,
                    recommendation: this.user.recommendation
                });
        }
        this._router.navigate(['']);
    }
}
