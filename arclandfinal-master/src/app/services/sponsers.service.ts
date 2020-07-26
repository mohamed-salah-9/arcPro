import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { Sponsors } from './../models/sponsors';
const BACKEND_URL = environment.Url;

@Injectable({
  providedIn: 'root'
})
export class SponsersService {
  APIURL = BACKEND_URL + 'sponsors';
  sponsors: Observable<Sponsors>
  constructor(private http: HttpClient, private router: Router) {

  }

  // getImage (url: string): Observable<Blob> {
  //   const url =BACKEND_URL+'./src/uploads';
  //   return this.http.get(url, { responseType: 'blob' });
  // }

  getsponsors() {
    return this.http.get<Sponsors[]>(this.APIURL);
  }
  uploadsponsors(sponsors: Sponsors) {

    return this.http.post(this.APIURL, sponsors);
  }
  deletesponsorsById(id: string) {
    return this.http.delete(this.APIURL + '/' + id);
  }



}
