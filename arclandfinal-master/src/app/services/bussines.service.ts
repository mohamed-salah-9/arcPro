import { Injectable } from '@angular/core';
import { Bussiness } from './../models/bussiness';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.Url;


@Injectable({
  providedIn: 'root'
})
export class BussinesService {
  APIURL = BACKEND_URL + 'bussiness';
  bussiness: Observable<Bussiness>

  constructor(private http: HttpClient, private router: Router) {

  }

  // getImage (url: string): Observable<Blob> {
  //   const url =BACKEND_URL+'./src/uploads';
  //   return this.http.get(url, { responseType: 'blob' });
  // }

  getbussiness() {
    return this.http.get<Bussiness[]>(this.APIURL);
  }
  makebussiness(bussiness: Bussiness) {
    return this.http.post(this.APIURL, bussiness);
  }

  deletebussinessById(id: string) {
    return this.http.delete(this.APIURL + '/' + id);
  }
  getbussiness_byId(id: string) {
    return this.http.get<Bussiness>(this.APIURL + '/' + id);
  }
  updatebussiness_ById(id: string, bussiness: any) {
    return this.http.patch(this.APIURL + '/' + id, bussiness);
  }

}