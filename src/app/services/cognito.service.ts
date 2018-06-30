
import { Injectable } from "@angular/core";
import  { CognitoIdentityCredentials,CognitoIdentityServiceProvider,config,CognitoSync } from "aws-sdk";
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from "amazon-cognito-identity-js";
import { Observable } from 'rxjs/Observable';
import  "amazon-cognito-js";
import * as AWS from "aws-sdk";

export interface CognitoCallback {
    cognitoCallback(message: string, result: any): void;

    handleMFAStep?(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void;
}

export interface LoggedInCallback {
    isLoggedIn(message: string, loggedIn: boolean): void;
}

export interface ChallengeParameters {
    CODE_DELIVERY_DELIVERY_MEDIUM: string;

    CODE_DELIVERY_DESTINATION: string;
}

export interface Callback {
    callback(): void;

    callbackWithParam(result: any): void;
}


@Injectable()
export class CognitoUtil {
    private poolData: any = {
        UserPoolId : process.env.USER_POOL_ID, // Your user pool id here
        ClientId : process.env.CLIENT_ID // declared in environment
    };
    private userPool: any;  
    getUserList():Observable<any>
    {
     var params = {
     IdentityPoolId: 'us-east-1:aebc85c4-9859-4102-9ff4-ad1765537265',
     MaxResults: 60, /* required */
    };
    var poolparams = {
        DatasetName:'UserInfo',IdentityPoolId:'us-east-1:aebc85c4-9859-4102-9ff4-ad1765537265',IdentityId:''
    };
    let userDetails = [];
    let pool = new  AWS.CognitoSync({accessKeyId:'AKIAIO3FXA5WUSH3QJMQ',secretAccessKey:'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', region:'us-east-1'}); 
    let cident = new AWS.CognitoIdentity({accessKeyId:'AKIAIO3FXA5WUSH3QJMQ',secretAccessKey:'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', region:'us-east-1'})
    let util = new CognitoIdentityServiceProvider({ accessKeyId:'AKIAIO3FXA5WUSH3QJMQ',secretAccessKey:'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', region:'us-east-1'} );
     
    return  Observable.create(observer => {  
        cident.listIdentities(params, function(err, data) {
        if (data && data.Identities) {
            data.Identities.forEach(identity =>{
            let val = {};    
            poolparams.IdentityId =  identity.IdentityId;
            pool.listRecords(poolparams,function(err, data){
               if(data && data.Records)
              {
                val =  data.Records[0] && data.Records[0].Value ? JSON.parse(data.Records[0].Value) : null;
                userDetails.push(val);
              }
        });
       })
      }}), util.listUsers({

          UserPoolId : process.env.USER_POOL_ID,
          AttributesToGet:["email"]
        }, function (err, list) {
            if (err) {
                    console.log("CognitoUtil: Can't set the credentials:" + err);
                     observer.next(err);
                }
            else {
                     console.log(list.Users);
                   
                  }  
    })
    console.log(userDetails);
  })
}
 updatePassword(userdata): Observable<any> {
    let util = new CognitoIdentityServiceProvider({ accessKeyId:'AKIAIO3FXA5WUSH3QJMQ',secretAccessKey:'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', region:'us-east-1'} );
    let userinfo = {
        ClientId:'4l5crr7qpop275k0qu5sfmimd7',
        ConfirmationCode: userdata.verificationcode,
        Password:userdata.password,
        Username:userdata.email
    }
    return  Observable.create(observer => { 
    util.confirmForgotPassword(userinfo,function(err,data){
        if(err)
             observer.next({error :err});
         
        else
             observer.next(data);
    }) 
    });
    }
  getUserPool() {
       return new CognitoUserPool(this.poolData);
    }

    getCurrentUser() {
        return this.getUserPool().getCurrentUser();
    }

    saveSocialLogin(token: string, type: string) {
        
        let creds = {
            IdentityPoolId: process.env.USER_POOL_ID, //'us-east-1:aebc85c4-9859-4102-9ff4-ad1765537265',
            Logins: {
            }
        };
        if(type == 'FACEBOOK') {
            creds.Logins['graph.facebook.com'] = token
        }
        else {
            creds.Logins['accounts.google.com'] = token
        }
       //  new CognitoIdentityCredentials(creds);
    }
    
    addUserstoIdentity(response)
    {
    
      AWS.config.region = 'us-east-1';
      AWS.config.credentials = new CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:aebc85c4-9859-4102-9ff4-ad1765537265',
      Logins: {
   /* 'graph.facebook.com': 'FBTOKEN',
    'www.amazon.com': 'AMAZONTOKEN',*/
    'accounts.google.com': response.idToken,
   //'login.provider.com': response.authToken
   /* 'api.twitter.com': 'TWITTERTOKEN',
    'www.digits.com': 'DIGITSTOKEN'*/
  },

     });
  /* (<CognitoIdentityCredentials> AWS.config.credentials).get((err)=>{
     let syncClient =  new AWS.CognitoSyncManager();
     syncClient.openOrCreateDataset('UserInfo', function(err, dataset) {
     console.log(dataset);
     console.log(response.photourl);
     dataset.get('userdata', function(err, value) {
        if(!value) 
          {
            let data = {
                token : response.authToken,
                email : response.email,
                id : response.id,
                name : response.name,
                photo : response.photourl,
                provider: response.provider,
                role:'User'
            }    
             dataset.put('userdata',JSON.stringify(data), function(err, record) {
             dataset.synchronize({
          	    onSuccess: function(data, newRecords) {
		                 console.log(data, newRecords);
	        }
            });
            })}
        });
    })
  })*/
} 
    


    // This method takes in a raw jwtToken and uses the global AWS config options to build a
    // CognitoIdentityCredentials object and store it for us. It also returns the object to the caller
    // to avoid unnecessary calls to setCognitoCreds.
    // buildCognitoCreds(idTokenJwt: string) {
    //     let url = 'cognito-idp.' + CognitoUtil._REGION.toLowerCase() + '.amazonaws.com/' + CognitoUtil._USER_POOL_ID;
    //     if (environment.cognito_idp_endpoint) {
    //         url = environment.cognito_idp_endpoint + '/' + CognitoUtil._USER_POOL_ID;
    //     }
    //     let logins: CognitoIdentity.LoginsMap = {};
    //     logins[url] = idTokenJwt;
    //     let params = {
    //         IdentityPoolId: CognitoUtil._IDENTITY_POOL_ID, /* required */
    //         Logins: logins
    //     };
    //     let serviceConfigs = <awsservice.ServiceConfigurationOptions>{};
    //     if (environment.cognito_identity_endpoint) {
    //         serviceConfigs.endpoint = environment.cognito_identity_endpoint;
    //     }
    //     let creds = new AWS.CognitoIdentityCredentials(params, serviceConfigs);
    //     this.setCognitoCreds(creds);
    //     return creds;
    // }


    // getCognitoIdentity(): string {
    //     return this.cognitoCreds.identityId;
    // }

    // getAccessToken(callback: Callback): void {
    //     if (callback == null) {
    //         throw("CognitoUtil: callback in getAccessToken is null...returning");
    //     }
    //     if (this.getCurrentUser() != null) {
    //         this.getCurrentUser().getSession(function (err, session) {
    //             if (err) {
    //                 console.log("CognitoUtil: Can't set the credentials:" + err);
    //                 callback.callbackWithParam(null);
    //             }
    //             else {
    //                 if (session.isValid()) {
    //                     callback.callbackWithParam(session.getAccessToken().getJwtToken());
    //                 }
    //             }
    //         });
    //     }
    //     else {
    //         callback.callbackWithParam(null);
    //     }
    // }

    // getIdToken(callback: Callback): void {
    //     if (callback == null) {
    //         throw("CognitoUtil: callback in getIdToken is null...returning");
    //     }
    //     if (this.getCurrentUser() != null)
    //         this.getCurrentUser().getSession(function (err, session) {
    //             if (err) {
    //                 console.log("CognitoUtil: Can't set the credentials:" + err);
    //                 callback.callbackWithParam(null);
    //             }
    //             else {
    //                 if (session.isValid()) {
    //                     callback.callbackWithParam(session.getIdToken().getJwtToken());
    //                 } else {
    //                     console.log("CognitoUtil: Got the id token, but the session isn't valid");
    //                 }
    //             }
    //         });
    //     else
    //         callback.callbackWithParam(null);
    // }

    // getRefreshToken(callback: Callback): void {
    //     if (callback == null) {
    //         throw("CognitoUtil: callback in getRefreshToken is null...returning");
    //     }
    //     if (this.getCurrentUser() != null)
    //         this.getCurrentUser().getSession(function (err, session) {
    //             if (err) {
    //                 console.log("CognitoUtil: Can't set the credentials:" + err);
    //                 callback.callbackWithParam(null);
    //             }

    //             else {
    //                 if (session.isValid()) {
    //                     callback.callbackWithParam(session.getRefreshToken());
    //                 }
    //             }
    //         });
    //     else
    //         callback.callbackWithParam(null);
    // }

    // refresh(): void {
    //     this.getCurrentUser().getSession(function (err, session) {
    //         if (err) {
    //             console.log("CognitoUtil: Can't set the credentials:" + err);
    //         }

    //         else {
    //             if (session.isValid()) {
    //                 console.log("CognitoUtil: refreshed successfully");
    //             } else {
    //                 console.log("CognitoUtil: refreshed but session is still not valid");
    //             }
    //         }
    //     });
    // }
}
