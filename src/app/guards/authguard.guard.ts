import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';


export const authguard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService)
  const router = inject(Router)
  if (loginService.isLoggedIn()) {
    return true;
  }
  router.navigate(["login"])//if false reroute
  return false;
};
