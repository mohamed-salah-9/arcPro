import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationDetailsService } from '../../services/location-details.service';
import { BandService } from '../../services/band.service';
import { LocationService } from '../../services/location.service';
import { Location_details } from '../../models/location_details';
import { Location } from '../../models/locations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Role } from '../../models/role';
import { Bills } from '../../models/bills';
import { Band } from '../../models/band';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

declare const firtstotal: any;
declare const secondtotal: any;
declare const thirdtotal: any;
declare const fourthtotal: any;
declare const fifthtotal: any;
declare const sixtotal: any;
import { AdminsService } from '../../services/admins.service';
import { Admin } from '../../models/admins';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-location_details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss']
})
export class LocationDetailsComponent implements OnInit {
  price_dif: any
  displaay: boolean = false;

  admin: any;
  current: Admin[] = []
  disabled: boolean = true;
  rows: any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  location_detail: any
  currentlocation_detail: any;
  role: any
  location_details: any
  location: any
  selectedlocation_details: any
  location_details1: any = {
    _id: '', band_id: '', actual_total_paid_for_the_item_from_the_customer: 0, actual_quantity: 0, date: '', price_per_square_meter: 0, required_from_the_customer: 0,
    the_price_difference: 0, the_total_cost_to_the_customer: 0, total_for_worker: 0, total_price_in_the_assay: 0, worker_payments_for_now: 0, Location_detail_id: 0,
    estimated_amount_of_assay: 0, left_for_worker: 0, price_per_square_meter_for_the_worker: 0
  };
  bills1: any = { _id: '', material_price: 0, date: '', bills_id: '', bill: 0, band: '' }
  submitted = false;
  cols: any[];
  displayDialogforadd: boolean;
  displayDialogforedit: boolean;
  newlocation_details: boolean;
  band: any;
  band1: any = { _id: '', name: '' }
  columns: any[];
  exportColumns: any
  index: any;
  total: any
  total_for_worker: any
  public id: any;
  url_id: any;
  divid: any
  filterlocation: any
  total_payment_worker: any
  worker_payment: any
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient,
    private LocationDetailsService: LocationDetailsService,
    private LocationService: LocationService,
    private BandService: BandService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private route: ActivatedRoute,
    private AdminsService: AdminsService,
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
    //  العواميد المستخدمه ف الجداول وممكن تعديل العرض والارتفاع من هنا
    this.cols = [

      { field: 'estimated_amount_of_assay', header: 'estimated_amount_of_assay', width: '16rem' },
      { field: 'price_per_square_meter', header: 'price_per_square_meter', width: '15rem' },
      { field: 'total_price_in_the_assay', header: 'total_price_in_the_assay', width: '15rem' },
      { field: 'actual_quantity', header: 'actual_quantity', width: '15rem' },
      { field: 'the_total_cost_to_the_customer', header: 'the_total_cost_to_the_customer', width: '15rem' },
      { field: 'price_per_square_meter_for_the_worker', header: 'price_per_square_meter_for_the_worker', width: '15rem' },
      { field: 'total_for_worker', header: 'total_for_worker', width: '15rem' },
      { field: 'worker_payments_for_now', header: 'worker_payments_for_now', width: '15rem' },
      { field: 'left_for_worker', header: 'left_for_worker', width: '15rem' },
      { field: 'the_price_difference', header: 'the_price_difference', width: '15rem' },
      { field: 'required_from_the_customer', header: 'required_from_the_customer', width: '15rem' },
      { field: 'date', header: 'date', width: '20rem' },
      { field: 'Location_detail_id', header: 'Location_detail_id', width: '16rem' },

    ];

    this.getAll();
    this.admin = this.current
    this.getdetails()

  }
  // الفانكشن الجاهزه لتصدير البيانات لملف اكسيل
  exportExcel() {
    import("xlsx").then(xlsx => {
      const Heading = [
        ["البند", "كمية المقايسة التقديرية", "سعر المتر ف المقايسة", "اجمالى السعر  فى المقايسة", "الكمية الفعلية", "اجمالى التكلفة على العميل", "سعر المتر للصنايعى", "اجمالى للصنايعى", "دفعات الصنايعى حتى الان", "متبقى للصنايعى", "فرق مصنعيات", "التاريخ", "الموقع"],
      ]
      const ws = xlsx.utils.aoa_to_sheet(Heading);
      var wscols = [{ wch: 18 }];
      ws['!cols'] = wscols;
      const worksheet = xlsx.utils.sheet_add_json(ws, this.filterlocation, { skipHeader: true, origin: "A2" });
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Arcland Location Details");
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
    this.LocationDetailsService.getAll_location_details().pipe(first()).subscribe(
      data => {
        this.location_details = data;
        this.BandService.getband().pipe(first()).subscribe(
          data => {
            this.band = data
            this.LocationService.getAll_location().pipe(first()).subscribe(
              data => {
                this.location = data

                this.location_details.forEach(elm => {
                  this.location.forEach(element => {
                    this.total_payment_worker.forEach(elme => {
                      this.price_dif.forEach(price => {
                        if (price._id == elm._id && elm._id == elme._id && elm.Location_detail_id == this.route.snapshot.paramMap.get('id') && element._id == elm.Location_detail_id) {
                          const temp = [elm.band_name, elm.estimated_amount_of_assay, elm.price_per_square_meter, elm.total_price_in_the_assay, elm.actual_quantity, elm.the_total_cost_to_the_customer, elm.price_per_square_meter_for_the_worker,
                          elm.total_for_worker, elme.value, elme.diffrence, price.value, moment(elm.date).format("dddd, MMMM Do YYYY"), element.location];;
                          filterlocation.push(temp);
                          this.filterlocation = filterlocation
                        }
                      }
                      )
                    }
                    )
                  })
                })
              })
          })
      });
    return filterlocation;
  }






  // الحصول على البيانات من الداتا بيز وعرضها ف الصفحه

  getAll() {
    this.url_id = this.route.snapshot.paramMap.get('id');
    this.paymentForm = this.fb.group({

      worker_payments_for_now: new FormControl(),
    }),

      this.id = this.route.snapshot.paramMap.get('id');
    this.AdminsService.getprofile().pipe(first()).subscribe(
      data => { this.admin = data });

    this.LocationService.getAll_location().pipe(first()).subscribe(
      data => { this.location = data }
    )
    this.LocationDetailsService.gettotal_payment_worker().subscribe(
      data => {
        this.total_payment_worker = data,
        console.log(this.total_payment_worker)
      },

    )
    this.LocationService.price_diff().pipe(first()).subscribe(
      data => { this.price_dif = data }

    )

    this.LocationDetailsService.getAll_location_details().pipe(first()).subscribe(
      data => {
        this.location_details = data,
          this.worker_payment = data.map(res => res.worker_payments_for_now);
        this.LocationDetailsService.getlocation_detail_by_id(this.id).subscribe();
      });


    this.LocationDetailsService.getAll_location_details().pipe(first()).subscribe(
      data => {
        this.location_details = data,
          this.LocationService.total(this.id).subscribe(res => {
            this.total = res

            let total = res['location_details'].map(res => res.TotalAmountforworker);
            let bills = res['bills'].map(res => res.TotalAmountforbills);
            this.divid = bills - total
          })
      })
    this.BandService.getband().pipe(first()).subscribe(
      data => { this.band = data },

    );


  }

  get isAdmin() {
    return this.currentlocation_detail;
  }

  // لعرض فورمه ادخال بيانات جديده
  showDialogToAdd() {
    this.newlocation_details = true;
    this.location_details1 = {
      _id: '', band_id: '', actual_total_paid_for_the_item_from_the_customer: 0, actual_quantity: 0, date: '', price_per_square_meter: 0, required_from_the_customer: 0,
      the_price_difference: 0, the_total_cost_to_the_customer: 0, total_for_worker: 0, total_price_in_the_assay: 0, worker_payments_for_now: 0, Location_detail_id: 0,
      estimated_amount_of_assay: 0, left_for_worker: 0, price_per_square_meter_for_the_worker: 0
    };
    this.displayDialogforadd = true;
  }
  // لعرض فورمه تعديل وحذف البيانات 
  showDialogToedit() {
    this.displayDialogforedit = true;
  }
  // الفانكشن المسئولة عن حفظ البيانات المدخله من الفورمه الى الداتا بيز
  save(values) {
    this.location_details1.Location_detail_id = this.id
    this.LocationDetailsService.addLocation_details(values).subscribe(res => {
      this.getAll();
      this.location_detail = null;

      this.displayDialogforadd = false;
      Swal.fire({
        text: ' Location Detail Added Successfully  !',
        icon: 'success'
      })
    },
      error => {
        Swal.fire({
          text: 'please select band name then try again !',
          icon: 'error',
        })
      });

  }
  //  الفانكشن المسئولة عن تعديل البيانات وتحديثها ف الداتا بيز
  edit(myUpdatedData) {
    const id = this.selectedlocation_details._id

    this.LocationDetailsService.getAll_location_details().subscribe(
      data => {
        this.location_detail = data;
        this.LocationDetailsService.update_location_detail_ById(id, myUpdatedData).subscribe(res => {
          this.getAll()
          this.displayDialogforedit = false;
          this.location_detail = null;
          Swal.fire({
            text: 'you Updated  this location Detail Successfully  !',
            icon: 'success'
          })
        });
      });

  }
  paymentForm: FormGroup;

  get u() { return this.paymentForm.controls; }

  show() {

    this.displaay = true;
  }

  addpayment(myUpdatedData) {
    const id = this.selectedlocation_details._id
    this.LocationDetailsService.getAll_location_details().subscribe(
      data => {
        this.location_details = data;
        this.LocationDetailsService.addpayment_worker(id, myUpdatedData).subscribe(res => {
          this.displayDialogforedit = false;
          this.location_detail = null;
          this.getAll()

          Swal.fire({
            text: 'Payment added successfully !',
            icon: 'success'
          })
        });
      });

  }
  //  الفانكشن المسئولة عن حذف البيانات 
  delete() {
    const id = this.location_details1._id
    let index = this.location_details.indexOf(this.location_details1);
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
        this.LocationDetailsService.deletelocation_detail(id).subscribe();
        this.location_details = this.location_details.filter((val, i) => i != index);
        this.displayDialogforedit = false;
        Swal.fire(
          'Deleted!',
          'this location detailed Deleted.',
          'success'
        )
      }
    })

  }
  // الفانكشن المسئولة عند الضغط على صف ف الجدول تقوم بجلب البيانات الخاصه بيه
  onRowSelect(event) {
    this.newlocation_details = false;
    this.selectedlocation_details = this.clonedetail(event.data);
    this.displayDialogforedit = true;
  }

  clonedetail(c: Location_details): Location_details {
    let location_details1 = {
      _id: '', band_id: '', actual_total_paid_for_the_item_from_the_customer: 0, actual_quantity: 0, date: '', price_per_square_meter: 0, required_from_the_customer: 0,
      the_price_difference: 0, the_total_cost_to_the_customer: 0, total_for_worker: 0, total_price_in_the_assay: 0, worker_payments_for_now: 0, Location_detail_id: 0,
      estimated_amount_of_assay: 0, left_for_worker: 0, price_per_square_meter_for_the_worker: 0
    };
    for (let prop in c) {
      location_details1[prop] = c[prop];
    }
    return location_details1;
  }
  // اول معادله ف فورمه الادخال
  first() {
    firtstotal();
    this.location_details1.total_price_in_the_assay = (this.location_details1.estimated_amount_of_assay) * (this.location_details1.price_per_square_meter)
  }
  // تانى معادله ف فورمه الادخال
  second() {

    secondtotal();
    this.location_details1.the_total_cost_to_the_customer = (this.location_details1.actual_quantity) * (this.location_details1.price_per_square_meter)
  }
  // ثالث معادله ف فورمه الادخال
  third() {
    thirdtotal();
    this.location_details1.total_for_worker = (this.location_details1.price_per_square_meter_for_the_worker) * (this.location_details1.actual_quantity)

  }
  // رابع معادله ف فورمه الادخال
  fourth() {
    fourthtotal();
    this.location_details1.left_for_worker = (this.total_payment_worker.diffrence) - (this.total_payment_worker.value)

  }
  // خامس معادله ف فورمه الادخال


  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
