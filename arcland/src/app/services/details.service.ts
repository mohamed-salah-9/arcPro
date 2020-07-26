import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Details } from 'src/app/Models/detailsModels'
@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  ApiUrl = 'http://localhost:3000/';

  constructor( private http : HttpClient ) { }

  getdetails(){
    return this.http.get<Details[]>(this.ApiUrl + 'details')
  }
}

