import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminsService } from '../../services/admins.service';
import { Admin } from '../../models/admins';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Role } from '../../models/role';
import { first } from 'rxjs/operators';
import { environment } from " ./../environments/environment";
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { FileUploader } from 'ng2-file-upload';
const BACKEND_URL = environment.Url;

const URL = BACKEND_URL + 'admin';
const Url = BACKEND_URL + 'admins/update';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit, OnDestroy {
  id: any
  rows: any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  admin: any;
  current: Admin[] = []
  currentUser: any;
  role: any
  admins: any[]
  selectedadmin: any
  admin1: any = { _id: '', image: '', address: '', fullname: '', role: '', status: 1, email: '', password: '', phone: '' };
  submitted = false;
  cols: any[];
  displayDialogforadd: boolean;
  displayDialogforedit: boolean;
  newadmin: boolean;
  columns: any[];
  exportColumns: any
  index: any;
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'image', allowedMimeType: ['image/png', 'image/gif', 'video/mp4', 'image/jpeg'] });
  public update: FileUploader = new FileUploader({ url: Url, itemAlias: 'image', allowedMimeType: ['image/png', 'image/gif', 'video/mp4', 'image/jpeg'] });

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient,
    private AdminsService: AdminsService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService

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



    this.cols = [
      { field: 'id', header: 'ID', width: '4rem' },

      { field: 'fullname', header: 'Name', width: '20rem' },
      { field: 'Role', header: 'Role', width: '12rem' },

      { field: 'email', header: 'Email', width: '25rem' },
      { field: 'phone', header: 'phone', width: '16rem' },
      { field: 'address', header: 'address', width: '22rem' },
    ];

    this.getAll();
    this.admin = this.current

  }

  exportExcel() {
    let admins = [];

    this.admins.forEach(elm => {
      const temp = [elm.fullname, elm.email, elm.phone, elm.address,];
      admins.push(temp);
    });
    import("xlsx").then(xlsx => {
      const Heading = [
        ["ألاسم", "الايميل", "رقم التليفون", "العنوان",],
      ];
      const ws = xlsx.utils.aoa_to_sheet(Heading);
      var wscols = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 25 }];
      ws['!cols'] = wscols;
      const worksheet = xlsx.utils.sheet_add_json(ws, admins, { skipHeader: true, origin: "A2" });
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Arcland Admins");
    });
  }

  getdata() {
    let admins = [];
    this.admins.forEach(elm => {
      const temp = [elm.fullname, elm.email, elm.phone, elm.address,];;
      admins.push(temp);
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





  getAll() {
    this.AdminsService.getadmins().pipe(first()).subscribe(
      data => { this.admins = data },
    );
    this.AdminsService.getprofile().pipe(first()).subscribe(
      data => { this.admin = data });

    for (this.index = 0; this.index < 5; this.index++) {
      this.index
    }
  }




  get isAdmin() {
    return this.currentUser;
  }
  showDialogToAdd() {
    this.newadmin = true;
    this.admin1 = { _id: '', image: '', address: '', fullname: '', role: '', status: 1, email: '', password: '', phone: '' };
    this.displayDialogforadd = true;
  }
  showDialogToedit() {
    this.displayDialogforedit = true;
  }
  save(values) {
    this.AdminsService.addadmin(values).subscribe(res => {
      this.getAll();
      Swal.fire({
        text: 'you Add Admin Account Successfully !',
        icon: 'success',
      })
    },
      error => {
        Swal.fire({
          text: 'please provide correct data !',
          icon: 'error',
        })
      }
    );
    this.displayDialogforadd = false;

  }

  edit(myUpdatedData) {
    const id = this.selectedadmin._id
    this.AdminsService.getadmins().subscribe(
      data => {
        this.admins = data;
        this.AdminsService.updateadmin_ById(id, myUpdatedData).subscribe(res => {
          this.getAll();
          Swal.fire({
            text: 'you edit Admin Account Successfully !',
            icon: 'success',
          })
        },
          error => {
            Swal.fire({
              text: 'please edit correct data !',
              icon: 'error',
            });
          })
      })
    this.displayDialogforedit = false;

  }

  delete() {
    const id = this.admin1._id
    let index = this.admins.indexOf(this.admin1);
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
        this.AdminsService.deleteadminById(id).subscribe();
        this.admins = this.admins.filter((val, i) => i != index);
        this.displayDialogforedit = false;
        Swal.fire(
          'Deleted!',
          'Account Deleted.',
          'success'
        )
      }
    })


  }
  onRowSelect(event) {
    this.newadmin = false;
    this.selectedadmin = this.clonedetail(event.data);
    this.displayDialogforedit = true;
  }

  clonedetail(c: Admin): Admin {
    let admin1 = { _id: '', image: '', address: '', fullname: '', role: '', status: 1, email: '', password: '', phone: '' };
    for (let prop in c) {
      admin1[prop] = c[prop];
    }
    return admin1;
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

