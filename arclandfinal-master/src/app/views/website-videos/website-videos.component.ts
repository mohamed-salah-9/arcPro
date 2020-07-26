import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from " ./../environments/environment";
const BACKEND_URL = environment.Url;
const URL = BACKEND_URL + 'bussiness';
import { AdminsService } from '../../services/admins.service';
import { Admin } from '../../models/admins';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { WebsiteVideosService } from '../../services/website-videos.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Vidoe } from "../../models/videos";

@Component({
  selector: 'app-website-videos',
  templateUrl: './website-videos.component.html',
  styleUrls: ['./website-videos.component.scss']
})
export class WebsiteVideosComponent implements OnInit {
  admin: any;
  current: Admin[] = []
  thumbnail: any;
  attachmentList: any = [];
  rows: any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  video: any;
  videos: any
  selectedvideos: any
  role: any
  videos1: any = { _id: '', video: '' };
  submitted = false;
  cols: any[];
  displayDialogforadd: boolean;
  displayDialogforedit: boolean;
  newvideo: boolean;
  columns: any[];
  // Private
  private _unsubscribeAll: Subject<any>;


  image: Vidoe
  images = [];
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
    private WebsiteVideosService: WebsiteVideosService,
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

      { field: 'videos', header: 'videos', width: '30rem' },
      { field: 'Action', header: 'Action', width: '13rem' },
    ];
    // this.form = new FormGroup({
    //   title: new FormControl(''),
    //   description: new FormControl(''),
    //   files: new FormControl('')
    // });
  }

  getAll() {
    this.WebsiteVideosService.getvideos().pipe(first()).subscribe(
      data => {
        this.videos = data
      });


    this.AdminsService.getprofile().pipe(first()).subscribe(
      data => { this.admin = data });

  }
  showDialogToAdd() {
    this.newvideo = true;
    this.videos1 = { _id: '', title: '', description: '', images: '' };
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
        this.WebsiteVideosService.deletevideoById(id).subscribe(
          data => {
            this.getAll();
          })
        Swal.fire(
          'Deleted!',
          'Video Deleted.',
          'success'
        )
      }
    })
  }


  onUpload(event) {

    this.displayDialogforadd = false;

    Swal.fire({
      text: 'Video Added Successfully  !',
      icon: 'success'
    })
    this.WebsiteVideosService.getvideos().subscribe(
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
