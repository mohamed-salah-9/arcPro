import { Band } from './../models/band';
import { HttpClient } from '@angular/common/http';
import{Observable ,BehaviorSubject} from 'rxjs';
import { map } from 'rxjs/operators';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { Injectable } from '@angular/core';

const BACKEND_URL = environment.Url ;


@Injectable({
  providedIn: 'root'
})
export class BandService {
  APIURL = BACKEND_URL+'bands';
  band:Observable<Band>

  constructor(private http: HttpClient, private router: Router) {
      
  }
  
  // getImage (url: string): Observable<Blob> {
  //   const url =BACKEND_URL+'./src/uploads';
  //   return this.http.get(url, { responseType: 'blob' });
  // }

getband() {
 return this.http.get<Band[]>(this.APIURL );
}
makeband(band:Band) {
  return this.http.post(this.APIURL , band).subscribe();
}
   
deletebandId(id: string) {
  return this.http.delete(this.APIURL +'/'+ id);
}
 getband_byId(id: string) {
  return this.http.get<Band>(this.APIURL +'/'+  id );
}
updateband_ById(id: string, band: any) {
  return this.http.patch(this.APIURL +'/'+ id, band);
} 
 
}