import { NgModule } from '@angular/core';
import { ROUTES } from './usercomponent.routes';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {FoundryComponent} from './foundry/foundry.component';
import {ProjectComponent} from './project/project.component';
import {ProjectDetailsComponent} from './project/projectdetails.component';
import {VaultComponent} from './vault/vault.component';
import {UploadModule} from '.././common-ui/upload/upload.module';
import {IconAssemblerService} from '.././services/icon-assembler.service';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ToolbarComponentModule} from '.././toolbar-component/toolbarcomponent.module';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatExpansionModule} from '@angular/material/expansion';
import {InfiniteScrollDirective} from '.././directive/infinitescroll.directive';
//import { VirtualScrollModule } from 'angular2-virtual-scroll';
//import {LayoutModule} from '.././layout-components/layout.module';
//const uri = 'http://localhost:4000/icons';
const uri = 'http://35.171.8.196:4000/icons';
//const projecturi = 'http://localhost:4000/project';
const projecturi = 'http://35.171.8.196:4000/project';
//const seturi = 'http://localhost:4000/set';
const seturi = 'http://35.171.8.196:4000/set';
//const iconset = 'http://localhost:4000/iconset';
const iconset = 'http://35.171.8.196:4000/iconset';

@NgModule({
  
  declarations: [
               FoundryComponent,ProjectComponent,VaultComponent,ProjectDetailsComponent,InfiniteScrollDirective              
    ],
  /**
   * Import Angular's modules.
   */
  imports: [
      FormsModule,MatSelectModule,MatFormFieldModule,
      CommonModule,MatSnackBarModule,MatProgressSpinnerModule,MatExpansionModule,
      UploadModule,ApolloModule,HttpLinkModule,ToolbarComponentModule,
      RouterModule.forChild(ROUTES)
  ],
   
  // exports:[VaultComponent],
  // entryComponents: [VaultComponent],
   /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [IconAssemblerService]
})
export class UserComponentModule {
  constructor(apollo: Apollo,httpLink: HttpLink){
    console.log(uri)
    apollo.create({
       link: httpLink.create({ uri }),
       cache: new InMemoryCache(),
    });
    apollo.create({
       link: httpLink.create({ uri:projecturi }),
       cache: new InMemoryCache(),
    },'project');
      apollo.create({
       link: httpLink.create({ uri:seturi }),
       cache: new InMemoryCache(),
    },'set');  
   apollo.create({
       link: httpLink.create({ uri :iconset }),
       cache: new InMemoryCache(),
    },'iconset');
  }
}
