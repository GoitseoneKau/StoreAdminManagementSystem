import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LoginService } from '../../services/login.service';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  //inject service
  loginService = inject(LoginService)
  
  //get is loggedin variable from service
  isLoggedIn = this.loginService.isLoggedIn()
}
