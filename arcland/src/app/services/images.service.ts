import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  ApiUrl = 'http://localhost:3000/';
  constructor( private http : HttpClient ) { }

  
  getimages(){
    return this.http.get<any[]>(this.ApiUrl + 'images')
  }
  getSinimg(id){ 
    return this.http.get<any>(this.ApiUrl+'images/'+id)
  }
}
