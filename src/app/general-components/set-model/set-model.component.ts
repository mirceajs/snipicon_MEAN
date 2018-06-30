import {Component,OnInit,ViewChild,Input,ChangeDetectorRef} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup, FormControl,  FormGroupDirective, NgForm } from '@angular/forms';
import * as _ from 'underscore';
import {ToolInjectionService} from '../.././toolbar-component/tool-injection.service';
import {IconAssemblerService} from '../.././services/icon-assembler.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
    templateUrl: './set-model.component.html',
    styleUrls: ['./set-model.component.scss']
})

export class SettModelComponent implements OnInit {
  colorStops: any = [];
  palletGrad:any;
  loading = false;
  settype;
  projectid;
  basecolors;
  selectedIndex = 0;
  SetTypes = ["REGULAR","FLAT","HD","MINI","LINEAR","MONO"];
  public form;
  @Input() data: any;
  constructor(public icn:IconAssemblerService,private apollo: Apollo, private chageDetect : ChangeDetectorRef, public toolinjection : ToolInjectionService){
     this.form = new FormGroup({
     set : new FormControl('',[]),
     type: new FormControl('',[]),
   });
  }
  ngOnInit() {
  
  this.colorStops =  ['#FF3300','#FFaa00','#77BB00','#0099FF','#A89361','#6361B9','#904eb1','#707070']//['#FF0054', '#16C226', '#0099FF','#FF9500','#988BD9','#2EF374','#333333','#707070'];
  this.colorStops = this.data && this.data.prj[0] && this.data.prj[0].Palette ? this.data.prj[0].Palette[0].split(",") : this.colorStops;
  this.projectid =  this.data && this.data.prj[0] && this.data.prj[0].ID ? this.data.prj[0].ID : null;
  this.processGradient(this.colorStops);  
  this.basecolors = this.colorStops;  
  }
  closePanel()
{
  this.toolinjection.clearPropertyPanel();
  
}

satChanged(val)
{
 // val = val/100;
  let gColor ={r:0,g:0,b:0};
  let colrval = [];
  let colorGrad = [];
  this.colorStops = _.map(this.basecolors, function(colr) {
                    var num = parseInt(colr.slice(1),16), amt = Math.round(2.55 * val), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
                    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
                    });
  this.processGradient(this.colorChanged);     
}

rgb(a,b,c)
{
 return "rgb("+a+","+b+","+c+")";
}

formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }
    else 
      return value+"px";
}
setSelection(index)
{
  this.selectedIndex = index;
}
save()
{
  let name = this.form.value.set;
  let project = this.projectid;
  let type = this.form.value.type;
  let colors = this.colorStops;
  this.loading = true;
  let userId = JSON.parse(localStorage.getItem("SnipData")) && JSON.parse(localStorage.getItem("SnipData")).userId  ? JSON.parse(localStorage.getItem("SnipData")).userId  : null; 
  this.apollo.use('set').mutate({
         mutation :gql`
                   mutation{ postSet(name:"${name}", owner:"${userId}",palette:"${colors}", type:"${type}", project:"${project}"){
                    ID
                  }
                  }`
                },
                ).subscribe(res =>{
                    this.loading = false;
                    this.toolinjection.reloadSetinProject();
                    this.closePanel();
                },
               (error) =>{
               this.loading = false;  
               })
}

colorChanged(color,index)
{
if(this.colorStops && this.colorStops[index])
   this.colorStops[index] = color;
   this.processGradient(this.colorStops);
}

 processGradient(color)
 {
   
     this.icn.generateGradient(this.colorStops).subscribe(color=>{
     this.palletGrad = _.groupBy(color.grad, function(element, index){
         return Math.floor(index/21);
         });
       this.palletGrad = _.toArray(this.palletGrad); 
       this.chageDetect.markForCheck();
     });
 }

}