import { Component, OnInit } from '@angular/core';
import { ImagesService } from 'src/app/services/images.service'

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  imagess : any[] = [];
  constructor(private IS : ImagesService) {  
    this.AddMyimage()
  }

  ngOnInit() {
    this.AddMyimage()
  }
  
  AddMyimage() {
    this.IS.getimages().subscribe(
      data => {this.imagess = data ; 
        console.log(this.imagess) 
      }
      );
  }
}
