import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "angularfire2/firestore";

import { User } from ".././user";
import { Observable } from "rxjs";

import { LoginService } from "../login/login.service"; //

@Component({
  selector: "managerPage",
  template: `
    <div class="row">
      <div class="col-md-5">
        <managerForm></managerForm>
      </div>
      <div class="col-md-7">
        <listOfJobs></listOfJobs>
      </div>
    </div>
  `
})
export class ManagerPageComponent {}
