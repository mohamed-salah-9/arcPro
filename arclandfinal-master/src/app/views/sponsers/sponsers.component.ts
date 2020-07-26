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
import { SponsersService } from '../../services/sponsers.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Sponsors } from "../../models/sponsors";
@Component({
  selector: 'app-sponsers',
  templateUrl: './sponsers.component.html',
  styleUrls: ['./sponsers.component.scss']
})
export class SponsersComponent implements OnInit {
  admin: any;
  current: Admin[] = []
  thumbnail: any;
  attachmentList: any = [];
  rows: any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  sponsor: any;
  sponsors: any
  selectsponsor: any
  role: any

  sponsor1: any = { _id: '', image: '' };
  submitted = false;
  cols: any[];
  displayDialogforadd: boolean;
  displayDialogforedit: boolean;
  newsponsor: boolean;
  columns: any[];
  images: any[];
  // Private
  private _unsubscribeAll: Subject<any>;


  image: Sponsors
  form: FormGroup;
  imagePreview: string;
  private mode = "create";


  uploadedFiles: any[] = [];
  files: any
  fileInput: any

  constructor(
    private _httpClient: HttpClient,
    private AdminsService: AdminsService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private SponsersService: SponsersService,
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
      { field: 'images', header: 'Images', width: '20rem' },
      { field: 'Action', header: 'Action', width: '10rem' },
    ];
    this.form = new FormGroup({
      title: new FormControl(''),
      image: new FormControl('')
    });
  }

  getAll() {
    this.SponsersService.getsponsors().pipe(first()).subscribe(
      data => {
        this.sponsors = data
      });


    this.AdminsService.getprofile().pipe(first()).subscribe(
      data => { this.admin = data });

  }
  showDialogToAdd() {
    this.newsponsor = true;
    this.sponsor1 = { _id: '', title: '', description: '', images: '' };
    this.displayDialogforadd = true;
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
        this.SponsersService.deletesponsorsById(id).subscribe(data => {
          this.getAll();
        });
        this.displayDialogforedit = false;
        Swal.fire(
          'Deleted!',
          'Images Deleted.',
          'success'
        )
      }
    })
  }


  onUpload(event) {
    this.displayDialogforadd = false;

    Swal.fire({
      text: 'New Sponsor Added Successfully  !',
      icon: 'success'
    })
    this.SponsersService.getsponsors().subscribe(
      data => {
        this.getAll();
      })

  }





  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
