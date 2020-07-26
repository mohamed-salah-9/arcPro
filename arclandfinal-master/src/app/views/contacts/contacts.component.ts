import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from " ./../environments/environment";
const BACKEND_URL = environment.Url;
import { AdminsService } from '../../services/admins.service';
import { Admin } from '../../models/admins';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  admin: any;
  current: Admin[] = []
  rows: any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  contact: any;
  contacts: any
  selectcontact: any
  role: any
  cols: any[];
  columns: any[];

  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private _httpClient: HttpClient,
    private AdminsService: AdminsService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private ContactService: ContactService,
  ) {
    this.loadingIndicator = true;
    this.reorderable = true;

    //Set the private defaults
    this._unsubscribeAll = new Subject();
    this._fuseTranslationLoaderService.loadTranslations(english, turkish);
  }


  ngOnInit() {
    this.getAll();
    this.admin = this.current
    this.cols = [
      { field: 'id', header: 'ID', width: '4rem' },
      { field: 'name', header: 'name', width: '8rem' },
      { field: 'mobile', header: 'mobile', width: '10rem' },
      { field: 'email', header: 'email', width: '15rem' },
      { field: 'unit_type', header: 'unit_type', width: '8rem' },
      { field: 'total_area', header: 'total_area', width: '8rem' },
      { field: 'unit_locations', header: 'unit_locations', width: '8rem' },
      { field: 'best_time', header: 'best_time', width: '10rem' },
      { field: 'Action', header: 'Action', width: '10rem' },
    ];

  }

  getAll() {
    this.ContactService.getcontacts().pipe(first()).subscribe(
      data => {
        this.contacts = data
      });


    this.AdminsService.getprofile().pipe(first()).subscribe(
      data => { this.admin = data });

  }


  delete(id) {
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
        this.ContactService.deletecontact(id).subscribe(data => {
          this.getAll();
        });
        Swal.fire(
          'Deleted!',
          'Images Deleted.',
          'success'
        )
      }
    })
  }






  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


}
