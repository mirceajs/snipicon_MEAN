import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';
import { routes } from './auth.routes';
import { SignUpSignInComponent } from './email/signinsignup.component';
import { ResetComponent } from './email/reset.component';
import { AuthHomeComponent } from './home/home.component';
import { AuthComponent } from './auth.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(process.env.GOOGLE_CLIENT_ID)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(process.env.FACEBOOK_CLIENT_ID)
  }
]);

export function provideConfig() {
  return config;
}


console.log('Auth component loaded');

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    AuthComponent,
    SignUpSignInComponent,
    ResetComponent,
    AuthHomeComponent,
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,MatInputModule,
    MatSnackBarModule,
    FormsModule,
    SocialLoginModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ]
})

export class AuthModule {
  public static routes = routes;
}

