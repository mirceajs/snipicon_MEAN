import {Component,OnInit,ChangeDetectorRef,ElementRef,ViewEncapsulation} from '@angular/core';
import { fabric } from 'fabric';
import {Location} from '@angular/common'
import { Observable } from 'rxjs/Observable';
import { AppState } from '../app.service';
import {IconAssemblerService} from '.././services/icon-assembler.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'underscore';
import { Apollo } from 'apollo-angular';
import {HttpClient,HttpResponse,HttpRequest} from '@angular/common/http';
import gql from 'graphql-tag';
const url = 'http://localhost:4000/loadstyle/externalStyle.css';

@Component({
  /**
   * The selector is what angular internally uses
   * for `document.querySelectorAll(selector)` in our index.html
   * where, in this case, selector is the string 'home'.
   */
  selector: 'home',  // <home></home>
    
  /**
   * Our list of styles in our component. We may add more to compose many styles together.
   */
  styleUrls: [ './homeDemo.component.css'
               ],
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './homeDemo.component.html',
  encapsulation: ViewEncapsulation.None

})
export class HomeDemoComponent implements OnInit {

  loadAPI: Promise<any>;
  /**
   * Set our default values
   */
 // colorStops =  ['#FF3300','#FFaa00','#77BB00','#0099FF','#A89361','#6361B9','#904eb1','#707070']//['#FF0054', '#16C226', '#0099FF','#FF9500','#988BD9','#2EF374','#333333','#707070'];
  private _commonHeaders = new Headers({
    'Content-Type': 'application/json'
  });
  colorStops = ['#FF3300','#FFaa00','#77BB00','#0099FF','#A89361','#6361B9','#7C93B0','#707070'];
  pColorStops= ['#FF3300','#FFaa00','#77BB00','#0099FF','#A89361','#6361B9','#7C93B0','#707070'];
  pColorFlat =[];
  pColorRegular=[];
  pColorHD= [];
  pColorLinear =[];
  pColorMono =[];
  pColorMini = [];
  IconList = [];
  IconListRoot = [];
  processedimg='';
  canvas: any;
  pElement : ElementRef;
  context:any;
  selectedType = "REGULAR";
  firstID = [];
  headIcons = null;
  loading = true;
  processedimg2='';
  public localState = { value: '' };

 // preset pallet list - Garik has to update the color code here......
  preSetColors = [ {color:['#FF3300','#FFaa00','#77BB00','#0099FF','#A89361','#6361B9','#7C93B0','#707070'] },
                   {color:['#FF8000','#FFaa00','#FFAE5E','#0099FF','#A89361','#6361B9','#7C93B0','#707070'] },
                   {color:['#FF3300','#FFaa00','#77BB00','#008040','#FFFF1C','#6361B9','#7C93B0','#707070'] },
                   {color:['#FF3300','#FFaa00','#77BB00','#0099FF','#A89361','#6F3737','#6F3737','#707070'] },
                   {color:['#FF3300','#FFaa00','#77BB00','#0099FF','#53C885','#21852E','#299673','#1AB09D'] },
                   {color:['#A82200','#D20000','#E60000','#FB0000','#FF2222','#FF3535','#FF6666','#FF9191'] }
                   ];
  /**
   * TypeScript public modifiers
   */
  constructor(private iconAssembler:IconAssemblerService,private apollo: Apollo, private loc : Location,
              public appState: AppState,private sanitizer : DomSanitizer, public http : HttpClient,
              private changeDetector : ChangeDetectorRef) {
   
   
  }

  public ngOnInit() {
     this.canvas = new fabric.Canvas('myCanvas');
     this.context=this.canvas.getContext("2d");
     this.loadicons();
     
  }

  public transform(url) {
     return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

  save ()
   {
    this.processedimg = this.canvas.toSVG();
  } 

transformHTML(cont) {
    return this.sanitizer.bypassSecurityTrustHtml(cont);
}

selectPallet(e)
{
e.target.parentElement.childNodes[1].click();
}


getSet()
{
  return "snipDemo_"+this.selectedType;
}
public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }

public loadicons(icnType?) 
{
           
  let icnCount = {
          id:'',
          count:''
        };
        let icnCountArray = [];
   this.apollo.use('icons').watchQuery<string>({
             query: gql`
                query{ icons: latestIcons
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
       
        if(data)
          {
        this.iconAssembler.loadIcons(data).subscribe(icons=>{
        this.firstID = [];  
        let firstIcon = _.first(icons).firstRegId;
        this.IconListRoot = icons;
        this.generatePallet(this.pColorStops);
        icons.forEach(icon => {
           if(this.firstID.indexOf(icon.firstRegId)==-1)
              this.firstID.push(icon.firstRegId);
        });
        this.alterIcon("REGULAR");  
        this.loading = false;
        });
}
    })
} 

 reloadHeadIcons(id)
 {
     this.headIcons = [];
     let types = ["REGULAR","FLAT","HD","LINEAR","MONO","MINI MONO"];
     let firstSet = _.filter(this.IconListRoot, function(icon){
                    return icon.firstRegId == id;
     })
     types.forEach(type=>{
        let icon = _.first(_.filter(firstSet,function(ic){
                             return ic.graphicsType == type
                      }));
         icon && icon != undefined ? this.headIcons.push(icon) : this.headIcons.push({graphicsType:type}); 
     })             
 }

 reloadIcons(type)
 {
   this.saveandLoad(this.selectedType,true);
    this.saveandLoad(type,false);
   this.selectedType = type;
   this.alterIcon(type);
 }

saveandLoad(type,flag)
{
 const  colorStops = ['#FF3300','#FFaa00','#77BB00','#0099FF','#A89361','#6361B9','#7C93B0','#707070']; 
 switch(type)
 {
    case "FLAT":  if(flag)
                   this.pColorFlat = this.pColorStops;
                   else
                   this.pColorStops = this.pColorFlat && this.pColorFlat.length > 0 ? this.pColorFlat : colorStops;
  break;
   case "REGULAR": if(flag)
                   this.pColorRegular = this.pColorStops;
                   else
                   this.pColorStops = this.pColorRegular && this.pColorRegular.length > 0 ? this.pColorRegular : colorStops;
  break;
  
   case "LINEAR": if(flag)
                   this.pColorLinear = this.pColorStops;
                   else
                   this.pColorStops = this.pColorLinear && this.pColorLinear.length > 0 ? this.pColorLinear : colorStops;
  break;
   case "HD" :if(flag)
                   this.pColorHD = this.pColorStops;
                   else
                   this.pColorStops = this.pColorHD && this.pColorHD.length > 0 ? this.pColorHD : colorStops;
  break;
   case "MINI MONO":if(flag)
                   this.pColorMini = this.pColorStops;
                   else
                   this.pColorStops = this.pColorMini && this.pColorMini.length > 0 ? this.pColorMini : colorStops;
  break;
   case "MONO":if(flag)
                   this.pColorMono = this.pColorStops;
                   else
                   this.pColorStops = this.pColorMono && this.pColorMono.length > 0 ? this.pColorMono : colorStops
   break;
  }
}

colorChanged(color,index)
{
if(this.pColorStops && this.pColorStops[index])
   this.pColorStops[index] = color;
 this.generatePallet(this.pColorStops,this.selectedType);
}
alterIcon(gType)
{
     this.IconList = [];
     let tempicons  = _.filter(this.IconListRoot , function(icon){
                         return icon.graphicsType === gType
        });
        this.firstID.forEach(id => {
          let icon = _.first(_.filter(tempicons,function(ic){
                             return ic.firstRegId == id
                      }));
         icon && icon != undefined ? this.IconList.push(icon) : this.IconList.push({});            
        }); 
}

presetPallets(colorval)
{
 let color = colorval; 
 this.pColorFlat=color;
 this.pColorHD=color;
 this.pColorLinear=color;
 this.pColorMini =color;
 this.pColorMono =color;
 this.pColorRegular=color;
 this.pColorStops = color;
 this.generatePallet(this.pColorStops,null);
}

generatePallet(pallet,setid?,preset?){
    
    this.iconAssembler.generateGradient(pallet).subscribe(products => {
        var n = 21;
        let palletGrad = _.groupBy(products.grad, function(element, index){
        return Math.floor(index/n);
        });
        palletGrad = _.toArray(palletGrad); 
       /* if(preset)
         {
             let types = ["REGULAR","FLAT","HD","LINEAR","MONO","MINI MONO"];
             types.forEach(type=>{
                   this.addStylesheetRules(palletGrad);
             })
         } 
        else   */ 
        this.addStylesheetRules(palletGrad);
    });
   
    }

addStylesheetRulesServer (pallets,setId?) {
   let widthArray = [0,1,2,3,5,7,10,15,20,25,30,40,50,60,70,80]; 
   let opcArray = [0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95,1];
   let styleSheet = [];   
  /* let cssText ="";
  var styleEl = document.createElement('style'),styleSheet;
  styleEl.setAttribute("id",setId && setId.length > 0 ? "palletStyle"+setId:"palletStyle");
  document.head.appendChild(styleEl);
  styleSheet = styleEl.sheet;*/
  _.each(pallets ,function(pallet,index1){
  _.each(pallet ,function(p,index2)
   {
  styleSheet.push((setId && setId.length > 0 ? ".snipDemo_"+setId+" " :"") +".snip_cl"+(index1+1)+"_s"+(index2+1)+"_back" + '{' + 'background-color:rgb('+ p.r+','+p.g+','+ p.b+ ')}');
  styleSheet.push((setId && setId.length > 0 ? ".snipDemo_"+setId+" " :"") +".SF-H"+(index1+1)+"L"+((index2+1)*5)+'{' + 'fill:rgb('+ p.r+','+p.g+','+ p.b+')}');
  styleSheet.push((setId && setId.length > 0 ? ".snipDemo_"+setId+" " :"") +".SSC-H"+(index1+1)+"L"+((index2+1)*5)+'{' + 'stroke:rgb('+ p.r+','+p.g+','+ p.b+')}');
  styleSheet.push((setId && setId.length > 0 ? ".snipDemo_"+setId+" " :"") +".SGS-H"+(index1+1)+"L"+((index2+1)*5)+'{' + 'stop-color:rgb('+ p.r+','+p.g+','+ p.b+')}');
   })
   })
  styleSheet.push((setId && setId.length > 0 ? ".snipDemo_"+setId+" " :"") +".SF-0"+'{' + 'fill:none}');
  styleSheet.push((setId && setId.length > 0 ? ".snipDemo_"+setId+" " :"") +".SSLC-R"+'{' + 'stroke-linecap:round}');
  styleSheet.push((setId && setId.length > 0 ? ".snipDemo_"+setId+" " :"") +".SSLJ-R"+'{' + 'stroke-linejoin:round}');
  widthArray.forEach(width =>{
  styleSheet.push((setId && setId.length > 0 ? ".snipDemo_"+setId+" " :"") +".SSW-"+width+'{' + 'stroke-width:'+width+'px}');
  })
  opcArray.forEach(op =>{
  styleSheet.push((setId && setId.length > 0 ? ".snipDemo_"+setId+" " :"") +".SSOP-"+parseInt((op*100).toString())+'{' + 'fill-opacity:'+op+'}');
  })
  //let data = _.pluck(styleSheet.cssRules,cssText);

  console.log(styleSheet);
  
   this.apollo.use('icons').watchQuery<string>({
             query: gql`
                   query updateStyle($updateArray:[String]){
                    updateStyle(data:$updateArray, gType:"${this.selectedType}")
                    }` ,
                     variables: {
                     updateArray: styleSheet
                     }
                    }).refetch().then(data => {
                     var sheetToBeRemoved = this.selectedType && this.selectedType.length >  0 ? document.getElementById('snipDemo'+this.selectedType) : null;
                      if(sheetToBeRemoved)
                         { 
                           var sheetParent = sheetToBeRemoved.parentNode;
                           sheetParent.removeChild(sheetToBeRemoved);  
                          }  

                        let link = document.createElement("link");
                        link.id = 'snipDemo'+this.selectedType;
                        link.rel = 'stylesheet';
                        link.type = "text/css";
                        link.href = "http://35.171.8.196:4000/loadstyle/externalStyle"+this.selectedType.toLowerCase()+".css";
                        document.getElementsByTagName('head')[0].appendChild(link);
                          });
               var sheetToBeRemoved = setId && setId.length >  0 ? document.getElementById('palletStyle'+setId) : document.getElementById('palletStyle');
               if(sheetToBeRemoved)
               { 
                 var sheetParent = sheetToBeRemoved.parentNode;
                 sheetParent.removeChild(sheetToBeRemoved);  
                } 
}
publish()
{
  
 this.iconAssembler.generateGradient(this.pColorStops).subscribe(products => {
        var n = 21;
        let palletGrad = _.groupBy(products.grad, function(element, index){
        return Math.floor(index/n);
        });
        palletGrad = _.toArray(palletGrad); 
        this.addStylesheetRulesServer(palletGrad,this.selectedType);
    });

  //this.addStylesheetRulesServer(this.pColorStops,this.selectedType);
  /*this.loadAPI = new Promise((resolve) => {
            console.log('resolving promise...');
       
        });

  var sheetToBeRemoved = this.selectedType && this.selectedType.length >  0 ? document.getElementById('snipDemo'+this.selectedType) : null;
    if(sheetToBeRemoved)
  { 
  var sheetParent = sheetToBeRemoved.parentNode;
  sheetParent.removeChild(sheetToBeRemoved);  
  }  

  let link = document.createElement("link");
  link.id = 'snipDemo'+this.selectedType;
  link.rel = 'stylesheet';
  link.type = "text/css";
  link.href = "http://localhost:4000/loadstyle/externalStyle.css";
  document.getElementsByTagName('head')[0].appendChild(link);*/
 
}

addStylesheetRules (pallets,setId?) {
   let widthArray = [0,1,2,3,5,7,10,15,20,25,30,40,50,60,70,80]; 
   let opcArray = [0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95,1];
      
   let cssText ="";
   var sheetToBeRemoved = setId && setId.length >  0 ? document.getElementById('palletStyle'+setId) : document.getElementById('palletStyle');
if(sheetToBeRemoved)
  { 
  var sheetParent = sheetToBeRemoved.parentNode;
  sheetParent.removeChild(sheetToBeRemoved);  
  } 
  var styleEl = document.createElement('style'),styleSheet;
  styleEl.setAttribute("id",setId && setId.length > 0 ? "palletStyle"+setId:"palletStyle");
  document.head.appendChild(styleEl);
  styleSheet = styleEl.sheet;
  _.each(pallets ,function(pallet,index1){
  _.each(pallet ,function(p,index2)
   {
  styleSheet.insertRule((setId && setId.length > 0 ? ".snip_"+setId+" " :"") +".snip_cl"+(index1+1)+"_s"+(index2+1)+"_back" + '{' + 'background-color:rgb('+ p.r+','+p.g+','+ p.b+ ')}');
  if(setId=='LINEAR')
  styleSheet.insertRule((setId && setId.length > 0 ? ".snip_"+setId+" " :"") +".SF-H"+(index1+1)+"L"+((index2+1)*5)+'{' + 'fill:none}');
  else  
  styleSheet.insertRule((setId && setId.length > 0 ? ".snip_"+setId+" " :"") +".SF-H"+(index1+1)+"L"+((index2+1)*5)+'{' + 'fill:rgb('+ p.r+','+p.g+','+ p.b+')}');
  styleSheet.insertRule((setId && setId.length > 0 ? ".snip_"+setId+" " :"") +".SSC-H"+(index1+1)+"L"+((index2+1)*5)+'{' + 'stroke:rgb('+ p.r+','+p.g+','+ p.b+')}');
  styleSheet.insertRule((setId && setId.length > 0 ? ".snip_"+setId+" " :"") +".SGS-H"+(index1+1)+"L"+((index2+1)*5)+'{' + 'stop-color:rgb('+ p.r+','+p.g+','+ p.b+')}');
   })
   })
  styleSheet.insertRule((setId && setId.length > 0 ? ".snip_"+setId+" " :"") +".SF-0"+'{' + 'fill:none}');
  styleSheet.insertRule((setId && setId.length > 0 ? ".snip_"+setId+" " :"") +".SSLC-R"+'{' + 'stroke-linecap:round}');
  styleSheet.insertRule((setId && setId.length > 0 ? ".snip_"+setId+" " :"") +".SSLJ-R"+'{' + 'stroke-linejoin:round}');
  widthArray.forEach(width =>{
  styleSheet.insertRule((setId && setId.length > 0 ? ".snip_"+setId+" " :"") +".SSW-"+width+'{' + 'stroke-width:'+width+'px}');
  })
  opcArray.forEach(op =>{
  if(setId=='LINEAR') 
   styleSheet.insertRule((setId && setId.length > 0 ? ".snip_"+setId+" " :"") +".SSOP-"+parseInt((op*100).toString())+'{' + 'fill-opacity:0}');
  else   
  styleSheet.insertRule((setId && setId.length > 0 ? ".snip_"+setId+" " :"") +".SSOP-"+parseInt((op*100).toString())+'{' + 'fill-opacity:'+op+'}');
  })
  
}

}
