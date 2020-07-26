import { Location } from './../models/locations';
import { Bussiness } from './../models/bussiness';
import { HttpClient } from '@angular/common/http';
import{Observable ,BehaviorSubject} from 'rxjs';
import { map } from 'rxjs/operators';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
const BACKEND_URL = environment.Url ;
import { Injectable } from '@angular/core'
@Injectable({
  providedIn: 'root'
})
export class LocationService {
  APIURL = BACKEND_URL+'locations';
  count = BACKEND_URL+"total_workers";
  location_reports= BACKEND_URL+"location_reports"
  payment= BACKEND_URL+"payment"
  total_pay= BACKEND_URL+"total_pay"
  winnning= BACKEND_URL+"winning"
  chart= BACKEND_URL+"charts"
price_dif=BACKEND_URL+"price_diffrenece"
supervision=BACKEND_URL+"supervision_fees"
  constructor(private http: HttpClient) { }


  getAll_location() {
    return this.http.get<Location[]>(this.APIURL );
  }

  addLocation(location: Location) {
    return this.http.post(this.APIURL  , location) ;
  }

  deletelocation(id: string) {
    return this.http.delete(this.APIURL + '/' + id);
  }

  getlocation_by_id(id: string) {
    return this.http.get<Location>(this.APIURL + '/' + id );
  }

  update_location_ById(id: string, location: any) {
    return this.http.patch(this.APIURL + '/' + id, location);
  }
  total(id: string ) {
    return this.http.get<any[]>(this.count+ '/' + id  ) 
  }
  getalltotal() {
    return this.http.get(this.count  ).pipe(map((data: any) => data.result )); 

  }
  get_bussiness(){
    return this.http.get<Bussiness[]>(this.APIURL +'bussiness');
   }
   getreports (id: string ) {
    return this.http.get<Location>(this.location_reports+ '/' + id  );
  }
  addpayment(id: string, location: any ) {
    return this.http.patch<Location>(this.payment+ '/' + id, location  );
  }
  gettotal_payment(){
    return this.http.get(this.total_pay).pipe(map((data: any) => data.result ));

  }
  get_winng(){
    return this.http.get(this.winnning).pipe(map((data: any) => data.result ));

  }
  get_charts(){
    return this.http.get(this.chart).pipe(map((data: any) => data.result ));

  } 
  price_diff(){
    return this.http.get(this.price_dif).pipe(map((data: any) => data.result ));

  }
  supervision_fees(){
    return this.http.get(this.supervision).pipe(map((data: any) => data.result ));

  }
}
