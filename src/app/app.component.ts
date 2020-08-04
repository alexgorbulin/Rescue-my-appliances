import { Component } from '@angular/core';
import { LoginService } from './login/login.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    template: `
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav" style="display:block">
                        <li>
                            <a (click)="onLogout()" *ngIf="isLoggedIn | async">Logout</a>
                        </li>
                        <li>
                            <a (click)="managerPage()" *ngIf="isAdmin | async">Managers page</a>
                        </li>
                        <li>
                            <a (click)="userPage()" *ngIf="isAdmin | async">User page</a>
                        </li>
                        <li>
                            <a routerLink="login" *ngIf="!(isLoggedIn | async)">Login</a>
                        </li>
                        <li>
                            <a routerLink="signup" *ngIf="!(isLoggedIn | async)">Sign Up</a>
                        </li>
                    </ul>
                </div>
                <!-- /.navbar-collapse -->
            </div>
            <!-- /.container-fluid -->
        </nav>
        <router-outlet></router-outlet>
    `,
    // templateUrl: "./users.component.html",
    // templateUrl: "./app.component.html",
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'ScreduleApp';
    isLoggedIn: Observable<boolean>;
    isAdmin: Observable<boolean>;
    uid: Observable<string>;

    constructor(public loginService: LoginService, private _router: Router) {}

    ngOnInit() {
        this.loginService.getCurrentUser();
        this.isLoggedIn = this.loginService.isLoggedIn;
        this.isAdmin = this.loginService.isAdmin;
        this.uid = this.loginService.uid;
    }

    onLogout() {
        this.loginService.logout();
    }
    managerPage() {
        this._router.navigate(['managerPage']);
    }
    userPage() {
        this._router.navigate(['/']);
    }
}
