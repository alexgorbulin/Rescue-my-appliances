import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { UsersComponent } from './userView/list/users.component';
import { routing } from './app.routing';

import { ReactiveFormsModule } from '@angular/forms';
import { UserFormComponent } from './userView/edit/user-form.component';
import { ManagerFormComponent } from './managersView/form/managerForm.component';
import { ListOfJobsComponent } from './managersView/list/listOfJobs.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { SignupComponent } from './login/signup.component';
import { AuthGuard } from './login/auth.guard';
import { ManagerPageComponent } from './managersView/managerPage.component';
import { ManagerPageService } from './managersView/managerPage.service';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { ImagesComponent } from './images/images.component';
import { ImageComponent } from './images/image/image.component';
import { ImageListComponent } from './images/image-list/image-list.component';

var config = {
    apiKey: 'AIzaSyApECTjgeNpCPQ2jDXZpAA3kYaNVa05aDg',
    authDomain: 'scheduleapp-b39bc.firebaseapp.com',
    databaseURL: 'https://scheduleapp-b39bc.firebaseio.com',
    projectId: 'scheduleapp-b39bc',
    storageBucket: 'scheduleapp-b39bc.appspot.com',
    messagingSenderId: '211962233929',
};

@NgModule({
    declarations: [
        AppComponent,
        UsersComponent,
        UserFormComponent,
        LoginComponent,
        SignupComponent,
        ManagerPageComponent,
        ManagerFormComponent,
        ListOfJobsComponent,
        ImagesComponent,
        ImageComponent,
        ImageListComponent,
    ],
    imports: [
        BrowserModule,
        AngularFireModule.initializeApp(config),
        AngularFirestoreModule,
        ReactiveFormsModule,
        routing,
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFireStorageModule
    ],
    providers: [LoginService, AuthGuard, ManagerPageService],
    bootstrap: [AppComponent],
})
export class AppModule { }
