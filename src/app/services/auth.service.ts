import { Injectable,Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import { CognitoCallback, CognitoUtil } from './cognito.service';
import { AuthService, SocialUser } from "angularx-social-login";
import { Router} from '@angular/router';
import { CognitoUserAttribute, AuthenticationDetails, CognitoUser, CognitoUserSession, } from "amazon-cognito-identity-js";


@Injectable()
export class AuthServiceSnip {
 
 constructor( @Inject(CognitoUtil) public cognitoUtil: CognitoUtil, private router: Router) { //,@Inject(AuthService) public auth: AuthService) {
  }

   
    register(user) : Observable<any> { 
        let attributeList = [];
        let dataEmail = {
            Name: 'email',
            Value: user.email
        };
        attributeList.push(new CognitoUserAttribute(dataEmail));
        return  Observable.create(observer => {  this.cognitoUtil.getUserPool().signUp(user.email, user.password, attributeList, null,
        (err, result)=>{
            if (err) {
                 observer.next(err);
               // callback.cognitoCallback(err.message, null);
            } else {
                 observer.next(result);
              //  callback.cognitoCallback(null, result);
            }
        })
      });

    }
    
    
    login(user): Observable<any> {

        let res;
        let idtkn;
         let rsp = {
                 id:null,
                 userId:null,
                 ttl:0,
                 created:null,
                 scopes:null,
                 loginType:null,
                 rememberMe:null,
                 email:null,
                 role:null
                 };


        let authenticationDetails = new AuthenticationDetails({
            Username: user.email,
            Password: user.password
        });
        
        let userData = {
            Username: user.email,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

   return Observable.create(observer => { cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
             idtkn = result.getIdToken();
             rsp.id = result.getAccessToken().getJwtToken();
             res = result.getAccessToken();
             rsp.userId = res && res.payload && res.payload.username ? res.payload.username : "";
             let role = res && res.payload && res.payload['cognito:groups'] ? res.payload['cognito:groups']  : null;
             rsp.role = role && role.length > 0 ? role.indexOf('Admin') > -1 ? 'admin':role.indexOf('Designer') > -1 ?'designer':role.indexOf('Users') > -1 ?'user':null : null;
             rsp.ttl = res && res.payload && res.payload.auth_time ? parseInt(res.payload.auth_time) : 0;
             rsp.created =  res && res.payload && res.payload.auth_time ? res.payload.auth_time : "";
             rsp.email = idtkn && idtkn.payload && idtkn.payload.email ? idtkn.payload.email :'';
             rsp.loginType = "email";
             observer.next(rsp);
                  
      },
              onFailure: err => {
                  observer.next(err);
              },

        });
   });
    }

    setToken(rsp:any)
    {   
    }
    forgotPassword(email: string, callback: CognitoCallback) {
        let userData = {
            Username: email,
            Pool: this.cognitoUtil.getUserPool()
        };
        let cognitoUser = new CognitoUser(userData);
        cognitoUser.forgotPassword({
            onFailure: err => callback.cognitoCallback(err.message, null),
            onSuccess: result => callback.cognitoCallback(null, result),
            inputVerificationCode() {
            callback.cognitoCallback(null, null);
            }
        });
    }

    confirmNewPassword(email: string, verificationCode: string, password: string, callback: CognitoCallback) {
        let userData = {
            Username: email,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmPassword(verificationCode, password, {
            onSuccess: () => {
                callback.cognitoCallback(null, null);
            },
            onFailure:  (err) => {
                callback.cognitoCallback(err.message, null);
            }
        });
    }

    
    logout() {
      let token = localStorage.getItem("SnipData");
      let tokenData = JSON.parse(token);
      if(tokenData)
        {
      if(tokenData.loginType!="email")  
        console.log("");
       // this.auth.signOut();
      else 
        this.cognitoUtil.getCurrentUser().signOut();
        localStorage.removeItem("SnipData");
        this.router.navigate(["home"]);
        }
    }

    getToken(): any
    {
         var userPool = this.cognitoUtil.getUserPool();
         var cognitoUser = userPool.getCurrentUser();
         if (cognitoUser != null) {
             cognitoUser.getSession(function(err, session) {
               if(err)
                return null
               else
                return session.getJwtToken(); 
            });
         }
     

    }

    getCurrentUser() :Observable<any>
    {
         var userPool = this.cognitoUtil.getUserPool();
         var cognitoUser = userPool.getCurrentUser();
         if (cognitoUser != null) {
             return Observable.create(observer => { cognitoUser.getSession(function(err, session) {
                if (err) {
                    
                 observer.next(err);
                  
            }
              session.roles = {assigned:["user", "master"],unassigned:["admin", "master"]};
              console.log(session);
               observer.next( session);
             
            });
           //observer.complete();    
        });
        }
    }
    
    updatePassword(userdata): Observable<any> {
      return  Observable.create(observer => { 
          this.cognitoUtil.updatePassword(userdata).subscribe(data =>{
               observer.next(data);
          },error =>{
               observer.next(error);
          })
      });
    }

    getUserinfo(email: string) : Observable<any>
    {
         let userData = {
            Username: email,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);
        return Observable.create(observer => {cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
            observer.next(err);
         
        }
        for (let i = 0; i < result.length; i++) {
            console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
        }
        observer.next(result);
    })});
    }



    checkUserExists(user, callback: CognitoCallback) {
      /*  let pool = 
        this.cognitoUtil.getUserPool().getUser(user.email, (err, result) => {
         console.log(err, result);
           if(err) {
                 callback.cognitoCallback(err.message, null);
             }else {
                    // pass email instead of text
                    callback.cognitoCallback(null, 'user exists');
            }
        });*/
    }

    // confirmRegistration(email: string, confirmationCode: string, callback: CognitoCallback): void {

    //     let userData = {
    //         email: email,
    //         Pool: this.cognitoUtil.getUserPool()
    //     };

    //     let cognitoUser = new CognitoUser(userData);

    //     cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
    //         if (err) {
    //             callback.cognitoCallback(err.message, null);
    //         } else {
    //             callback.cognitoCallback(null, result);
    //         }
    //     });
    // }


}

