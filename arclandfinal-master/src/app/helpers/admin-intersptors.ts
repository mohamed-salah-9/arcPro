import { AdminsService } from '../services/admins.service';
import{Admin} from '../models/admins';
import{HttpInterceptor, HttpRequest,HttpHandler} from '@angular/common/http';
import{Injectable} from '@angular/core';
 @Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private AdminsService:AdminsService){}
        intercept(req: HttpRequest<any>, next: HttpHandler){
            const AuthToken= this.AdminsService.getToken();
            const authRequest = req.clone({
                headers:req.headers.set('Authorization','Bearer '+ AuthToken)
          
            })
 
            return next.handle(authRequest)


        }
}