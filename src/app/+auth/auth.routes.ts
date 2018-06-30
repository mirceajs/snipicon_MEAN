import { SignUpSignInComponent } from './email/signinsignup.component';
import { ResetComponent } from './email/reset.component';
import { AuthHomeComponent } from './home/home.component';
import { AuthComponent } from './auth.component';

//import { SignUpSuccessComponent } from './signup/signup-success.component';

export const routes = [
  { path: '', 
    component: AuthComponent,
    children: [
      { path: '', component: AuthHomeComponent },
      { path: 'signin', component: SignUpSignInComponent },
      { path: 'signup', component: SignUpSignInComponent },
      { path: 'forgot', component: ResetComponent },
      // { path: '', component:  }
  ]},
];
