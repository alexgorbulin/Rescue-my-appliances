import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormsModule, NgForm } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
// import { AppComponent } from "./app.component";
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { User } from '../.././user';
import { Observable } from 'rxjs';
import { LoginService } from '../../login/login.service'; //
import { ManagerPageService } from '../managerPage.service';
// import { MatSelectModule } from "@angular/material/select";

interface EmployeeName {
    id: string;
    name: string;
}

@Component({
    selector: 'managerForm',
    templateUrl: 'managerForm.component.html',
    styleUrls: ['./managerForm.component.css'],
})
export class ManagerFormComponent {
    id;
    form: FormGroup;
    title: string;
    user = new User();
    temp: string;

    userDoc: AngularFirestoreDocument<User>;
    usersCol: AngularFirestoreCollection<User>;
    singleUser: Observable<User>;
    nameOfEmployee: AngularFirestoreCollection<EmployeeName>;
    name: any;
    empId: any;

    constructor(
        fb: FormBuilder,
        private _router: Router,
        private afs: AngularFirestore,
        private _route: ActivatedRoute,
        private _loginService: LoginService,
        public _service: ManagerPageService
    ) {
        // this.form = fb.group({
        this.form = fb.group({
            id: [''],
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]],
            phone: [
                '',
                [
                    Validators.required,
                    Validators.pattern('^[(]{0,1}[0-9]{3}[)]{0,1}[-s.]{0,1}[0-9]{3}[-s.]{0,1}[0-9]{4}$'),
                ],
            ],
            user: ['', Validators.required],
            task: ['', Validators.required],
        });
    }
    // <select> assign the name on initial state object
    userid = {
        role: { id: 1, name: 'user' },
    };
    ngOnInit() {
        this.resetForm();
        this.title = 'Job description';
        // this.empId = this._loginService.loggedInUser;

        // getting the employee names and id's and list it in select element
        this._service.getEmployeeNames().subscribe(actionArray => {
            this.name = actionArray.map(item => {
                return {
                    id: item.payload.doc.id,
                    name: item.payload.doc.get('name'),
                    //   ...item.payload.doc.data()
                } as EmployeeName;
            });
        });
    }
    // select different user from <select>
    onChange(empId, empName) {
        this.empId = empId.target.value;
    }
    submit() {
        this.id = this._service.formData.id;
        if (this.id) {
            // UPDATING EXISTING USER
            this.afs.doc('users/' + this._service.formData.userId + '/clients/' + this.id).update({
                name: this._service.formData.name,
                email: this._service.formData.email,
                phone: this._service.formData.phone,
                task: this._service.formData.task,
            });
            this.resetForm();
        } else {
            // ADDING NEW USER
            this.afs
                .collection('users')
                .doc('' + this.empId + '')
                .collection('clients')
                .add({
                    name: this._service.formData.name,
                    email: this._service.formData.email,
                    phone: this._service.formData.phone,
                });
            this.resetForm();
        }
    }

    // show user name in <select>
    compareObjects(o1: any, o2: any): boolean {
        return o1.id === o2.id && o1.name === o2.name;
    }
    // reset the form function
    resetForm(form?: FormBuilder) {
        this.form.reset();
        this._service.formData = {
            id: '',
            name: '',
            email: '',
            phone: '',
            street: '',
            userId: '',
            task: '',
        };
    }
}
