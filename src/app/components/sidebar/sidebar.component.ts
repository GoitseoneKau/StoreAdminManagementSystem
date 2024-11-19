import { Component, input, signal } from '@angular/core';
import { MatSidenavModule} from '@angular/material/sidenav'
import {MatListModule} from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLinkActive, RouterLink } from '@angular/router';

export interface MenuItem{
  icon:string,
  label:string,
  route:string
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass,MatSidenavModule,MatListModule,MatIconModule,NgFor,NgIf,RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
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


}
