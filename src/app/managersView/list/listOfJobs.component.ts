import { Component } from "@angular/core";

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { LoginService } from "../../login/./login.service";
import { FormControl, FormGroup } from "@angular/forms";
import { ManagerPageService } from "../managerPage.service";
import { Users1 } from "../.././users1.model";
import { from } from "rxjs";
import { isNgTemplate } from "@angular/compiler";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  street: string;
}
interface EmployeeName {
  id: string;
  name: string;
}

@Component({
  selector: "listOfJobs",
  templateUrl: "./listOfJobs.component.html",
  styleUrls: ["./listOfJobs.component.css"]
})
export class ListOfJobsComponent {
  title: string;
  content: string;
  list: Users1[];

  usersCol: AngularFirestoreCollection<User>;
  nameOfEmployee: AngularFirestoreCollection<EmployeeName>;
  users: any;
  name: any;
  viewingUser: string = "";

  constructor(
    private afs: AngularFirestore,
    private _router: Router,
    private _loginService: LoginService,
    private _service: ManagerPageService
  ) {}
  // <select> assign the name on initial state object
  userid = {
    role: { id: 1, name: "user" }
  };
  ngOnInit() {
    this.viewingUser = this._loginService.loggedInUser;
    // GETTING LIST OF JOBS
    this._service.getEmployeesTasks().subscribe(actionArray => {
      this.list = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Users1;
      });
    });
    // GETTING NAMES and ID's of EMPLOYEE
    this._service.getEmployeeNames().subscribe(actionArray => {
      this.name = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          name: item.payload.doc.get("name")
          //   ...item.payload.doc.data()
        } as EmployeeName;
      });
    });
  }

  delete(userId, name) {
    if (this.viewingUser == "") {
      this.viewingUser = this._loginService.loggedInUser;
    }
    this.afs.doc("users/" + userId).delete();
    if (confirm("Are you sure you want to delete " + name + "?")) {
      this.afs.doc("users/" + this.viewingUser + "/clients/" + userId).delete();
    }
  }
  //  SELECT DIFFERENT USERS JOB BY NAME IN <select>names...</select>
  onChange(empId, empName) {
    this.viewingUser = empId.target.value;
    this._service
      .getEmployeesTasksByName(this.viewingUser)
      .subscribe(actionArray => {
        this.list = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          } as Users1;
        });
      });
  }
  //  BY CLICKIN ON SELECTED LINE THE DATA SHOULD BE SHOWN IN LEFT EDIT FORM
  // FOR FUTURE EDITING
  onEdit(emp) {
    emp.userId = this.viewingUser;
    console.log("USER ID and NAME", emp);
    this._service.formData = Object.assign({}, emp);
    console.log("FORM DATA", this._service.formData);
  }

  // show user name in <select>
  compareObjects(o1: any, o2: any): boolean {
    return o1.id === o2.id && o1.name === o2.name;
  }

  myForm = new FormGroup({
    userId: new FormControl()
  });
}
