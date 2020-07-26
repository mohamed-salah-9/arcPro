import { Component, OnInit } from '@angular/core';
import WOW from 'wow.js'

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    new WOW().init();
  }

}
