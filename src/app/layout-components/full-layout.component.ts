import { Component,OnInit } from '@angular/core';
import { ToolInjectionService } from '.././toolbar-component/tool-injection.service';
@Component({
  template: `
  <div class="wrapper">
    <si-header (open)="openMenu($event)" (panelChanged)="pchange()" (close)="closeMenu($event)"></si-header>
    <si-sidebar [closed]="isMenuOpen" (close)="closeMenu($event)"></si-sidebar>
    <split direction="horizontal">
      <split-area [size]="25">
       <layout-property></layout-property>
      </split-area>
      <split-area [size]="75">
       
       <!--  <div class="promosearch">
          <icon-search></icon-search>
          </div> -->
        <!-- <div class="main-wrapper">-->
          <div class="main">
          <router-outlet (deactivate)='componentRemoved($event)'> </router-outlet>
          </div>
        <!--</div>-->
      </split-area>
    </split>
    <si-footer></si-footer>
  </div>
  `,
  styles :[`     .promosearch{
                 width: 100%;
                 max-width: 100%;
                 background-color: #ffffff; 
                 margin: 0px 10px 0px;
                 border-bottom: 3px solid #d4e1ec;
                 }

                :host ::ng-deep .promosearch input[type=text]
                {
                 max-width: 80%; 
                 border-bottom: none !important;
                 margin-bottom: 1px;
                }

                .main{
               /* margin :25px 0px 0px 0px !important;
                overflow-y:scroll;*/
                margin :0px !important;
                }
  `]
})
export class FullLayoutComponent implements OnInit {
  constructor(private toolbarService: ToolInjectionService){

  }
  
  ngOnInit() {
    this.toolbarService.clearPropertyPanel();
   }
  componentRemoved($event) {
    this.toolbarService.clearToolbar();
    this.toolbarService.clearPropertyPanel();
  }
  pchange()
  {
    alert("www");
  }
  public isMenuOpen: boolean = false;
  public openMenu(event: Event) {
    this.isMenuOpen = true;
  }
  
  public closeMenu(event: Event){
    this.isMenuOpen = false;
  }

}
