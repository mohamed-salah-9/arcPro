import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators , ReactiveFormsModule ,FormControl } from '@angular/forms';
import { CotactService} from 'src/app/services/cotact.service'
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  
  mobNumberPattern = "^((\\+91-?)|0)?[0-9]{11}$";
  showMyContainer: boolean = false;

  constructor( private CS: CotactService) { }

  ngOnInit() { 
    
    
  }

  send(value){
    this.CS.sendemail(value);
    this.showMyContainer=true;
  }
  
} 
