import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BussinesService } from '../../services/bussines.service';
import { Bussiness } from '../../models/bussiness';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Role } from '../../models/role';
import { first } from 'rxjs/operators';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { FileUploader } from 'ng2-file-upload';
import { environment } from " ./../environments/environment";
const BACKEND_URL = environment.Url;
const URL = BACKEND_URL + 'bussiness';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileItem } from 'ng2-file-upload';
import { AdminsService } from '../../services/admins.service';
import { Admin } from '../../models/admins';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {
  admin: any;
  current: Admin[] = []
  // newChild = new Bussiness;
  thumbnail: any;
  attachmentList: any = [];
  images: any
  rows: any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  bussiness: any;
  bussinesss: any
  selectedbussiness: any
  role: any
  bussiness1: any = { _id: '', address: '', name: '', email: '', phone: '' };
  submitted = false;
  cols: any[];
  displayDialogforadd: boolean;
  displayDialogforedit: boolean;
  newbussiness: boolean;
  columns: any[];
  public uploader: FileUploader = new FileUploader({
    url: URL, itemAlias: 'image', allowedMimeType: ['image/png', 'image/gif', 'video/mp4', 'image/jpeg']

  });
  uploadedFiles: any[] = [];
  public imageUrlPath: SafeUrl;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient,
    private BussinesService: BussinesService,
    private AdminsService: AdminsService,

    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private sanitizer: DomSanitizer
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
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;

    };
    // //overide the onCompleteItem property of the uploader so we are 
    // //able to deal with the server response.
    // this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
    //      console.log("ImageUpload:uploaded:", item, status, response);
    //  };




    this.getAll();
    this.admin = this.current

    this.cols = [
      { field: 'id', header: 'ID', width: '4rem' },
      { field: 'name', header: 'Name', width: '25rem' },
      { field: 'phone', header: 'phone', width: '22rem' },
      { field: 'email', header: 'email', width: '25rem' },
      { field: 'address', header: 'address', width: '25rem' },
    ];
  }


  exportExcel() {
    let bussinesss = [];
    this.bussinesss.forEach(elm => {
      const temp = [elm.name, elm.email, elm.phone, elm.address,];
      bussinesss.push(temp);
    });
    import("xlsx").then(xlsx => {
      const Heading = [
        ["ألاسم", "الايميل", "رقم التليفون", "العنوان",],
      ];
      const ws = xlsx.utils.aoa_to_sheet(Heading);
      var wscols = [{ wch: 25 }, { wch: 35 }, { wch: 20 }, { wch: 25 }];
      ws['!cols'] = wscols;
      const worksheet = xlsx.utils.sheet_add_json(ws, bussinesss, { skipHeader: true, origin: "A2" });
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Arcland Bussiness Data");
    });
  }
  getdata() {
    let bussinesss = [];
    for (let business of this.bussinesss) {
      business.name = business.name.toString();
      bussinesss.push(business);
    }
    return bussinesss;
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




  uploadFiles($event: any) {
    this.uploader.options.additionalParameter = {

    };

    // this.bussiness1.image= $event.target.files[0].name;
    this.uploader.uploadAll();
  }


  getAll() {
    this.BussinesService.getbussiness().pipe(first()).subscribe(
      data => { this.bussinesss = data });
    this.AdminsService.getprofile().pipe(first()).subscribe(
      data => { this.admin = data });

  }

  showDialogToAdd() {
    this.newbussiness = true;
    this.bussiness1 = { _id: '', address: '', name: '', email: '', phone: '' };
    this.displayDialogforadd = true;
  }
  showDialogToedit() {
    this.displayDialogforedit = true;
  }
  save(values) {
    this.BussinesService.makebussiness(values).subscribe(res => {
      this.getAll();
      Swal.fire({
        text: 'you Add bussiness  Successfully !',
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
    const id = this.selectedbussiness._id
    this.BussinesService.getbussiness().subscribe(
      data => {
        this.bussiness = data;
        this.BussinesService.updatebussiness_ById(id, myUpdatedData).subscribe(res => {
          this.getAll();
          Swal.fire({
            text: 'you edit bussiness Successfully !',
            icon: 'success',
          })
        },
          error => {
            Swal.fire({
              text: 'please edit correct data !',
              icon: 'error',
            });
          })
      });

    this.displayDialogforedit = false;

  }

  delete() {
    const id = this.bussiness1._id
    let index = this.bussinesss.indexOf(this.bussiness1);
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
        this.BussinesService.deletebussinessById(id).subscribe();
        this.bussinesss = this.bussinesss.filter((val, i) => i != index);
        this.displayDialogforedit = false;
        Swal.fire(
          'Deleted!',
          'Bussiness Deleted.',
          'success'
        )
      }
    })
  }
  onRowSelect(event) {
    this.newbussiness = false;
    this.selectedbussiness = this.clonedetail(event.data);
    this.displayDialogforedit = true;
  }

  clonedetail(c: Bussiness): Bussiness {
    let bussiness1 = { _id: '', address: '', name: '', email: '', phone: '' };
    for (let prop in c) {
      bussiness1[prop] = c[prop];
    }
    return bussiness1;
  }
  onFileChanged(event) {
    console.log(event.target.files[0].name);
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
