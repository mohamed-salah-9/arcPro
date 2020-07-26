import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { Vidoe } from './../models/videos';

const BACKEND_URL = environment.Url;
@Injectable({
  providedIn: 'root'
})
export class WebsiteVideosService {
  APIURL = BACKEND_URL + 'videos';
  video: Observable<Vidoe>
  constructor(private http: HttpClient, private router: Router) {

  }


  getvideos() {
    return this.http.get<Vidoe[]>(this.APIURL);
  }
  uploadvideo(video: Vidoe) {

    return this.http.post(this.APIURL, video);
  }
  deletevideoById(id: string) {
    return this.http.delete(this.APIURL + '/' + id);
  }

}
