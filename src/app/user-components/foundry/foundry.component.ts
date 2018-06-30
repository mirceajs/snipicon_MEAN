import { Component, OnInit,ViewChild,ElementRef,ChangeDetectorRef} from '@angular/core';
import {IconAssemblerService} from '../.././services/icon-assembler.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'underscore';
import {MatSnackBar} from '@angular/material';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';


@Component({
    selector: 'si-foundry',
    templateUrl: './foundry.component.html',
    styleUrls: ['./foundry.component.scss']
})
export class FoundryComponent implements OnInit {
    @ViewChild('uploadPanel') private uploadPanel;
    @ViewChild('uploadblock') public uploadblock : ElementRef;
    @ViewChild('foundry') foundry:ElementRef;
    colorStops =  ['#FF3300','#FFaa00','#77BB00','#0099FF','#A89361','#6361B9','#904eb1','#707070']//['#FF0054', '#16C226', '#0099FF','#FF9500','#988BD9','#2EF374','#333333','#707070'];
    //colorStops = ['#ff1900','#069613','#0078C8','#FF9500','#f9f936','#2df2f2','#333333','#707070'];
    IconList = [];
    selectedindex = null;
    loading = true;
    foundryHeight;
    viewPortItems = [];
    IconListRoot = [];
    iconsPerPage = 0;
    products : any;
    palletGrad : any;
    constructor(private iconAssembler:IconAssemblerService,private sanitizer: DomSanitizer,
                 public toast : MatSnackBar,private apollo: Apollo, private changeDetector : ChangeDetectorRef) { }

    public ngOnInit() {
     this.foundryHeight =  this.foundry.nativeElement.offsetHeight - 50;
     this.iconsPerPage =  Math.ceil(this.foundry.nativeElement.offsetHeight/86) * Math.ceil(this.foundry.nativeElement.offsetWidth/72)
     this.loadIcons();  
    }
    
    loadmore(){
    console.log("nnn");
    this.iconsPerPage += this.iconsPerPage; 
    // this.changeDetector.detectChanges();
    }

    getiTems(v)
    {
      console.log(v);
    }

    uploadcompleted()
    {
      this.selectedindex = null;
      this.loadIcons();
    }
    
    public loadIcons()
    {
        let icnCount = {
          id:'',
          count:''
        };
        let icnCountArray = [];
        this.loading = true;
        let userId = JSON.parse(localStorage.getItem("SnipData")) && JSON.parse(localStorage.getItem("SnipData")).userId  ? JSON.parse(localStorage.getItem("SnipData")).userId  : null; 
        this.apollo.watchQuery<string>({
             query: gql`
                 query {
                   icons:dbIcons(id:"${userId}")
                      {  _id :ID , name: Name,firstRegId : FirstRegID,tags:Tags,graphicsType:GraphicsType,Source,viewBox:ViewBox,
                                             cssStyle:CssStyle{
                                                      name:Name,value:Body
                                                      },
                                                      IconCss,
                                                      Gradients{
                                                            def: Def
                                                      }     
                }
                                                    }
               `,
    }).refetch().then(data => {
        this.loading = false;
        if(data)
          {
        this.iconAssembler.loadIcons(data).subscribe(icons=>{
        this.IconListRoot = icons;
        this.IconList = icons;
        this.generatePallet();
        let firstID = [];
        let tempicons = _.map(icons , function(icon){
         
         
          if(firstID.indexOf(icon.firstRegId)==-1)
            {
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
          //  this.viewPortItems = tempicons;
            return icons;
        });
       this.openSnackBar("Icons Loaded Successfully","green-snackbar")  ;
          }
    }, (error) => {
       this.loading = false;
       this.openSnackBar(error,"red-snackbar")
      }
    )
    }
  
    openSnackBar(msg,cls) {
      this.toast.open(msg, '', {
      duration: 2000,
      horizontalPosition: 'right',
      panelClass: [cls]
    });
    }
    hidePanel(flag){
     if(flag)
      {
       this.selectedindex = -1;
       this.changeDetector.detectChanges();
       this.uploadPanel.openPanel(flag.name,flag.tag);
       this.uploadPanel.na
      }
      else
       this.selectedindex = null;
    }

    iconClicked(icon,index)
    {
    this.selectedindex = index;  
    this.changeDetector.detectChanges();
    this.uploadPanel.loadpanel = true;
    let selTwins$ = _.filter(this.IconListRoot, function(data){
    return data.firstRegId == icon.firstRegId;
     });
    this.uploadPanel.selectIcon(selTwins$,icon.firstRegId);
    window.location.hash = '#uploadblock'
    }

    transformHTML(cont) {
    return this.sanitizer.bypassSecurityTrustHtml(cont);
    }
    openPanel()
    {
      this.selectedindex = -1;
      this.changeDetector.detectChanges();
      this.uploadPanel.reset();
      this.uploadPanel.openPanel();
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