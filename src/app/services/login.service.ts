import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '../models/user';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public user:User | undefined |null
  private readonly platformId = inject(PLATFORM_ID);

  constructor() { }

  checkStorage(){

    if(isPlatformBrowser(this.platformId)){ 
      const userData = localStorage.getItem("user")
      if(userData){
        this.user = JSON.parse(userData)
      }else{
        this.user = null
      }
    }
    
  }

  

  login(user:User){
    if(isPlatformBrowser(this.platformId)){ 
      localStorage.setItem("user",JSON.stringify(user))
      this.checkStorage()
    }
  }

  isLoggedIn(){
    if(isPlatformBrowser(this.platformId)){ 
      this.checkStorage()
    }
    return this.user !==null
  }

  logout(){
    if(isPlatformBrowser(this.platformId)){ 
      if(!this.isLoggedIn()){return}
      localStorage.clear()
      this.checkStorage()
    }
  }
}
