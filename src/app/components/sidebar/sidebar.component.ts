import { LoginService } from './../../services/login.service';
import { Component, inject, input, signal } from '@angular/core';
import { MatSidenavModule} from '@angular/material/sidenav'
import {MatListModule} from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { CapitalLetterPipe } from "../../customPipes/capital-letter.pipe";


export interface MenuItem{
  icon:string,
  label:string,
  route:string
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, MatSidenavModule, MatListModule, MatIconModule, NgFor, NgIf, RouterLink, RouterLinkActive, CapitalLetterPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
LoginService = inject(LoginService)
userService = inject(UsersService)
user_name = ""
user_surname=""
  user!: {
    username: string;
    password: string;
    token: string;
  };
  collapsed = input(false)

  menuItems = signal<MenuItem[]>([
    {
      icon:"dashboard",
      label:"dashboard",
      route:"dashboard"
    },
    {
      icon:"local_shipping",
      label:"products",
      route:"product-list"
    },
    {
      icon:"person",
      label:"users",
      route:"user-list"
    }
  ])

  constructor(){

    //current user subscription
    this.LoginService.currentUser.subscribe((data)=>{
      this.user = data
    })

    this.userService.getUsers()

    // users service subscription
    this.userService.users$.subscribe((users)=>{

      let user = users.filter((user)=>user.username==this.user.username)[0]//join current user with user from list;filter

      if(user){//check if not null
        this.user_name = user.name.firstname
        this.user_surname = user.name.lastname
      }
    
    })
  }


}
