import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BillsService } from '../../services/bills.service';
import { LocationService } from '../../services/location.service';
import { Bills } from '../../models/bills';
import { Location } from '../../models/locations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Role } from '../../models/role';
import { first } from 'rxjs/operators';
import { AdminsService } from '../../services/admins.service';
import { Admin } from '../../models/admins';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as moment from 'moment';
 
@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {
  admin: any;
  current: Admin[] = []
  rows: any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  bill: any

  currentbill: any;
  role: any
  bills: any
  selectedbill: any
  bills1: any = { _id: '', band: '', bill: 0, bills_id: '', date: '', material_price: 0 };
  submitted = false;
  cols: any[];
  displayDialogforadd: boolean;
  displayDialogforedit: boolean;
  newbills: boolean;
  columns: any[];
  exportColumns: any
  index: any;
  filterbill: any
  company: any
  location: any

  public id: string;
  url_id: any;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient,
    private BillsService: BillsService,
    private LocationService: LocationService,
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
  ngOnInit(): void {

    this.cols = [
      { field: 'id', header: 'ID', width: '5rem' },
      { field: 'band', header: 'Band', width: '20rem' },
      { field: 'material_price', header: 'Material Price', width: '18rem' },
      { field: 'bill', header: 'Bill', width: '15rem' },
      { field: 'Company Diffrence', header: 'Company Diffrence', width: '18rem' },

      { field: 'date', header: 'Date', width: '25rem' },


    ];

    this.getAll();
    this.admin = this.current
    this.getbilll();

  }


  exportExcel() {

    import("xlsx").then(xlsx => {
      const Heading = [
        ["البند", "سعر المواد الخام", "الفاتورة", "فرق الشركة", "التاريخ",],
      ];
      const ws = xlsx.utils.aoa_to_sheet(Heading);
      var wscols = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 25 }];
      ws['!cols'] = wscols;

      const worksheet = xlsx.utils.sheet_add_json(ws, this.filterbill, { skipHeader: true, origin: "A2" });
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Arcland location Bill");
    });
  }

  getbilll() {
    let filterbills = [];
    const id = this.bills1.bills_id

    this.BillsService.getAllbills().pipe(first()).subscribe(
      data => {
      this.bills = data;

        this.bills.forEach(elm => {
          this.company.forEach(elment => {
            if (elm._id == elment._id && elm.bills_id == this.route.snapshot.paramMap.get('id')) {
              const temp = [elm.band, elm.material_price, elm.bill, elment.value, moment(elm.date).format("dddd, MMMM Do YYYY")];;

              filterbills.push(temp);
              this.filterbill = filterbills
            }
          })
        })
      });
    return filterbills;

  }


  getdata() {
    let bills = [];
    this.bills.forEach(elm => {
      const temp = [elm.band, elm.bill, elm.material_price, elm.date];;
      bills.push(temp);
      console.log('Rows', bills); // showing all data
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
    this.url_id = this.route.snapshot.paramMap.get('id');

    this.AdminsService.getprofile().pipe(first()).subscribe(
      data => { this.admin = data });
    this.LocationService.getAll_location().pipe(first()).subscribe(
      data => { this.location = data 
      console.log(data)
      }

    )
    this.BillsService.company_diff().pipe(first()).subscribe(
      data => { this.company = data });
    this.id = this.route.snapshot.paramMap.get('id');
    this.BillsService.getAllbills().pipe(first()).subscribe(
      data => {
      this.bills = data,
        this.BillsService.getbill_by_id(this.id).subscribe();
      });
  }

  get isAdmin() {
    return this.currentbill;
  }
  showDialogToAdd() {
    this.newbills = true;
    this.bills1 = { _id: '', band: '', bill: 0, bills_id: '', date: '', material_price: 0 };

    this.displayDialogforadd = true;
  }
  showDialogToedit() {
    this.displayDialogforedit = true;
  }
  save(values) {
    this.bills1.bills_id = this.id
    this.bills1.date = new Date()

    this.BillsService.addbills(values).subscribe(res => {
      this.getAll()
      this.bill = null;
      this.displayDialogforadd = false;
      Swal.fire({
        text: 'you Add Anew Bill Successfully !',
        icon: 'success'
      });
    })

  }

  edit(myUpdatedData) {
    const id = this.selectedbill._id
    this.BillsService.getAllbills().subscribe(
      data => {
        this.bill = data;
        this.getAll()

        this.BillsService.update_bill_ById(id, myUpdatedData).subscribe(res => {
          this.displayDialogforedit = false;
          this.bill = null;
          Swal.fire({
            text: 'you Update Bill Data Successfully !',
            icon: 'success'
          });
        });
      });

  }

  delete() {
    const id = this.bills1._id
    let index = this.bills.indexOf(this.bills1);

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
        this.BillsService.deletebill(id).subscribe();
        this.bills = this.bills.filter((val, i) => i != index);
        this.displayDialogforedit = false;
        Swal.fire(
          'Deleted!',
          'Bill Deleted.',
          'success'
        )
      }
    })

  }
  onRowSelect(event) {
    this.newbills = false;
    this.selectedbill = this.clonedetail(event.data);
    this.displayDialogforedit = true;
  }

  clonedetail(c: Bills): Bills {
    let bills1 = { _id: '', band: '', bill: 0, bills_id: '', date: '', material_price: 0 };
    for (let prop in c) {
      bills1[prop] = c[prop];
    }
    return bills1;
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
