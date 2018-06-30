import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FooterComponent } from './footer.component';
import { FullLayoutComponent} from './full-layout.component';
import { HeaderComponent} from './header.component';
import { SideBarComponent} from './sidebar.component';
import { SimpleLayoutComponent} from './simple-layout.component'
import { AngularSplitModule } from 'angular-split';
import {SearchModule} from '.././common-ui/search/search.module';
import {ToolbarComponentModule} from '.././toolbar-component';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    SideBarComponent,
    SimpleLayoutComponent,
    FullLayoutComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    AngularSplitModule,
    SearchModule,ToolbarComponentModule
    ],
 
})

export class LayoutModule {
  
}

