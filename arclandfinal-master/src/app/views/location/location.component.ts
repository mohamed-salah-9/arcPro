import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { AdminsService } from '../../services/admins.service';
import { BussinesService } from '../../services/bussines.service';
import { Location } from '../../models/locations';
import { Admin } from '../../models/admins';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Role } from '../../models/role';
import { Bussiness } from '../../models/bussiness';
import { first } from 'rxjs/operators';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import Swal from 'sweetalert2/dist/sweetalert2.js';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  admin: any;
  current: Admin[] = []
  display: boolean = false;
  displaay: boolean = false;
  rows: any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  location: any
  admins: any;
  bussiness: any
  payment: any
  currentlocation: any;
  role: any
  supervision_fees:any
  locations: any
  selectedlocation: any
  location1: any = {
    _id: '', bussines_id: '', admin_id: '', band_Number: 0, completion_rate: 0, date: '', degree_of_progress: 0,
    fees_until_now: 0, location: '', payment: [], required_payment: 0, supervision_fees_required: 0, total_actual_expenses: 0, total_fees: 0
  };
  submitted = false;
  cols: any[];
  displayDialogforadd: boolean;
  displayDialogforedit: boolean;
  newlocation: boolean;
  columns: any[];
  exportColumns: any
  index: any;
  total: any
  all_total_payment: any
  total_for_worker: any
  winning:any
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
    private LocationService: LocationService,
    private AdminsService: AdminsService,
    private BussinesService: BussinesService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private fb: FormBuilder,


  ) {

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
  ngOnInit(): void {
    this.getAll();
 
    this.cols = [
      { field: 'id', header: 'ID' ,width: '4rem'},

      { field: 'location', header: 'location', width: '11rem'},
      { field: 'bussiness', header: 'Bussiness Name', width: '11rem' },
      { field: 'degree_of_progress', header: 'degree_of_progress', width: '10rem' },
      { field: 'completion_rate', header: 'completion_rate' , width: '7rem'},
      { field: 'payment', header: 'payment', width: '10rem' },
      { field: 'total_actual_expenses', header: 'total_actual_expenses', width: '10rem' },
      { field: 'required_payment', header: 'required_payment', width: '10rem' },
      { field: 'total_fees', header: 'total_fees', width: '10rem' },
      { field: 'fees_until_now', header: 'fees_until_now', width: '10rem'},
      { field: 'supervision_fees_required', header: 'supervision_fees_required', width: '10rem' },
      { field: 'winning', header: 'winning', width: '10rem' },
      { field: 'admin_id', header: 'admin_id' , width: '10rem'},

    ];

    this.admin = this.current
this.getdetails()
    this.paymentForm = this.fb.group({
      payment: new FormGroup({
        values: new FormControl(),
      }),
    })
    //   this.paymentForm.patchValue({
    //     firstName: 'abc'
    //  });
    this.productForm = this.fb.group({
      bussines_id: [''],
      location: [],
      degree_of_progress: [],
      completion_rate: [],
      required_payment: [],
      total_fees: [],
      fees_until_now: [],
      supervision_fees_required: [],
      payment: new FormGroup({
        values: new FormControl(),
      }),
    })
  }
  // الفانكشن الجاهزة لتصدير الجدول الى الاكسيل
  exportExcel() {
    import("xlsx").then(xlsx => {
         const Heading = [
          ["الموقع" , "العميل", "درجة التقدم", "نسبة الانجاز", "دفعات", "اجمالى مصروفات فعلية", "دفعات مطلوبة", "أتعاب اجمالية", "أتعاب حتى الان", "أتعاب اشراف مطلوبة","الأرباح"],
        ]
        const ws = xlsx.utils.aoa_to_sheet(Heading);
        var wscols = [{ wch: 20 },{ wch: 18 },{ wch: 11},{ wch: 11 },{ wch: 11 },{ wch: 14 },{ wch: 14 },
          { wch: 14 },{ wch: 14 },{ wch: 14 },{ wch: 11 },
        ];
        ws['!cols'] = wscols;
        const worksheet = xlsx.utils.sheet_add_json(ws, this.filterlocation, { skipHeader: true, origin: "A2" });
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Arcland Locations Info");
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
      data => {
      this.locations = data;
     this.LocationService.gettotal_payment().pipe(first()).subscribe(
      data => { this.all_total_payment = data 
    this.LocationService.getalltotal().pipe(first()).subscribe(
      data => {
      this.total = data
      this.LocationService.get_winng().pipe(first()).subscribe(
        data => {
        this.winning = data
      
    this.BussinesService.getbussiness().pipe(first()).subscribe(
                data => {
                this.bussiness = data     
              this.locations.forEach(elm => {
                  this.bussiness.forEach(elme => {
                    this.all_total_payment.forEach(element => {
                      this.total.forEach(elements => {
                        this.supervision_fees.forEach(fees => {
                          
                        this.winning.forEach(win => {
                        if (fees._id==elm._id&&elm.bussines_id == elme._id && elm._id == element._id && elm._id ==elements._id&& elm._id == win._id) {
                        const temp = [elm.location, elme.name, elm.degree_of_progress, elm.completion_rate, element.total_pays, elements.value, element.value,
                        elm.total_fees, elm.fees_until_now, fees.value,win.value];
                        filterlocation.push(temp);
                        this.filterlocation = filterlocation
 
                      }
                    })})
                  } )
                })
              })
              })
             })
            })
          }) 
         })
        })
    return filterlocation;
  }


 


  getAll() {
    this.AdminsService.getprofile().pipe(first()).subscribe(
      data => {
      this.admin = data

      });
    this.BussinesService.getbussiness().pipe(first()).subscribe(
      data => {
      this.bussiness = data

      },
    );
    this.LocationService.gettotal_payment().pipe(first()).subscribe(
      data => { this.all_total_payment = data }
    )
    this.LocationService.getalltotal().pipe(first()).subscribe(
      data => {
      this.total = data
      })
      this.LocationService.get_winng().pipe(first()).subscribe(
        data => {
        this.winning = data
        }) 
     this.LocationService.supervision_fees().pipe(first()).subscribe(
          data => {
          this.supervision_fees = data
          })
    this.LocationService.getAll_location().pipe(first()).subscribe(
      data => {
      this.locations = data;
        this.payment = data.map(res => res.payment);
      },
    );

    this.AdminsService.getadmins().pipe(first()).subscribe(
      data => { this.admins = data },
    );
    for (this.index = 0; this.index < 5; this.index++) {
      this.index
    }
     // add();
  }

  showDialog() {
    this.display = true;
  }
  show() {
 
    this.displaay = true;
  }
  get isAdmin() {
    return this.currentlocation;
  }
  showDialogToAdd() {
    this.newlocation = true;
      this.displayDialogforadd = true;
  }
  showDialogToedit() {
    this.displayDialogforedit = true;
  }

  productForm: FormGroup;
  paymentForm: FormGroup;

  get f() { return this.productForm.controls; }
  get u() { return this.paymentForm.controls; }

  save() {
    let locations = [...this.locations ];

    this.LocationService.addLocation(this.productForm.value).subscribe(res => {

       this.displayDialogforadd = false;
       this.productForm.reset()
       this.getAll();
      Swal.fire({
        text: 'Location added succefully  !',
        icon: 'success',}) },
        error=>{
          Swal.fire({
            text: 'please select bussiness name then try again !',
            icon: 'error',})
        }
    );
    // locations[this.locations.indexOf(this.productForm.value)] = this.productForm.value;
    // this.locations = locations;
   
    // .then((result) => {
    //   // Reload the Page
    //   location.reload();
    // });
   

  }

  edit(myUpdatedData) {

    const id = this.selectedlocation._id
    this.LocationService.getAll_location().subscribe(
      data => {
        this.location = data;
        this.LocationService.update_location_ById(id, myUpdatedData).subscribe();
      });
    this.displayDialogforedit = false;
    this.locations[this.locations.indexOf(this.selectedlocation)] = this.location1;
    this.locations = this.locations;
    this.location = null;
    Swal.fire({
      text: 'you Updated location Data Successfully !',
      icon: 'success'
    });
  }

  delete() {
    const id = this.location1._id
    let index = this.locations.indexOf(this.location1);

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.LocationService.deletelocation(id).subscribe();
        this.locations = this.locations.filter((val, i) => i != index);
        this.displayDialogforedit = false;
        Swal.fire(
          'Deleted!',
          'Location Deleted.',
          'success'
        )
      }
    })

  }
  onRowSelect(event) {
    this.newlocation = false;
    this.selectedlocation = this.clonedetail(event.data);
    this.displayDialogforedit = true;
  }

  clonedetail(c: Location): Location {
    let location1 = {
      _id: '', admin_id: '', band_Number: 0, completion_rate: 0, date: '', degree_of_progress: 0,
      fees_until_now: 0, location: '', bussines_id: '', payment: [], required_payment: 0, supervision_fees_required: 0, total_actual_expenses: 0, total_fees: 0
    };
    for (let prop in c) {
      location1[prop] = c[prop];
    }
    return location1;
  }

  addpayment(myUpdatedData) {
    const id = this.selectedlocation._id
    this.LocationService.getAll_location().subscribe(
      data => {
        this.location = data;
        this.LocationService.addpayment(id, myUpdatedData).subscribe(res=>{
          this.displayDialogforedit = false;
          this.location = null;
          this.getAll()

          Swal.fire({
            text: 'Payment added successfully !',
            icon: 'success'
          })
        });
      });
    
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


