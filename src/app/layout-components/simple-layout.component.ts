import { Component } from '@angular/core';

@Component({
  template: `
       <si-header (open)="openMenu($event)" (close)="closeMenu($event)"></si-header>
      <si-sidebar [closed]="isMenuOpen" (close)="closeMenu($event)"></si-sidebar>
     <split direction="horizontal">
    <split-area [size]="100">
    
          <div class="main pull-right">
            <router-outlet> </router-outlet>
          </div>
    
  </split-area>
    </split>
    <si-footer></si-footer>
   `,
  styles : [`
  :host ::ng-deep .main-wrapper{
	  width : 100%;
  },
  
  `],
  /*kiran - As per the route config simple-layout component is used for cold state(not logged in user scenario) hence replacing the main layout by removing the left panel in the case*/ 
})
export class SimpleLayoutComponent {
   public isMenuOpen: boolean = false;
   public openMenu(event: Event) {
    this.isMenuOpen = true;
  }

  public closeMenu(event: Event){
    this.isMenuOpen = false;
  }
}