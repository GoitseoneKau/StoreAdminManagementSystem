import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';

let loginService = inject(LoginService)
export const authguardGuard: CanActivateFn = (route, state) => {
  if (!loginService.isLoggedIn()) {
    return false;
  }
  return true;
};
