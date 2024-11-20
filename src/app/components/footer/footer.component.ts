import { CommonModule } from '@angular/common';
import { afterNextRender, Component, inject } from '@angular/core';
import { LoginService } from '../../services/login.service';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
 
  
  //get is loggedin variable from service
  isLoggedIn:boolean=false

  constructor( private loginService:LoginService){
      //get is loggedin variable from service
      this.loginService.isLoggedIn().subscribe(value=>this.isLoggedIn =value)
  }

 
}
