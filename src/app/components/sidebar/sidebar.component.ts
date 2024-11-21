import { LoginService } from './../../services/login.service';
import { Component, inject, input, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { CapitalLetterPipe } from '../../customPipes/capital-letter.pipe';
import { User } from '../../models/user';
import { catchError, filter, Observable, skipWhile, Subscription, takeWhile } from 'rxjs';

export interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    NgFor,
    NgIf,
    RouterLink,
    RouterLinkActive,
    CapitalLetterPipe,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  LoginService = inject(LoginService);
  userService = inject(UsersService);

  user_name =signal("");
  user_surname = signal("");

  user: string  = "";
  users:User[]=[]

  // $users:User[] =this.userService.users$

  users_subscription$!: Subscription;
  login_subscription$!: Subscription;

  collapsed = input(false);

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'dashboard',
      route: 'dashboard',
    },
    {
      icon: 'local_shipping',
      label: 'products',
      route: 'product-list',
    },
    {
      icon: 'person',
      label: 'users',
      route: 'user-list',
    },
  ]);

  constructor() {}

  ngOnInit() {

    //login subscription
 
        this.user = this.LoginService.currentUser.username;
  
        this.userService.getUsers()

        this.userService.Users.pipe(filter((users):users is User[]=>!!users)).subscribe(
          (users)=>{
            this.users=users
            let k=this.users.filter((u: User) => u.username === this.user)[0]
  
            this.user_name.set( k.name.firstname)
            this.user_surname.set(k.name.lastname)
            
          })
    
    
      
  }

  ngOnDestroy() {
   // this.login_subscription$.unsubscribe()
  }
}
