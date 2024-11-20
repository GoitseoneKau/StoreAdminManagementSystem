import { Component, computed, inject, input, model, signal } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar'
import { MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule,MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  //service injections
  loginService = inject(LoginService)
  router = inject(Router)
  //input/output variable/signal
  collapsed = model(false)

  collapse(){
    //set collapse signal to opposite
    this.collapsed.set(!this.collapsed())
  }

  logout(){
    //logout
    this.loginService.logout()
    //navigate to login page
    this.router.navigate(["login"],{replaceUrl:true})
  }
}
