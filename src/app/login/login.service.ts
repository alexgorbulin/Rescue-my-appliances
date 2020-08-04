import { Injectable } from '@angular/core';
import { of as asObservableOf, observable, Observable } from 'rxjs';

import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map, retry, switchMap } from 'rxjs/operators';
import { auth } from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { ManagerPageService } from '../managersView/managerPage.service';
@Injectable()
export class LoginService {
    private loggedIn = new BehaviorSubject<boolean>(false);
    loggedInUser;
    loggedInUserName;
    // get logged in user uid
    uid = this.afAuth.authState.pipe(
        map(authState => {
            if (!authState) {
                return null;
            } else {
                return authState.uid;
            }
        })
    );
    // authorize user
    isAdmin: Observable<boolean> = this.uid.pipe(
        switchMap(uid => {
            if (!uid) {
                return asObservableOf(false);
            } else {
                return this.db.object<boolean>('/admin/' + uid).valueChanges();
            }
        })
    );

    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        afs: AngularFirestore
    ) {}

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    login(username, password) {
        if (username !== '' && password !== '') {
            return this.afAuth.auth
                .signInWithEmailAndPassword(username, password)
                .then(authState => {
                    console.log('Login-then', authState);
                    this.loggedIn.next(true);
                    //
                    this.afAuth.authState.subscribe(authState => {
                        if (authState) {
                            this.loggedInUser = authState.uid;
                            // this.loggedInUserName = authState.get('name');
                            // console.log('login uid = ', authState.uid);
                        }
                    });
                })
                .catch(error => {
                    this.router.navigate(['login/' + error.message]);
                    console.log(error);
                });
        }
    }

    logout() {
        this.loggedIn.next(false);
        this.afAuth.auth.signOut();
        this.loggedInUser = null;
        this.router.navigate(['/login']);
    }

    signup(username: string, password: string) {
        return this.afAuth.auth
            .createUserWithEmailAndPassword(username, password)
            .then(authState => {
                console.log('signup-then', authState);
                this.loggedIn.next(true);
                //
                this.afAuth.authState.subscribe(authState => {
                    if (authState) {
                        this.loggedInUser = authState.uid;
                        console.log('signup  uid =  ', authState.uid);
                    }
                });

                // this.loggedInUser = authState.uid;
                this.router.navigate(['/']);
            })
            .catch(error => {
                var errorMessage = error.message;
                this.router.navigate(['signup/' + error.message]);
                console.log(error);
            });
    }

    getCurrentUser() {
        return this.afAuth.authState.subscribe(authState => {
            if (authState) {
                this.loggedIn.next(true);
                this.loggedInUser = authState.uid;
                this.router.navigate(['/']);
            } else {
                this.router.navigate(['login']);
            }
        });
    }
}
