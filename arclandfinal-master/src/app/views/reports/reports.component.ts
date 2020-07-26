import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute,Router } from '@angular/router';
import { LocationDetailsService } from '../../services/location-details.service';
import { LocationService } from '../../services/location.service';
import { BillsService } from '../../services/bills.service';
import { Location_details } from '../../models/location_details';
 import { Location } from '../../models/locations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Role } from '../../models/role';
import { Bills } from '../../models/bills';
import { Band } from '../../models/band';
import { BandService } from '../../services/band.service';

import { first } from 'rxjs/operators';
import * as XLSX from 'xlsx'; 

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  rows: any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  location_detail: any ;
  location: any ;
  currentlocation_detail: any;
  currentlocation: any;
  location_details: any 
  locations: any  
  bills: any 
  bill: any  
  selectedlocation_details: any
  selectedlocation: any
  location1: any={  _id: '',admin_id:'',bussines_id:'',band_Number:0,completion_rate:0,date:'',degree_of_progress:0,
  fees_until_now:0,location:'',payment:[],required_payment:0,supervision_fees_required:0,total_actual_expenses:0,total_fees:0};

   location_details1: any={  _id: '',band_id:'',actual_total_paid_for_the_item_from_the_customer:0,actual_quantity:0,date:'',price_per_square_meter:0,required_from_the_customer:0,
                                        the_price_difference:0,the_total_cost_to_the_customer:0,total_for_worker:0,total_price_in_the_assay:0,worker_payments_for_now:0,Location_detail_id:0,
                                       estimated_amount_of_assay:0,left_for_worker:0,price_per_square_meter_for_the_worker:0};
 
 bills1:any={_id:'',material_price:0,date:'', bills_id:'',bill:0,band:''}
 role:any
 band: any;

 submitted = false;
  cols: any[];
   displayDialogforadd: boolean;
   displayDialogforedit: boolean;
     newlocation_details: boolean;
    columns: any[];
    exportColumns:any
    index:any;
    total:any 
 total_for_worker:any
    public id: any;
    filterlocation: any

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
      private _httpClient: HttpClient,
      private LocationDetailsService:LocationDetailsService,
      private LocationService:LocationService,
      private BandService:BandService,
      private BillsService:BillsService,
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private route: ActivatedRoute
  )
  { 

      // Set the defaults
      this.loadingIndicator = true;
      this.reorderable = true;

      //Set the private defaults
      this._unsubscribeAll = new Subject();
      this._fuseTranslationLoaderService.loadTranslations(english, turkish);

   }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {     
    
    this.cols = [
      
        {  width: '25rem' },
      { width: '25rem'  },
      {  width: '25rem' },
      {  width: '25rem' },
        ];
     
          this.getAll( );
          this.getdetails()
       }

       
      // الفانكشن الجاهزة لتصدير الجدول الى الاكسيل
  exportExcel() {
    import("xlsx").then(xlsx => {
         const Heading = [
          ["البند" , "سعر المتر فى المقايسة", "الكمية الفعلية", "التكلفة الاجمالية","موقف الشقة","ملاحظات"],
        ]
        const ws = xlsx.utils.aoa_to_sheet(Heading);
        var wscols = [{wch:20}, {wch:20}, {wch:20}, {wch:20}, {wch:35}, {wch:40}];
        ws['!cols'] = wscols;
        const worksheet = xlsx.utils.sheet_add_json(ws, this.filterlocation, { skipHeader: true, origin: "A2" });
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Arcland Bussiness report");
    });
  }
  


  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }
  // الفانكشن المسئوله عن الحصول على بيانات مختلفة من 3 جداول بالدتابيز وعرضها ف ملف الاكسيل
   getdetails() {
    let filterlocation = [];
     

   
    this.LocationService.getAll_location().pipe(first()).subscribe(
      data => {this.locations = data,
          this.LocationDetailsService.getAll_location_details().subscribe(  
           
              data => { this.location_details = data 
                this.BandService.getband().pipe(first()).subscribe(
                  data => { this.band = data
                    this.BillsService.getAllbills().pipe(first()).subscribe(
                      data => {this.bills = data,
                      
                  this.locations.forEach(elm => {
                    this.location_details.forEach(elme => {
                         
                             
                        
                         if (elm.bussines_id == this.route.snapshot.paramMap.get('id') && elm._id == elme.Location_detail_id  ) {
                        const temp = [elme.band_name, elme.price_per_square_meter,elme.actual_quantity, elme.the_total_cost_to_the_customer];
                          filterlocation.push(temp);
                      }})
                      
                   
                   
                })
                this.locations.forEach(elm => {
                this.bills.forEach(bi => {
                  if(elm.bussines_id == this.route.snapshot.paramMap.get('id') &&bi.bills_id==elm._id ){
                   const t=[bi.band,'','',bi.material_price] 
                   filterlocation.push(t)
                   this.filterlocation = filterlocation
                   }})
                });
              })
                })}) });
    return filterlocation;
  }







  getAll() {
    this.id = this.route.snapshot.paramMap.get('id');
     this.LocationService.getAll_location().pipe(first()).subscribe(
      data => {this.locations = data,
        this.BandService.getband().pipe(first()).subscribe(
          data => { this.band = data})
          this.BillsService.getAllbills().pipe(first()).subscribe(
            data => {this.bills = data})
        this.LocationService.getreports( this.id ).subscribe();
         this.LocationDetailsService.getAll_location_details().subscribe(  
              data =>  this.location_details = data,);
              
              
      } );

      
   
   }
  
  get isAdmin() {
      return this.currentlocation_detail  ;
   }
  
  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }
}
