import { Component, OnInit } from '@angular/core';
import * as Rellax from 'rellax';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  windowWidth = window.innerWidth;

  constructor() { }

  ngOnInit() {
    var rellax = new Rellax('.rellax');  
    var  nav = document.getElementById('nav1');
 //   var  logo = document.getElementById('logo');
    var a1 = document.getElementById('a1');
    var a2 = document.getElementById('a2');
    var a4 = document.getElementById('a4');
    var a5 = document.getElementById('a5');
      window.onscroll = function(){
      if (window.pageYOffset >100) {
        nav.style.background = "#578bb9";
      //  logo.style.paddingTop = "0%";
      //  logo.style.color="white";
        a1.style.color="white";
        a2.style.color="white";
        a4.style.color="white";
        a5.style.color="white";
      } 
      else{
        nav.style.background = "#ffffffe3";
     //   logo.style.color="#191a1e";
        a1.style.color="#191a1e";
        a2.style.color="#191a1e";
        a4.style.color="#191a1e";
        a5.style.color="#191a1e"; 
      }
    }
    

  
  }
 
} 
 