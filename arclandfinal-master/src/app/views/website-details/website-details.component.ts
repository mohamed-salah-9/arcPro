import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsiteDetailsService } from '../../services/website-details.service';
import { Detail } from '../../models/website_detail';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { first } from 'rxjs/operators';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AdminsService } from '../../services/admins.service';
import { Admin } from '../../models/admins';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-website-details',
  templateUrl: './website-details.component.html',
  styleUrls: ['./website-details.component.scss']
})
export class WebsiteDetailsComponent implements OnInit {
  admin: any;
  current: Admin[] = []
  rows: any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  detail: any
  currentdetails: any;
  details: any
  selected_details: any
  details1: any = { _id: '', phone: '', address: '' };
  role: any

  cols: any[];
  displayDialogforadd: boolean;
  displayDialogforedit: boolean;
  newdetails: boolean;
  columns: any[];
  index: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient,
    private WebsiteDetailsService: WebsiteDetailsService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private route: ActivatedRoute,
    private AdminsService: AdminsService,


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
  ngOnInit() {
    //  العواميد المستخدمه ف الجداول وممكن تعديل العرض والارتفاع من هنا
    this.cols = [

      { field: '_id', header: 'ID', width: '8rem' },
      { field: 'Phone1', header: 'Phone 1', width: '15rem' },
      { field: 'Phone2', header: 'Phone 2', width: '15rem' },
      { field: 'email1', header: 'email 1', width: '20rem' },
      { field: 'email2', header: 'email 2', width: '20rem' },
      { field: 'address', header: 'Address', width: '20rem' },

    ];

    this.getAll();
    this.admin = this.current


  }


  // الحصول على البيانات من الداتا بيز وعرضها ف الصفحه

  getAll() {

    this.WebsiteDetailsService.getAll_detail().pipe(first()).subscribe(
      data => {
        this.details = data
      })
    this.AdminsService.getprofile().pipe(first()).subscribe(
      data => { this.admin = data });

  }



  // لعرض فورمه ادخال بيانات جديده
  showDialogToAdd() {
    this.newdetails = true;
    this.details1 = { _id: '', phone: '', address: '' };
    this.displayDialogforadd = true;
  }
  // لعرض فورمه تعديل وحذف البيانات 
  showDialogToedit() {
    this.displayDialogforedit = true;
  }
  // الفانكشن المسئولة عن حفظ البيانات المدخله من الفورمه الى الداتا بيز
  save(values) {
    this.WebsiteDetailsService.adddetail(values).subscribe(res => {
      this.getAll();
      this.detail = null;

      this.displayDialogforadd = false;
      Swal.fire({
        text: ' Details Added Successfully  !',
        icon: 'success'
      })
    },
      error => {
        Swal.fire({
          text: 'please check the data then try again !',
          icon: 'error',
        })
      });

  }
  //  الفانكشن المسئولة عن تعديل البيانات وتحديثها ف الداتا بيز
  edit(myUpdatedData) {
    const id = this.selected_details._id

    this.WebsiteDetailsService.getAll_detail().subscribe(
      data => {
        this.detail = data;
        this.WebsiteDetailsService.update_detail_ById(id, myUpdatedData).subscribe(res => {
          this.getAll()
          this.displayDialogforedit = false;
          this.detail = null;
          Swal.fire({
            text: 'you Updated  this  Details Successfully  !',
            icon: 'success'
          })
        });
      });

  }


  //  الفانكشن المسئولة عن حذف البيانات 
  delete() {
    const id = this.details1._id
    let index = this.details.indexOf(this.details1);
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
        this.WebsiteDetailsService.deletedetail(id).subscribe();
        this.details = this.details.filter((val, i) => i != index);
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
    this.newdetails = false;
    this.selected_details = this.clonedetail(event.data);
    this.displayDialogforedit = true;
  }

  clonedetail(c: Detail): Detail {
    let details1 = {
      _id: '', phone: '', address: ''
    };
    for (let prop in c) {
      details1[prop] = c[prop];
    }
    return details1;
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
