import { Location_details } from './../models/location_details';
import { HttpClient } from '@angular/common/http';
import{Observable ,BehaviorSubject} from 'rxjs';
import { map } from 'rxjs/operators';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
const BACKEND_URL = environment.Url ;
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationDetailsService {
  APIURL = BACKEND_URL+'location_details';
  worker_payment= BACKEND_URL+"worker_payment"
  total_pay_worker= BACKEND_URL+"worker_payment_total"
  constructor(private http: HttpClient) { }
  addpayment_worker(id: string, location: any ) {
    return this.http.patch<Location>(this.worker_payment+ '/' + id, location  );
  }
  gettotal_payment_worker(){
    return this.http.get(this.total_pay_worker).pipe(map((data: any) => data.result ));

  }

  getAll_location_details() {
    return this.http.get<Location_details[]>(this.APIURL  );
  }

  addLocation_details(location_details: Location_details) {
    return this.http.post(this.APIURL  , location_details);
  }

  deletelocation_detail(id: string) {
    return this.http.delete(this.APIURL + '/' + id);
  }

  getlocation_detail_by_id(id: string) {
    return this.http.get<Location_details>(this.APIURL + '/' + id );
  }

  update_location_detail_ById(id: string, location_details: any) {
    return this.http.patch(this.APIURL + '/' + id, location_details);
  }
}
