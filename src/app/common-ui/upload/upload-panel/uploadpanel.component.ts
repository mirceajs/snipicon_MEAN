import {Component,OnInit,ViewChild,Output,EventEmitter,ElementRef,Renderer} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'underscore';
import {Response} from '@angular/http';
import {UploadService} from '.././upload.service';
import {SIcon} from '.././model/sicon.model';
import { Observable } from 'rxjs/Observable';
import {MatSnackBar} from '@angular/material';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'upload-panel',
    templateUrl: './uploadpanel.component.html',
    styleUrls: ['./uploadpanel.component.scss'],
    /* animations: [
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

export class UploadPanelComponent implements OnInit {
    gliph :any = {};
    loadpanel = false;
    loading = false;
    Itags : any =[];
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
    @ViewChild('iconTags') private iconTags;
    @ViewChild('iconUpload') private iconUpload;
    @ViewChild('panel')  panel:ElementRef;
    @Output() uploadComplete = new EventEmitter();
    @Output() hidePanelEvent = new EventEmitter();
    images : any = [];
    userId;
    constructor(private sanitizer : DomSanitizer, private uploadService : UploadService, 
                public toast : MatSnackBar,private apollo:Apollo, public renderer: Renderer) {
      
     }

    iconclicked(gliphData)
     {
       
       if(gliphData && gliphData.source && gliphData.source.length > 0)
         {
          this.seltwin.source = gliphData.source;
          this.seltwin.iconType = gliphData.graphicsType;
        }
     } 
    
     openPanel(name?,tag?){
      if(name)
        this.iconName = name;
      if(tag)
        this.iconTags.addTags(tag);
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
    
    clearTag(){
      this.Itags =[];
      this.iconTags.addTags(this.Itags);
    }

    duplicate()
    {
     let val = {
       name: this.iconName,
       tag : this.iconTags.ngModel
     }; 
      this.uploadPanel = 'close';
      setTimeout(()=>{  
      this.hidePanelEvent.emit(val);
      },800);
    }

    hidePanel(){
      this.uploadPanel = 'close';
      this.prepareCleanAll();
      setTimeout(()=>{  
      this.hidePanelEvent.emit(false);
      },800);
       
    } 

    deleteIcon(iconData){
      this.gliphicon = _.filter(this.gliphicon, function(gliph){
                  if(gliph.graphicsType==iconData.iconType)
                    { gliph.source =''; gliph.id='';}
                     return gliph;
      })
      this.iconUpload.deleteIcon(iconData);
      this.seltwin =[];
    }  

    public ngOnInit() {
     this.userId = JSON.parse(localStorage.getItem("SnipData")) && JSON.parse(localStorage.getItem("SnipData")).userId  ? JSON.parse(localStorage.getItem("SnipData")).userId  : null;  
     this.images[0]="";  
     this.prepareCleanAll() ;
     this.clearTag();
    // this.seltwin.data = "assets/media/monitor-regular.svg"; 
    }

    public save(status){
      this.loading = true;
      let updateArray =[];
      this.gliphicon.forEach(gliph => {
      let innerData  = { id:'',source:'',name:'',graphicsType:'',tags:[''],firstRegId:'',IconState:'',UserId:''
      }; 
               if(gliph.source !== '') {
               innerData.id = gliph.id ? gliph.id :'';
               innerData.source=gliph.source;
               innerData.name = this.iconName;
               innerData.graphicsType=gliph.graphicsType;
               innerData.tags = gliph.tags ?gliph.tags : this.iconTags.tagsList;
               innerData.firstRegId= this.firstRegId;
               innerData.IconState= gliph.iconState;
               innerData.UserId= this.userId;
               updateArray.push(innerData);
               }
       });
         
         this.apollo.use('updateIcon').mutate({
         mutation :gql`
                   mutation updateIcons($updateArray:[ReqIcon]){
                    updateIcons(data:$updateArray){
                      Name
                    }
                    }` ,
                     variables: {
                     updateArray: updateArray 
                     }
                    }).subscribe(res=>{
                      this.openSnackBar("Success.. updated icons","green-snackbar");
                      this.prepareCleanAll();
                      this.clearTag();
                      this.uploadPanel = 'close';
                      this.loading =false;
                      this.uploadComplete.emit();
                    },
                    (error)=>{
                      this.loading = false;
                      this.openSnackBar(error,"red-snackbar");
                    })
    }

    selectIcon(selTwins$,firstRegId) {
    this.uploadPanel = 'open';  
    this.loadpanel = true;
    this.Itags =[];
    let graphicTypes = this.graphicTypes;
    let availableGTypes = [];
    let missingGTypes = [];
    this.firstRegId = firstRegId;
    this.iconName = selTwins$[0].name;
    //tags[0] is temporary need to change as service changes......
    let iconTags  = selTwins$[0].tags ? selTwins$[0].tags :[];
    iconTags.forEach(tg =>{
      this.Itags.push(tg);
    });
    this.iconTags.addTags(this.Itags);
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

  public reset()
  {
    this.prepareCleanAll();
    this.clearTag();
  }
    public setRegId(id) {
    
      if (this.firstRegId === '') 
          this.firstRegId = id;
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
