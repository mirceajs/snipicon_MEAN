import {Component,OnInit,ViewChild,ComponentRef,ChangeDetectorRef} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {IconAssemblerService} from '../.././services/icon-assembler.service';
import { DomSanitizer } from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material';
import * as _ from 'underscore';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {SearchSelectionComponent} from './searchSelection.component'

@Component({
    selector: 'icon-search-result',
    templateUrl: './searchResult.component.html',
    styleUrls: ['./searchResult.component.scss']
})

export class SearchResultComponent implements OnInit {
@ViewChild(SearchSelectionComponent) private searchSelection :SearchSelectionComponent;   

 // private contentPlaceholder: ElementRef;

 /*@ViewChild('searchSelection') set content(content: ElementRef) {
    this.contentPlaceholder = content;
 }*/
  constructor(private iconAssembler:IconAssemblerService,private sanitizer: DomSanitizer,
              public toast : MatSnackBar,private apollo: Apollo, private activatedRoute: ActivatedRoute,
              private changeDetector : ChangeDetectorRef ) {
           }

  colorStops = ['#ff3300','#ffaa00','#77bb00','#0099ff','#A89361','#6361B9','#904eb1','#707070']//['#FF0054', '#16C226', '#3DE7FF','#FF9500','#988BD9','#2EF374','#333333','#707070'];
  IconList = [];
  selectedindex = null;
  loading = true;
  IconListRoot = [];
  products : any;
  palletGrad : any;
  _ref: ComponentRef<any>;
  _idx: number;

  ngOnInit() {
       let searchtext;
       let icnCount = {
                      id:'',
                      count:''
                    };
       let icnCountArray = []; 
       this.activatedRoute.params.subscribe((params: Params) => {
       searchtext = params['searchtext'];
       this.loading = true;
       this.getIcons(searchtext).subscribe(data =>{
       this.loading = false; 
       if(data)
         {
        this.iconAssembler.loadIcons(data).subscribe(icons=>{
        this.IconListRoot = icons;
        this.IconList = icons;
        this.generatePallet();
        let firstID = [];
        let tempicons = _.map(icons , function(icon){
        if(firstID.indexOf(icon.firstRegId)==-1){
              icnCount = {count:'',id:''}
              icnCount.id = icon.firstRegId;
              icnCount.count = (_.filter(icons,function(ic){return ic.firstRegId ==icon.firstRegId})).length;
              icnCountArray.push(icnCount);
              firstID.push(icon.firstRegId);
              return icon;
           }
         });
            tempicons = _.compact(tempicons);
            tempicons = _.map(tempicons,function(tmp){
            tmp.count =  _.first(_.filter(icnCountArray,function(icn){return icn.id==tmp.firstRegId})).count;
            return tmp;
            })
            this.IconList = tempicons;
            return icons;
        })     
      } 
      })
    });
  }
   
  getIcons(val:string):Observable<any> {
                      return Observable.create(observer => { this.apollo.watchQuery<any>({ 
                                  query: gql`
                                  query {
                                        icons:iconSearchResult(name:"${val}")
                                         {
                                             _id :ID , name: Name,firstRegId : FirstRegID,tags:Tags,graphicsType:GraphicsType,Source,viewBox:ViewBox,
                                             cssStyle:CssStyle{
                                                      name:Name,value:Body
                                                      },
                                                      IconCss,
                                                      Gradients{
                                                            def: Def
                                                      }     
                                                }
                                          }`,
                                  }).result().then(data => {
                                                   observer.next(data);
                                                   }, (error)=>{
                                                   this.loading = false;
                                                   this.openSnackBar(error,"red-snackbar")  
                                                   return null;
                                                   })
                                                   });
                                  }

  openSnackBar(msg,cls) {
      this.toast.open(msg, '', {
      duration: 2000,
      horizontalPosition: 'right',
      panelClass: [cls]
    });
  }
  
  transformHTML(cont) {
    return this.sanitizer.bypassSecurityTrustHtml(cont);
  }

   iconClicked(icon,index)
    {
    this.selectedindex = index;
    this.changeDetector.detectChanges();
    let selTwins$ = _.filter(this.IconListRoot, function(data){
    return data.firstRegId == icon.firstRegId;
     });
   // this.searchSelection.showPanel = false;
   
    this.searchSelection.selectIcon(selTwins$,icon.firstRegId);
    
    }

  generatePallet(){
    this.iconAssembler.generateGradient(this.colorStops).subscribe(products => {
    this.products = products;
    var n = 21;
    this.palletGrad = _.groupBy(this.products.grad, function(element, index){
      return Math.floor(index/n);
    });
    this.palletGrad = _.toArray(this.palletGrad); 
    this.iconAssembler.addStylesheetRules(this.palletGrad);
    });
  }
}