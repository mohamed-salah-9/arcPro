import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from "rxjs";

import { AdminsService } from '../services/admins.service';
import { Admin } from '../models/admins';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  
    constructor(
        private router: Router,
        private AdminsService: AdminsService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
         if (localStorage.getItem('token'   )) {
            return true;
            
          }
      
          this.router.navigate(['/login']);
          return false;
        }
    // canActivate(
    //   route: ActivatedRouteSnapshot,
    //   state: RouterStateSnapshot
    // ): boolean | Observable<boolean> | Promise<boolean> {
    //   const isAuth = this.AdminsService.getIsAuth();
    //   if (!isAuth) {
    //     this.router.navigate(['/login']);
    //   }
    //   return isAuth;
    // }
  }
