import {Component,OnInit,ViewChild,Input,ChangeDetectorRef} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup, FormControl,  FormGroupDirective, NgForm } from '@angular/forms';
import * as _ from 'underscore';
import {ToolInjectionService} from '../.././toolbar-component/tool-injection.service';
import {IconAssemblerService} from '../.././services/icon-assembler.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
    templateUrl: './set-icon.component.html',
    styleUrls: ['./set-icon.component.scss']
})

export class SetIconComponent implements OnInit {
  colorStops: any = [];
  palletGrad:any;
  loading = false;
  settype;
  searchTxtVal = null;
  selectedIcon = {};
  projectid;
  selectedIndex = 0;
  IconList = [];
  SetTypes = ["REGULAR","FLAT","HD","MINI","LINEAR","MONO"];
   protected icnSizes = [
    'snipicon96',
    'snipicon64',
    'snipicon48',
    'snipicon24',
    'snipicon-',
    'snipicon16'
  ];
  public form;
  selectedindex = null;
  @Input() data: any;
  constructor(public icn:IconAssemblerService,private apollo: Apollo, private chageDetect : ChangeDetectorRef,
              private sanitizer: DomSanitizer,public toolinjection : ToolInjectionService){
              this.form = new FormGroup({
                   type: new FormControl('',[]),
   }); 
  
  }
  ngOnInit() {
  this.colorStops =  ['#FF3300','#FFaa00','#77BB00','#0099FF','#A89361','#6361B9','#904eb1','#707070']//['#FF0054', '#16C226', '#0099FF','#FF9500','#988BD9','#2EF374','#333333','#707070'];
  this.colorStops = this.data && this.data.prj[0] && this.data.prj[0].Palette ? this.data.prj[0].Palette[0].split(",") : this.colorStops;
  this.projectid =  this.data && this.data.prj[0] && this.data.prj[0].ID ? this.data.prj[0].ID : null;
 // this.processGradient(this.colorStops);    
  }
  closePanel()
{
  this.toolinjection.clearPropertyPanel();
  
}
 iconClicked(icon,index)
    {
    this.selectedindex = index;
    let style;
    let iconStyleElement;
    let parser = new DOMParser();
    let doc = parser.parseFromString(icon.source, "image/svg+xml");  
    style = document.getElementById("palletStyle");
    if(style && style.sheet)
       {
       iconStyleElement = doc.getElementsByTagName("style")[0];
       if(iconStyleElement && iconStyleElement.sheet)
        {
        let styl =_.compact(_.filter(style.sheet.rules,function(obj){
                            return _.indexOf(icon.cssClass, obj.selectorText.replace(".",""))> -1 ? obj :null }));
        _.each(styl,function(rule){
               iconStyleElement.textContent +=" "+ rule && rule.cssText ? rule.cssText +"\n" :'';
        });
        }
      }
      this.selectedIcon = {source: icon.source.length > 0 ?'data:image/svg+xml;base64,'+window.btoa(doc.documentElement.outerHTML):'',
                           name : icon.name,
                            tags : icon.tags 
      };
     
    }

addIcon(ic)
{
  this.loading = false;
  let iconid = ic.id;
  let setid = this.data.details.ID;

   this.apollo.use('iconset').mutate({
         mutation :gql`
                   mutation{ postSetIcon(icon:"${iconid}", set:"${setid}"){
                   SetID
                  }
                  }`
                },
                ).subscribe(res =>{
                    this.loading = false;
                    this.selectedindex = null;
                    this.toolinjection.reloadSetinProject();
                   
                },
               (error) =>{
               this.loading = false;  
               })
}    

searchTextVal(val)
{
 this.searchTxtVal = val; 
 this.selectedindex = null; 
 this.loading= true;  
 this.getIcons(val,this.form.value.type).subscribe(res =>{
     if(res)
         {
        this.icn.loadIcons(res).subscribe(icons=>{
        this.IconList = icons;
        this.generatePallet();
        this.loading = false;
        });
         }
      })
 }

 transformHTML(cont) {
    return this.sanitizer.bypassSecurityTrustHtml(cont);
  }
  
 public transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
 }
    
 generatePallet(){
    this.icn.generateGradient(this.colorStops).subscribe(products => {
    var n = 21;
    this.palletGrad = _.groupBy(products.grad, function(element, index){
      return Math.floor(index/n);
    });
    this.palletGrad = _.toArray(this.palletGrad); 
    this.icn.addStylesheetRules(this.palletGrad);
    });
  }

setSelection(index)
{
  this.selectedIndex = index;
}
save()
{
  /* this.apollo.use('set').mutate({
         mutation :gql`
                   mutation{ postSet(name:"${name}", owner:"${userId}",palette:"${colors}", type:"${type}", project:"${project}"){
                    ID
                  }
                  }`
                },
                ).subscribe(res =>{
                    this.loading = false;
                    this.toolinjection.reloadProject();
                    this.closePanel();
                },
               (error) =>{
               this.loading = false;  
               })*/
}

graphTypeselected(){
 if(this.searchTxtVal != null)
  {
   this.loading= true;  
 this.getIcons(this.searchTxtVal,this.form.value.type).subscribe(res =>{
     if(res)
         {
        this.icn.loadIcons(res).subscribe(icons=>{
        this.IconList = icons;
        this.generatePallet();
        this.loading = false;
        });
         }
      })
  }

}

  getIcons(val, type?):Observable<any> {
                      return Observable.create(observer => { this.apollo.use('icons').watchQuery<any>({ 
                                  query: gql`
                                  query {
                                        icons:iconSearchResult(name:"${val}",type:"${type}")
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
                                                   return null;
                                                   })
                                                   });
                                  }
 
}