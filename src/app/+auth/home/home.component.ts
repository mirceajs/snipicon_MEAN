import { Component, OnInit } from '@angular/core';
import { AuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Router} from '@angular/router';
import { CognitoUtil } from 'app/services/cognito.service';

import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';
  
@Component({
    selector: 'si-auth-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class AuthHomeComponent implements OnInit {
    private user: SocialUser;
    private loggedIn: boolean;
    rsp = {
                 id:null,
                 userId:null,
                 ttl:0,
                 created:null,
                 scopes:null,
                 loginType:null,
                 rememberMe:null,
                 name:null,
                 email:null
    };
    constructor(private authService: AuthService, private congito: CognitoUtil, private router :Router) { }

    public ngOnInit() {
       /* this.authService.authState.subscribe((user) => {
            if(user && user.authToken)
          this.congito.saveSocialLogin(user.authToken, user.provider);
        });*/
    }

    public signInWithGoogle(): void {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(res =>
        {
         
            if(res && res.id)
            {
               // this.congito.saveSocialLogin(res.authToken,'Google');
                this.congito.addUserstoIdentity(res);
                this.rsp = {
                    id: res.idToken,
                    userId : res.id,
                    loginType:"gmail",
                    name:res.name,
                    email:res.email,
                    ttl:0,
                    rememberMe:null,
                    created:null,
                    scopes:null
                };
              localStorage.setItem("SnipData",JSON.stringify(this.rsp));
              this.router.navigate(['/sicon/project']);     
            }  
         
        })
    }

    public signInWithFB(): void {
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(res =>
        {
            console.log(res);
        })
    }

}