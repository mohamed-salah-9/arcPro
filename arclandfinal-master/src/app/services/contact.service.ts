import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { Contacts } from './../models/contact';
const BACKEND_URL = environment.Url;

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  APIURL = BACKEND_URL + 'contact';
  contacts: Observable<Contacts>
  constructor(private http: HttpClient, private router: Router) {

  }

  // getImage (url: string): Observable<Blob> {
  //   const url =BACKEND_URL+'./src/uploads';
  //   return this.http.get(url, { responseType: 'blob' });
  // }

  getcontacts() {
    return this.http.get<Contacts[]>(this.APIURL);
  }

  deletecontact(id: string) {
    return this.http.delete(this.APIURL + '/' + id);
  }




}
