import { Component, OnInit } from '@angular/core';
import WOW from 'wow.js';
import { LogosService } from 'src/app/services/logos.service'
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  logo : any[] = []
  constructor(private LS : LogosService) { }

  ngOnInit() {
    new WOW().init();
    this.getlogo();
  }
  
  getlogo(){
    this.LS.getlogos().subscribe(
      data => this.logo = data
    )
  }
}
