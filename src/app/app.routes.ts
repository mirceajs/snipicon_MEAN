import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';
import {FullLayoutComponent} from './layout-components/full-layout.component';
import {SimpleLayoutComponent} from './layout-components/simple-layout.component';
import { AuthGuard } from './authguard/auth.guard';
import {DocumentationComponent} from './common-ui/documentation/document.component';
import {SearchResultComponent} from './common-ui/search/searchResult.component';
import {HomeDemoComponent}  from './home/homeDemo.component';
export const ROUTES: Routes = [

   {
      path: '', component: SimpleLayoutComponent, children: [
      { path: '', component:HomeComponent },
      { path: 'home', component:HomeComponent },
      { path: 'auth', loadChildren: './+auth#AuthModule'},
      { path :'documents', component:DocumentationComponent},
      { path :'searchresultcold/:searchtext', component:SearchResultComponent},
      {path :'demo',component:HomeDemoComponent}
      //  { path: '**',   component: NoContentComponent },
      ]
  },
  {
       path: '', canActivate: [AuthGuard], component: FullLayoutComponent, children: [
       { path: 'sicon', loadChildren: './user-components#UserComponentModule'}, 
       { path :'searchresult/:searchtext', component:SearchResultComponent},
       { path :'designer', loadChildren: './designer-component#DesignerComponentModule'},
       { path :'dashboardadmin', loadChildren: './admin-component#AdminComponentModule'}
    ]
    }
   
];
