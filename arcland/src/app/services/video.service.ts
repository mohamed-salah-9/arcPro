import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  ApiUrl = 'http://localhost:3000/';
  constructor( private http : HttpClient ){ }

  getvideos(){
    return this.http.get<any[]>(this.ApiUrl + 'videos')
  }
}
