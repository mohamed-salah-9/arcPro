import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
 import { ActivatedRoute, Router } from '@angular/router';
import { AdminsService } from '../services/admins.service';
import { Bussiness } from '../models/bussiness';
import { Role } from '../models/role';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { first } from 'rxjs/operators';
 import { BussinesService } from '../services/bussines.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
 import { Chart } from 'chart.js';
import * as moment from 'moment';
import { Location } from '../models/locations';
import { LocationService } from '../services/location.service';
import { CdkCell } from '@angular/cdk/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit, OnDestroy {
   charts_values:any
  filterlocation:any[]
options:any
chart: any = [];

data:any
  loadingIndicator: boolean;
  reorderable: boolean;
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private router: Router,
    private _httpClient: HttpClient,
     private BussinesService: BussinesService,
     private LocationService: LocationService,

    private _fuseTranslationLoaderService: FuseTranslationLoaderService

  ) {
    // Set the defaults
    this.loadingIndicator = true;
    this.reorderable = true;
    //Set the private defaults
    this._unsubscribeAll = new Subject();
    this._fuseTranslationLoaderService.loadTranslations(english, turkish);
  }

  /**
   * On init
   */
  ngOnInit() {
    this.charts()
     }


  




    charts(){
      let filterlocation = [];
      this.LocationService.get_charts().pipe(first()).subscribe(
        data => {this.charts_values=data          
   let name =   this.charts_values.map(res => res.location) ;
  let value =    this.charts_values .map(res =>  res.expenses_value ) ;
  let total_pays = this.charts_values.map(res => res.payment_value) ;
  let wins =  this.charts_values.map(res => res.winning_value) ;
   
     console.log(this.charts_values)    
        
                this.data = {
                  labels: name,
                  datasets: [
                    {
                      label: 'مصروفات',
                      data: value,
                      fill: false,
                      backgroundColor:"rgba(163, 67, 60,0.7)"
             
                    } ,
                    {
                      label: 'دفعات',
                      data:  total_pays,
                      fill: false,
                      backgroundColor	:"rgba(101, 158, 44,0.7)"	         
                    } ,  
                    {
                      label: 'الارباح',
                      data:  wins,
                      fill: false,
                      backgroundColor	:"rgba(57, 33, 156,0.7)"	         
                    } ,
                   
  
                  ],
                },
                this.options= {
                  scales: {
                      yAxes: [{
                          ticks: {
                            beginAtZero: true,
                           }
                      }]
                  }}
                // var i =0
                // for (i = 0; i < this.data.datasets[0].data.length; i++) {
                //   if (this.data.datasets[0].data[i] > 50) {
                //     backgroundColor	.push("#52eb5c");
                //   } else {
                //     backgroundColor	.push("red");
                //   } 
              // }
            })
    }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

