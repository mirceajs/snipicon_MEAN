import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthServiceSnip } from './services/auth.service';
import { CognitoUtil } from './services/cognito.service';
import {SearchModule } from './common-ui/search/search.module';
import {LayoutModule} from './layout-components';
import { environment } from '../environments/environment';
import { ROUTES } from './app.routes';
import {DocumentationComponent} from './common-ui/documentation/document.component'
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';
import '../styles/styles.scss';
import { FoundryService } from './services/foundry.service';
import { UserApi } from './services/user.service';
import { AuthGuard } from './authguard/auth.guard';
import {ToolInjectionService} from './toolbar-component/tool-injection.service'
import {ProjectModelComponent} from './general-components/project-model/project-model.component';
import {SettModelComponent}  from './general-components/set-model/set-model.component';
import {SetIconComponent}  from './general-components/set-icon/set-icon.component';
import {MatInputModule} from '@angular/material';

import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {HomeDemoComponent}  from './home/homeDemo.component';
//import {InfiniteScrollDirective} from './directive/infinitescroll.directive';
//import {VaultComponent} from './user-components/vault/vault.component';
//import {ToolbarComponentModule} from './toolbar-component'
// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];
//const uri = 'http://localhost:4000/project';
const uri = 'http://35.171.8.196:4000/project';
//const seturi = 'http://localhost:4000/set';
const seturi = 'http://35.171.8.196:4000/set';
//const iconuri = 'http://localhost:4000/icons';
const iconuri = 'http://35.171.8.196:4000/icons';
//const iconset = 'http://localhost:4000/iconset';
const iconset = 'http://35.171.8.196:4000/iconset';

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    HomeComponent,HomeDemoComponent,
    NoContentComponent,//InfiniteScrollDirective,
    DocumentationComponent,ProjectModelComponent,SettModelComponent,SetIconComponent
    ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,MatInputModule,ReactiveFormsModule,MatFormFieldModule,MatProgressSpinnerModule,
    BrowserAnimationsModule,MatSelectModule,MatSliderModule,MatCheckboxModule,
    FormsModule,
    HttpClientModule,ApolloModule,HttpLinkModule,
    SearchModule,
    LayoutModule,
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
    }),

    /**
     * This section will import the `DevModuleModule` only in certain build types.
     * When the module is not imported it will get tree shaked.
     * This is a simple example, a big app should probably implement some logic
     */
    //...environment.showDevModule ? [ DevModuleModule ] : [],
  ],
 entryComponents:[ProjectModelComponent,SettModelComponent,SetIconComponent],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    CognitoUtil,
    AuthServiceSnip,
    FoundryService,
    UserApi,
    environment.ENV_PROVIDERS,
    APP_PROVIDERS,
    AuthGuard,
    ToolInjectionService
    //IconAssemblerService
  ],

})
export class AppModule {

    constructor(apollo: Apollo,httpLink: HttpLink){
    apollo.create({
       link: httpLink.create({ uri }),
       cache: new InMemoryCache(),
    },'project'); 
    apollo.create({
       link: httpLink.create({ uri:seturi }),
       cache: new InMemoryCache(),
    },'set');
       apollo.create({
       link: httpLink.create({ uri :iconuri }),
       cache: new InMemoryCache(),
    },'icons');
     apollo.create({
       link: httpLink.create({ uri :iconset }),
       cache: new InMemoryCache(),
    },'iconset');
  }
  
}
