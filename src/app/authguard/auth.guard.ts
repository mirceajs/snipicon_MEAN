import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthGuard implements CanActivate {
res : boolean;
  constructor(
    private router: Router,
    ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.checkToken()) {
            
          return true;
    }
         this.router.navigate(["/auth"]);
         return false;

       }

    checkToken()
    {
     let token = localStorage.getItem("SnipData");
     let tokenData= JSON.parse(token);
     return tokenData && tokenData.id && tokenData.userId && tokenData.userId.length > 0 ? true : false;
    }   
}
