import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class LogosService {
  ApiUrl = 'http://localhost:3000/';
  constructor( private http : HttpClient ) { }

  
  getlogos(){
    return this.http.get<any[]>(this.ApiUrl + 'sponsors')
  }
}
