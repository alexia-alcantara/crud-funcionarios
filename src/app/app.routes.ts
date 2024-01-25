import { Routes } from '@angular/router';
import { UsersComponent } from './users-avaliza/users/users.component';

export const routes: Routes = [
    {path: '', redirectTo: '/usuarios', pathMatch: 'full'},
    {path: 'usuarios' , 'title': 'Usuarios', component: UsersComponent}
];
