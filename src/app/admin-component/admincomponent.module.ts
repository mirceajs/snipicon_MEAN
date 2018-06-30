import { NgModule } from '@angular/core';
import { ROUTES } from './admincomponent.routes';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {AdminComponent} from './component/admin.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CognitoUtil} from '.././services/cognito.service';
import {MatInputModule} from '@angular/material/input';
import { MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';


//const uri = 'http://localhost:4000/icons';
const uri = 'http://35.171.8.196:4000/icons';

@NgModule({
  
  declarations: [
               AdminComponent             
    ],
  /**
   * Import Angular's modules.
   */
  imports: [
      FormsModule,MatInputModule,MatTableModule,CdkTableModule,
      CommonModule,MatSnackBarModule,MatProgressSpinnerModule,
      RouterModule.forChild(ROUTES)
  ],
    exports:[AdminComponent],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [CognitoUtil]
})
export class AdminComponentModule {
 
}
