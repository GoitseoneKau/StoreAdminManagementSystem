import { NgIf } from '@angular/common';
import { MatDrawer, MatDrawerMode, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Component, signal, ViewChild, computed, HostListener, afterNextRender } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports:[HeaderComponent,SidebarComponent,MatSidenav, MatSidenavModule,RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  widthOne = signal("65px")
  widthTwo = signal("160px")

  collapse = signal(true)
  open = signal(true)

  sideNavWidth = computed(()=> this.collapse() ? this.widthOne():this.widthTwo())


  mode = signal<MatDrawerMode>("side")
  modeChange = computed<MatDrawerMode>(():MatDrawerMode=>"side")

  screenWidth = signal(0);

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
  
      this.screenWidth.set(window.innerWidth)

      if(this.screenWidth()<=650){
        this.modeChange =computed<MatDrawerMode>(():MatDrawerMode=>!this.collapse() ? "side":"over")
        this.widthOne.set("160px")
        this.widthTwo.set("0px")
        this.collapse.set(false)
      }if(this.screenWidth()>650){
        this.widthTwo.set("65px")
        this.widthOne.set("160px")
        this.collapse.set(true)
        this.modeChange =computed<MatDrawerMode>(():MatDrawerMode=>"side")
      }
  }

  constructor() {
    afterNextRender(() => 
      this.getScreenSize()
    );
  }


}
