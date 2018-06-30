import { Component, OnInit} from '@angular/core';
import * as _ from 'underscore';
import {MatSnackBar} from '@angular/material';
import {CognitoUtil} from '../.././services/cognito.service';
import {MatTableDataSource} from '@angular/material';
import { DataSource } from '@angular/cdk/table';

@Component({
    selector: 'si-designer',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit {
   displayedColumns = ['Username', 'email', 'UserStatus'];
   dataSource = new MatTableDataSource([ELEMENT_DATA]);
   tableData =[];
   constructor(public toast : MatSnackBar, public cogutil: CognitoUtil) { }

    public ngOnInit() {
        let arr =[];
        this.cogutil.getUserList().subscribe(res =>
            {  
               res.forEach(r => {
               let val =_.pick(r,["Username","UserStatus"]);
               let email = r.Attributes[0].Value;
               val.email = email;
                arr.push(val) ;   
                this.tableData = arr;            
             
            }); 
            this.dataSource = new MatTableDataSource(arr);
            })
        }

    applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
export interface Element {
  Username: string;
  email: string;
  UserStatus: string;
 }
const ELEMENT_DATA: Element[] = [
  {Username: '1', email: 'Hydrogen', UserStatus: '1.0079'},
  {Username: '2', email: 'Helium', UserStatus: '4.0026'},
];