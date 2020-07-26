import { Component, OnInit } from '@angular/core';
import { ImagesService } from 'src/app/services/images.service';
import { ActivatedRoute } from '@angular/router';
declare var $: any;


@Component({
  selector: 'app-singleimg',
  templateUrl: './singleimg.component.html',
  styleUrls: ['./singleimg.component.css']
})
export class SingleimgComponent implements OnInit {

  imagess : any;
  constructor(private IS : ImagesService, private route: ActivatedRoute) {  
  }

  getMyData(){
    const id = this.route.snapshot.params.id;
    this.IS.getSinimg(id).subscribe(
      data =>(this.imagess = data)
    );
  }
  ngOnInit() {
    this.getMyData(); 
  }
  
}
 