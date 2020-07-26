import { Component, OnInit } from '@angular/core';
import * as Rellax from 'rellax';
import * as $ from 'jquery';
import WOW from 'wow.js';
import {  VideoService} from 'src/app/services/video.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  videos : any[] = [];

  constructor( private VS : VideoService) {
    this.getvideo()
  }

  ngOnInit() {
    new WOW().init();
    var rellax = new Rellax('.rellax');  
    this.getvideo()
  }
  
  
  getvideo(){
    this.VS.getvideos().subscribe(
      data => {this.videos = data;
      }
    );
  }
}
 