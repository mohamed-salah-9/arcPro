import { Component, OnInit } from '@angular/core';
import WOW from 'wow.js'

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.css']
})
export class StepsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    new WOW().init();
  }

}
