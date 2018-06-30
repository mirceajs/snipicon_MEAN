import { Directive, ViewContainerRef,HostListener } from '@angular/core';

@Directive({
  selector: '[ToolBarHost]',
})
export class ToolBarDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}


@Directive({
  selector: '[ProperyPanelHost]',
})
export class PropertyPanelDirective {
  constructor(public viewContainerRef: ViewContainerRef) { 
    console.log(viewContainerRef);
  }

@HostListener('mousedown', ['$event.target'])
  onchange(target) {
	    alert("Hi");
  }
  
  @HostListener('focusout', ['$event.target'])
  onFocusout(target) {
      alert("Hi");
    
  }
    @HostListener('click', ['$event']) onClick(e) {

  alert("Hiiiii");
  console.log(event);
}
}
