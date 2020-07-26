import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { Image } from './../models/images';

const BACKEND_URL = environment.Url;
@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  APIURL = BACKEND_URL + 'images';
  image: Observable<Image>
  constructor(private http: HttpClient, private router: Router) {

  }

  // getImage (url: string): Observable<Blob> {
  //   const url =BACKEND_URL+'./src/uploads';
  //   return this.http.get(url, { responseType: 'blob' });
  // }

  getimages() {
    return this.http.get<Image[]>(this.APIURL);
  }
  uploadimages(image: Image) {

    return this.http.post(this.APIURL, image);
  }
  deleteimagesById(id: string) {
    return this.http.delete(this.APIURL + '/' + id);
  }
  //  getbussiness_byId(id: string) {
  //   return this.http.get<Bussiness>(this.APIURL +'/'+  id );
  // }
  // updatebussiness_ById(id: string, bussiness: any) {
  //   return this.http.patch(this.APIURL +'/'+ id, bussiness);
  // } 

}
