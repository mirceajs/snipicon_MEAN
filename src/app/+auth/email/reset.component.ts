import { Component, OnInit } from '@angular/core';
import { CognitoCallback } from 'app/services/cognito.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceSnip } from 'app/services/auth.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'si-reset-form',
    templateUrl: './reset.component.html',
     styles :[`
              :host ::ng-deep .mat-form-field-infix{
             width:240px},

             .updateForm{
                 margin-top:30px;
             }
`]
})

export class ResetComponent implements OnInit, CognitoCallback {
    
    public form: FormGroup;
    public updatePassword;
    public resetPassword: boolean = false;
   
    constructor(
        public authService: AuthServiceSnip, 
        private fb: FormBuilder,
        public toast : MatSnackBar,
        private route: ActivatedRoute,
        private router: Router) {
    }

    public ngOnInit() { 
        
        this.updatePassword = new FormGroup({
                             email : new FormControl('', [Validators.email,Validators.required]),
                             password : new FormControl('', [Validators.required,Validators.minLength(8)]),
                             verificationcode : new FormControl('', [Validators.required])
                          }) ;  
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    public return(){

        this.router.navigate(['/auth/signin']);
    }
    public updateData(form)
     {
      this.authService.updatePassword(form).subscribe(res=>{
         if(res && res.error)
             this.openSnackBar(res.error,"red-snackbar");
         else  {
             this.openSnackBar("Password changed.. Redirecting to Dashboard","green-snackbar"); 
             this.router.navigate(['/auth/signin']);
         }

      })
     }
    public reset(form){
        this.authService.forgotPassword(form.email, this);
    }
    openSnackBar(msg,cls) {
    this.toast.open(msg, '', {
      duration: 4000,
      horizontalPosition: 'right', 
      panelClass:[cls]
    //  extraClasses: [cls]
    });
    }
    public cognitoCallback(message: string, result: any) {
        if (message != null) { 
            this.form.get('email').setErrors({
                remote: 'email is not registered'
            });
        } else {
            //result.getAccessToken().getJwtToken()
            this.resetPassword = true;
           //this.router.navigate(['/user/profile']);
        }
    }
}