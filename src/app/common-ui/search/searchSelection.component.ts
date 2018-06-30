import {Component,OnInit,ViewChild,Output,EventEmitter,ElementRef,Renderer} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'underscore';
import {Response} from '@angular/http';
import {SIcon} from '../upload/model/sicon.model';
import { Observable } from 'rxjs/Observable';
import {MatSnackBar} from '@angular/material';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'search-selection',
    templateUrl: './searchSelection.component.html',
    styleUrls: ['./searchSelection.component.scss']
   /*  animations: [
     trigger('grow', [
      state('open', style({ 'overflow': 'hidden' })),
      state('close', style({ 'overflow': 'hidden', height: '0px' })),
      transition('close => open', [style({ height: '0px' }), animate(500, style({ height: '*' }))
      ]),
      transition('open => close', [style({ height: '*' }), animate(500, style({ height: '0px' }))
      ])
    ]),
     ]*/
})

export class SearchSelectionComponent implements OnInit {
    gliph :any = {};
    loadpanel = false;
    Itags : any =[];
    showPanel = false;
    uploadPanel = 'close';
    seltwin :any = {};
    graphicTypes = ['REGULAR', 'FLAT', 'HD', 'MONO', 'LINEAR', 'MINI MONO'];
    iconName: string;
    gliphicon: SIcon[] = [];
    firstRegId: string;
    protected icnSizes = [
    'snipicon96',
    'snipicon64',
    'snipicon48',
    'snipicon24',
    'snipicon-',
    'snipicon16'
  ];
   // @ViewChild('iconTags') private iconTags;
  //  @ViewChild('iconUpload') private iconUpload;
   // @ViewChild('panel')  panel:ElementRef;
   // @Output() uploadComplete = new EventEmitter();
    //images : any = [];
    userId;
    constructor(private sanitizer : DomSanitizer, public toast : MatSnackBar,
	                                private apollo:Apollo, public renderer: Renderer) {
      
     }

    iconclicked(gliphData)
     {
       if(gliphData && gliphData.source && gliphData.source.length > 0)
         {
          this.seltwin.source = gliphData.source;
          this.seltwin.iconType = gliphData.graphicsType;
        }
     } 
    
     openPanel(){
     
      this.uploadPanel ="open";
      document.getElementById('upload').scrollIntoView();
      }

    openSnackBar(msg,cls) {
      this.toast.open(msg, '', {
      duration: 2000,
      horizontalPosition: 'right',
      panelClass: [cls]
    });
    }
    
    hidePanel(){
      this.uploadPanel = 'close';
      this.prepareCleanAll();
    
    } 

    public ngOnInit() {
     this.seltwin.source = null; 
      this.showPanel = false; 
     this.prepareCleanAll() ;
     // this.seltwin.data = "assets/media/monitor-regular.svg"; 
    }

    selectIcon(selTwins$,firstRegId) {
    this.seltwin.source = null;  
    this.uploadPanel = 'open';  
    this.showPanel = true; 
    this.loadpanel = true;
    this.Itags =[];
    let graphicTypes = this.graphicTypes;
    let availableGTypes = [];
    let missingGTypes = [];
    this.firstRegId = firstRegId;
    this.iconName = selTwins$[0].name;
    //tags[0] is temporary need to change as service changes......
    let iconTags  = selTwins$[0] && selTwins$[0].tags ? selTwins$[0].tags:[];
    iconTags.forEach(tg =>{
      this.Itags.push(tg);
    });
    console.log(this.Itags);
    //this.iconTags.addTags(this.Itags);
    availableGTypes = _.pluck(selTwins$,"graphicsType");
    missingGTypes = _.difference(graphicTypes,availableGTypes);
    missingGTypes.forEach(gt => {
    selTwins$.push(new SIcon({ name: '', iconState: '', graphicsType:gt,source:''}));
   });
   graphicTypes = _.invert(_.object(_.pairs(graphicTypes)));
   selTwins$ = _.sortBy(selTwins$, function(icon) { return graphicTypes[icon.graphicsType]; });
   this.gliphicon = [];
   selTwins$.forEach(gt => {
    let style;
    let iconStyleElement;
    let parser = new DOMParser();
    let doc = parser.parseFromString(gt.source, "image/svg+xml");  
    style = document.getElementById("palletStyle");
    if(style && style.sheet)
      {
       iconStyleElement = doc.getElementsByTagName("style")[0];
       if(iconStyleElement && iconStyleElement.sheet)
        {
        let styl =_.compact(_.filter(style.sheet.rules,function(obj){
                            return _.indexOf(gt.cssClass, obj.selectorText.replace(".",""))> -1 ? obj :null }));
        _.each(styl,function(rule){
               iconStyleElement.textContent +=" "+ rule && rule.cssText ? rule.cssText +"\n" :'';
        });
        }
      }
   this.gliphicon.push(new SIcon({ name: gt.graphicsType, id : gt.id ? gt.id:'' ,graphicsType: gt.graphicsType, source: gt.source && gt.source.length > 0 ?'data:image/svg+xml;base64,'+window.btoa(doc.documentElement.outerHTML):''}));
  
  });
   this.loadpanel = false;
  
  }

  public transform(url) {
     return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    
  public prepareCleanAll() {
    this.gliphicon = [];
    this.seltwin =[];
    this.Itags = [];
    this.iconName = '';
    this.firstRegId = '';
    this.graphicTypes.forEach(gt => {
    this.gliphicon.push(new SIcon({ name: this.iconName, iconState: 'new', graphicsType: gt, source: '' }));
    });
  }
   
}
