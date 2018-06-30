import { NgModule } from '@angular/core';
import { ROUTES } from './designercomponent.routes';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {DesignerComponent} from './component/designer.component';
import {UploadModule} from '.././common-ui/upload/upload.module';
import {IconAssemblerService} from '.././services/icon-assembler.service';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
//const uri = 'http://localhost:4000/icons';
const uri = 'http://35.171.8.196:4000/icons';

@NgModule({
  
  declarations: [
               DesignerComponent             
    ],
  /**
   * Import Angular's modules.
   */
  imports: [
      FormsModule,
      CommonModule,MatSnackBarModule,MatProgressSpinnerModule,
      UploadModule,ApolloModule,HttpLinkModule,
      RouterModule.forChild(ROUTES)
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [IconAssemblerService]
})
export class DesignerComponentModule {
  constructor(apollo: Apollo,httpLink: HttpLink){
    apollo.create({
       link: httpLink.create({ uri }),
       cache: new InMemoryCache(),
    });
  }
}
