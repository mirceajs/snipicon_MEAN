import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { Observable } from 'rxjs/Observable';
import { ColorGrad,Icon,Query} from '../models/icon.model';
import { Headers, Http, Response } from '@angular/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/forkJoin';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Injectable()
export class IconAssemblerService {
public Obs:any;
public ObsArray:any[];
public ObsSet:any = {};
public files : any;
icons: Observable<Icon[]>;
IconSet : Observable<any>;
constructor(private http: Http,private apollo: Apollo) { }

loadIcons(result): Observable<any[]>
{
  this.ObsArray = [];
  let iconList=[];
  let style="";
  let content ="";
  let icon ="";
  let parser = new DOMParser();
  let val;
  let gradDef = "";
    _.map(result.data.icons,function(ic){
      let iconDetails = {id:ic._id,
                        name: ic.name, 
                        firstRegId:ic.firstRegId,
                        tags:ic.tags,
                        graphicsType:ic.graphicsType,
                        source :"",
                        cssClass: ic.IconCss
      } 
      let icon =""; 
       style = "";
       content = ic.Source;
       let viewBox = ic.viewBox;
      
       gradDef = ic.Gradients && ic.Gradients.length > 0 ? ic.Gradients[0].def :"";
    _.map(ic.cssStyle,function(css){
      style +=" "+css.name+"{"+css.value+"}";
    })      
      style = style.length > 0 ? "<style type='text/css'>"+ style+"</style>" :"<style type='text/css'></style>"; 
      icon +=`<?xml version="1.0" encoding="UTF-8"?>
              <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="100%" height="100%" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
              viewBox="0 0 500 500" xmlns:xlink="http://www.w3.org/1999/xlink">`; 
       
      if(gradDef && gradDef.length> 0)
        { 
          let innerText = gradDef.replace("<defs>","").replace("</defs>","");
          icon +="<defs>"+ style+(innerText)+"</defs>"; 
        }
      else 
         icon+= "<defs>"+ style+"</defs>";  
    
      icon+=content;
      icon+="</svg>";
      let finalIcon = parser.parseFromString(icon, "image/svg+xml");
      finalIcon.getElementsByTagName('svg')[0].setAttribute("viewBox", viewBox);
      iconDetails.source = finalIcon.documentElement.outerHTML;
      iconList.push(iconDetails);
    //});
   // return iconList;
    }); 
    return Observable.of(this.ObsArray = iconList);

}


generateGradient(colorStops:string[]):Observable <any> {
  let gColor ={ r:0,g:0,b:0};
  let gradians = [];
  let colorGrad = [];
  _.forEach(colorStops, function(colr){
      gColor ={r:0,g:0,b:0};
      let temp =[];
      let temp2 =[];
      let colrval = [];
      colrval.push(colr.slice(1,3));
      colrval.push(colr.slice(3,5));
      colrval.push(colr.slice(5,7));
      let r =((parseFloat("1") - (parseInt(colrval[0],16)/ (parseFloat("255"))))/11);
      let g =((parseFloat("1") - (parseInt(colrval[1],16)/ (parseFloat("255"))))/11);
      let b =((parseFloat("1") - (parseInt(colrval[2],16)/ (parseFloat("255"))))/11);
          for(var i = 0; i < 10; i++)
             {
              gColor = { r:0,g:0,b:0}; 
              gColor.r = Math.ceil((1 - r * i - r) * 255)//.toString(16);
              gColor.g = Math.ceil((1 - g * i - g) * 255)//.toString(16);
              gColor.b = Math.ceil((1 - b * i - b) * 255)//.toString(16);
              colorGrad.push(gColor);
              temp.push(gColor);
             }
              gColor ={r:0,g:0,b:0}; 
              gColor.r = Math.ceil(parseInt(colrval[0],16));
              gColor.g = Math.ceil(parseInt(colrval[1],16));
              gColor.b = Math.ceil(parseInt(colrval[2],16));
              colorGrad.push(gColor);
              temp.push(gColor);
              temp = temp.reverse();
              r = parseInt(colrval[0],16) / (10 + 4);
              g = parseInt(colrval[1],16) / (10 + 4);
              b = parseInt(colrval[2],16) / (10 + 4);
          for (var i = 0; i < 10; i++)
             {
              gColor = {r:0,g:0,b:0}; 
              gColor.r  =  Math.ceil((4 * r) + (r * i))//.toString(16);
              gColor.g  =  Math.ceil((4 * g) + (g * i))//.toString(16);
              gColor.b  =  Math.ceil((4 * b) + (b * i))//.toString(16);
              colorGrad.push(gColor);
              temp2.push(gColor);
            }
              temp2 = _.union(temp2,temp);
              let d = gradians.concat(temp2);
              gradians = d;
        });
         gradians.push({r:0,g:0,b:0});
         gradians.push({r:255,g:255,b:255});    
    return Observable.of(this.Obs ={grad:gradians});
  }

private handleError(err: HttpErrorResponse) {
  let errorMessage = '';
    if (err.error instanceof Error) {
    errorMessage = `An error occurred: ${err.error.message}`;
    }
    else {
    errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }
  
 
processSvg(url):Observable <any>{
 let doc;
 return (this.http.get(url).map((res:any) => {
   let parser = new DOMParser();
   doc = parser.parseFromString(res._body, "image/svg+xml");
         return doc.documentElement;
    }));
}

getIconUrls(){
    return[] 
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
  styleSheet.insertRule((setId && setId.length > 0 ? ".snip_"+setId+" " :"") +".SSOP-"+parseInt((op*100).toString())+'{' + 'fill-opacity:'+op+'}');
  })
  
}
}
