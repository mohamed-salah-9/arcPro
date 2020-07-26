import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contact} from 'src/app/Models/contactModels'
import { from } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CotactService {
  ApiUrl = 'http://localhost:3000/';
  constructor(private http : HttpClient) { }

  sendemail(product: Contact) {
    return this.http.post(this.ApiUrl + 'contact', product).subscribe(); 
  }
}  
  
 