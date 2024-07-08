import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from './shared/services/localStorage.service';
import { inject } from '@angular/core';
import { CommonService } from './_core/services/common.service';
import { PublicRoutes } from './public/public.routes';

export const authGuard: CanActivateFn = (route, state) => {
  let shared=inject(LocalStorageService);
  let router=inject(Router);
  let token = shared.get('token');
  let service =inject(CommonService);
  if(!token){
    router.navigate([service.prepareRoute(PublicRoutes.Signin)]);
    return false;
  }
  return true;
};
