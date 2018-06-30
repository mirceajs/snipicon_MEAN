import { Component, AfterViewInit, OnDestroy, ComponentFactoryResolver, ViewChild, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ToolBar } from './toolbar-base';
import { ToolBarInterface } from './toolbar.interface';
import { ToolBarDirective } from './toolbar.directives';
import { ToolInjectionService } from './tool-injection.service';

@Component({
  selector: 'layout-toolbar',
  template: `
  <div class="subheader">
    <div class="subheader-contributor" [hidden]="!showPanel">
       <ng-template ToolBarHost></ng-template>
    </div>
  </div>
    `,
  styles: [`
   .toolbar {
      margin: 0;
    }
  ` ]
})

export class ToolBarPanelComponent implements AfterViewInit, OnDestroy {

  @ViewChild(ToolBarDirective) toolbarHost: ToolBarDirective;
  tools: ToolBar;
  subscription: Subscription;
  showPanel = true;

  constructor(private toolbarService: ToolInjectionService, private componentFactoryResolver: ComponentFactoryResolver) {
    this.subscription = toolbarService.toolbar$.subscribe(
      tools => {
        setTimeout(() => {
          this.tools = tools;
          this.loadComponent();
        });
      }, error => { console.log(error); }
    )
  }


  ngAfterViewInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadComponent() {
    if (this.tools) {
      const toolBarItem = this.tools;
      const viewContainerRef = this.toolbarHost.viewContainerRef;
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
