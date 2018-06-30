import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import {PropertyPanelComponent} from './property-panel.component';
import {ToolBarPanelComponent} from './toolbar-panel.component';
//import {ToolInjectionService} from './tool-injection.service';
import {ToolBarDirective} from './toolbar.directives';
import {PropertyPanelDirective} from './toolbar.directives';

@NgModule({
  
  declarations: [
                PropertyPanelComponent,ToolBarDirective,PropertyPanelDirective,
                ToolBarPanelComponent           
    ],
  /**
   * Import Angular's modules.
   */
  imports: [
      CommonModule
    ],
   exports:[PropertyPanelComponent,ToolBarDirective,PropertyPanelDirective,
                ToolBarPanelComponent] ,
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
 // providers: [ToolInjectionService]
})
export class ToolbarComponentModule {
 
}
