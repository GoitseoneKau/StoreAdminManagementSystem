import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { isPlatformBrowser } from '@angular/common';


export const authguard: CanActivateFn = (route, state) => {
  
  const loginService = inject(LoginService)
  const router = inject(Router)
  const platformId = inject(PLATFORM_ID)
  
  if(isPlatformBrowser(platformId)){

    if (loginService.isLoggedIn()) {
      return true;
    }

    router.navigate(["login"])//if false reroute
    
    return false;
  }

  return false;
};
