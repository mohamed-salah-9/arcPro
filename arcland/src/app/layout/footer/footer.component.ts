import { Component, OnInit } from '@angular/core';
import { Details } from 'src/app/Models/detailsModels';
import { DetailsService} from 'src/app/services/details.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  latitude = 30.0565261;
  longitude = 31.3291268;
  onChosenLocation = false;
  WebDet : Details [] =[];
  constructor( private DS : DetailsService ) { }

  ngOnInit() {
    this.getdet()
  }
  
  onChooseLocation(event){
    this.onChosenLocation = true;
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
  }
  
  getdet(){
    this.DS.getdetails().subscribe(
      data => {this.WebDet = data }
    )
  }
}
