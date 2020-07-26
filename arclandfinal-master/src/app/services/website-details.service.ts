
import { Detail } from './../models/website_detail';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from "../../environments/environment";
const BACKEND_URL = environment.Url;
import { Injectable } from '@angular/core'
@Injectable({
  providedIn: 'root'
})
export class WebsiteDetailsService {
  APIURL = BACKEND_URL + 'details';

  constructor(private http: HttpClient) { }


  getAll_detail() {
    return this.http.get<Detail[]>(this.APIURL);
  }

  adddetail(detail: Detail) {
    return this.http.post(this.APIURL, detail);
  }

  deletedetail(id: string) {
    return this.http.delete(this.APIURL + '/' + id);
  }

  getdetail_by_id(id: string) {
    return this.http.get<Detail>(this.APIURL + '/' + id);
  }

  update_detail_ById(id: string, detail: any) {
    return this.http.patch(this.APIURL + '/' + id, detail);
  }

}
