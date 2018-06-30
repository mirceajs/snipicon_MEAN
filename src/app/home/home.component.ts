import {Component,OnInit,ChangeDetectorRef,ElementRef} from '@angular/core';
import { fabric } from 'fabric';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../app.service';
import {IconAssemblerService} from '.././services/icon-assembler.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'underscore';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

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
  styleUrls: [ './home.component.css' ],
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  /**
   * Set our default values
   */
 // colorStops =  ['#FF3300','#FFaa00','#77BB00','#0099FF','#A89361','#6361B9','#904eb1','#707070']//['#FF0054', '#16C226', '#0099FF','#FF9500','#988BD9','#2EF374','#333333','#707070'];
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
  constructor(private iconAssembler:IconAssemblerService,private apollo: Apollo,
              public appState: AppState,private sanitizer : DomSanitizer,
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

  public drag(ev,ic) {
   let style;
   let iconStyleElement; 
   let parser = new DOMParser();
   let doc = parser.parseFromString(ic.source, "image/svg+xml"); 
   style = document.getElementById("palletStyle");
   if(style && style.sheet)
      {
       iconStyleElement = doc.getElementsByTagName("style")[0];
       if(iconStyleElement && iconStyleElement.sheet)
        {
        let styl =_.compact(_.filter(style.sheet.rules,function(obj){
        return _.indexOf(ic.cssClass, obj.selectorText.replace(".",""))> -1 ? obj :null }));
        _.each(styl,function(rule){
                 iconStyleElement.textContent +=" "+ rule && rule.cssText ? rule.cssText +"\n" :'';
          });
        }
      }
     // let iconText = ('data:image/svg+xml;base64,'+window.btoa(doc.documentElement.outerHTML)); 
      let iconText = ((doc.documentElement.outerHTML)); 
      ev.dataTransfer.setData('Text',JSON.stringify(iconText));
}  

convertToData(data)
{
 let parser = new DOMParser();
 let doc = parser.parseFromString(data, "image/svg+xml"); 
 console.log('data:image/svg+xml;base64,'+window.btoa(doc.documentElement.outerHTML)); 
}

transformHTML(cont) {
    return this.sanitizer.bypassSecurityTrustHtml(cont);
}

selectPallet(e)
{
e.target.parentElement.childNodes[1].click();
}

loadSVG(d): Observable<any>
  {
    return Observable.create(observer => {
                fabric.loadSVGFromString(d, function(objects, options) {
                let  svg= fabric.util.groupSVGElements(objects, options);
                 svg.set({
                    top: 0, 
                    left:0,    
                });
        observer.next(svg);
          
  })
    })
  } 
  
  public handleDrop(e) {
    let img = new Image();
    let parser = new DOMParser();
    let data =  JSON.parse(e.dataTransfer.getData('Text'));
    let svg;
   // data = window.atob(data.replace("data:image/svg+xml;base64,","")); 
    let doc = parser.parseFromString(data, "image/svg+xml");
   // e.target. .appendChild(doc.getElementsByTagName('svg')[0]);
   e.target.parentElement.firstChild.firstElementChild.appendChild(doc.getElementsByTagName('svg')[0]);
    //let  d
   // img.innerHTML = doc.outerHTML;//window.atob(data.replace("data:image/svg+xml;base64,","")); 
   // this.processedimg2 = data;
   //img = document.getElementById('imgdrg');
   //this.context.drawImage(data,0,0);
  // this.context.drawImage(document.getElementById('imgdrg') ,0,0);
  // this.changeDetector.detectChanges();
    /*  if(d)
     this.loadSVG(d).subscribe(res =>{
       this.canvas.add(res);
     }) */
}

getSet()
{
  return "snip_"+this.selectedType;
}
public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }

public loadicons(icnType?) 
{
  let dummy = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" width="100%" height="100%" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 500 500"></svg>';
  
              
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
 this.generatePallet(this.pColorStops,null,true);
}

generatePallet(pallet,setid?,preset?){
    
    this.iconAssembler.generateGradient(pallet).subscribe(products => {
        var n = 21;
        let palletGrad = _.groupBy(products.grad, function(element, index){
        return Math.floor(index/n);
        });
        palletGrad = _.toArray(palletGrad); 
        if(preset)
         {
             let types = ["REGULAR","FLAT","HD","LINEAR","MONO","MINI MONO"];
             types.forEach(type=>{
                   this.iconAssembler.addStylesheetRules(palletGrad,type);
             })
         } 
        else    
        this.iconAssembler.addStylesheetRules(palletGrad,setid);
    });
   
    }

}
