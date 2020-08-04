import { RouterModule } from '@angular/router';
import { UsersComponent } from './userView/list/users.component';
import { UserFormComponent } from './userView/edit/user-form.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './login/signup.component';
import { AuthGuard } from './login/auth.guard';
import { ManagerPageComponent } from './managersView/managerPage.component';
import { ManagerFormComponent } from './managersView/form/managerForm.component';

export const routing = RouterModule.forRoot([
    { path: '', component: UsersComponent, canActivate: [AuthGuard] },
    {
        path: 'managerPage',
        component: ManagerPageComponent,
        canActivate: [AuthGuard],
    },
    { path: 'add', component: UserFormComponent, canActivate: [AuthGuard] },
    { path: 'add/:id', component: UserFormComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'login/:invalidLoginMessage', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'signup/:invalidLoginMessage', component: SignupComponent },
]);
