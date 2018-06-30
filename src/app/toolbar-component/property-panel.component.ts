import { Component, AfterViewInit, OnDestroy, ComponentFactoryResolver, ViewChild, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ToolBar } from './toolbar-base';
import { ToolBarInterface } from './toolbar.interface';
import { PropertyPanelDirective } from './toolbar.directives';
import { ToolInjectionService } from './tool-injection.service';

@Component({
  selector: 'layout-property',
  template: `
    <!--  <ol [hidden]="!showPanel" (panelChanged)="pchange()" class="breadcrumb toolbar">
      <h6> Property Panel</h6>
        <div class="property-panel">
          <ng-template ProperyPanelHost></ng-template>
        </div>
      </ol>-->
      <div [hidden]="!showPanel">
        <ng-template ProperyPanelHost></ng-template>
      </div>
    `,
  styles: [`
   .toolbar {
      margin-top: 10px;
    }
  ` ]
})

export class PropertyPanelComponent implements AfterViewInit, OnDestroy {

  @ViewChild(PropertyPanelDirective) propertyHost: PropertyPanelDirective;
  tools: ToolBar;
  subscription: Subscription;
  showPanel = true;
  constructor(private toolbarService: ToolInjectionService, private componentFactoryResolver: ComponentFactoryResolver) {
    this.subscription = toolbarService.propertyPan$.subscribe(
      tools => {
        setTimeout(() => {
          this.tools = tools;
          this.loadComponent();
        });
      }, error => { console.log(error); }
    )
  }


  ngAfterViewInit() {
    this.loadComponent() ;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  pchange()
  {
    alert("changed");
  }

  loadComponent() {
    if (this.tools) {
      const toolBarItem = this.tools;
      const viewContainerRef = this.propertyHost.viewContainerRef;
      viewContainerRef.clear();
      if (toolBarItem.component !== String ) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(toolBarItem.component);
        const componentRef = viewContainerRef.createComponent(componentFactory);
        this.showPanel = true;
        (<ToolBarInterface>componentRef.instance).data = toolBarItem.data;
      } else {  this.showPanel = false; }
    }
  }

}
