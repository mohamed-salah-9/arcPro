import { Bills } from './../models/bills';
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
export class BillsService {
  APIURL = BACKEND_URL+'bills';
  company_dif = BACKEND_URL+'company_diffrenece';

  constructor(private http: HttpClient) { }


  getAllbills() {
    return this.http.get<Bills[]>(this.APIURL  );
  }

  addbills(bills: Bills) {
    return this.http.post(this.APIURL  , bills) 
  }

  deletebill(id: string) {
    return this.http.delete(this.APIURL + '/' + id);
  }

  getbill_by_id(id: string) {
    return this.http.get<Bills>(this.APIURL + '/' + id );
  }

  update_bill_ById(id: string, bills: any) {
    return this.http.patch(this.APIURL + '/' + id, bills);
  }

  company_diff(){
    return this.http.get(this.company_dif).pipe(map((data: any) => data.result ));

  }
}
