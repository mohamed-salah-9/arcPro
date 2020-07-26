import { Component, OnInit } from '@angular/core';
import { ImagesService } from 'src/app/services/images.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  imagess : any[] = [];

  constructor(private IS : ImagesService) {  
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
