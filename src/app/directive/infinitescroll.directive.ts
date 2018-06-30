import { Directive, HostListener, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[infiniteScroll]'
})
export class InfiniteScrollDirective  {
 @Input() scrollThreshold = 400; // px

  constructor(private element: ElementRef) {}

  @Input('infiniteScroll') loadmore;

  @HostListener('scroll')
  public onScroll() {
   
    //directive for autoscroll --> 
    const scrolled = this.element.nativeElement.scrollTop;
    const scrollbtm = this.element.nativeElement.scrollHeight;
    const height = this.element.nativeElement.offsetHeight;
   console.log(scrolled,height,scrollbtm);
    // if we have reached the threshold and we scroll down
    if ((height + scrolled) == scrollbtm) {
       
      this.loadmore();
    }

  }

}