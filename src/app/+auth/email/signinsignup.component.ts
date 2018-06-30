import { Component, OnInit } from '@angular/core';
import { CognitoCallback } from 'app/services/cognito.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceSnip } from 'app/services/auth.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import {MatSnackBar} from '@angular/material';
@Component({
    selector: 'si-signup',
    templateUrl: './siginsignup.component.html',
    styles :[`
              .example-form {
  min-width: 150px;
  max-width: 500px;
  width: 100%;
}
.example-full-width
{
    margin-top:15px;
}
.example-full-width {
  width: 100%;
}
    `]
})



export class SignUpSignInComponent implements OnInit, CognitoCallback {
    public registrationUser: RegistrationUser;
    public form: FormGroup;
    public title: string = 'Sign Up';
    public action: string = 'signup';
    public loginForm;
    constructor(
        public toast : MatSnackBar,
        public authService: AuthServiceSnip, 
        private route: ActivatedRoute,
        private router: Router) {
        if(this.route.toString().includes('signin')) {
            this.title = 'Sign In';
            this.action = 'signin';
        };
    }
    public ngOnInit() { 
    this.loginForm = new FormGroup({
    email : new FormControl('', [Validators.email,Validators.required]),
    password : new FormControl('', [Validators.required,Validators.minLength(8)])
    }) ;  
    }

    openSnackBar(msg,cls) {
    this.toast.open(msg, '', {
      duration: 2000,
      horizontalPosition: 'right',
      panelClass: [cls]
    });
    }

    public register(form, action){
        if(action === 'signin') {
            this.authService.login(form).subscribe(res =>
            {
             if(res.id)
                {
              this.openSnackBar("Login success.. Redirecting to Dashboard","green-snackbar");
              localStorage.setItem("SnipData",JSON.stringify(res));
              if(res.role==='admin')
                 this.router.navigate(['/dashboardadmin']);
                else if(res.role==='designer')
                     this.router.navigate(['/designer']);
                    else
              this.router.navigate(['/sicon/project']);     
            }
             else
              this.openSnackBar(res.message,"red-snackbar");
            })
        }else {
            this.authService.register(form).subscribe(res =>{
               if(res.user && res.user.username)
                {
                  this.openSnackBar("Registration success.. Redirecting to Login page","green-snackbar");
                  this.router.navigate(['/auth']);
                }
                else
                 this.openSnackBar(res.message,"red-snackbar");   
            })
        }
    }

    public cognitoCallback(message: string, result: any) {
        if (message != null) { 
            this.form.get('email').setErrors({
                remote: message
            });
        } else {
            //result.getAccessToken().getJwtToken()
           this.router.navigate(['/user/profile']);
        }
    }

   
}