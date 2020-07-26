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
import { ImagesService } from '../../services/images.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Image } from "../../models/images";

@Component({
  selector: 'app-website-images',
  templateUrl: './website-images.component.html',
  styleUrls: ['./website-images.component.scss']

})

export class WebsiteImagesComponent implements OnInit {
  admin: any;
  current: Admin[] = []
  thumbnail: any;
  attachmentList: any = [];
  rows: any[];
  loadingIndicator: boolean;
  reorderable: boolean;
  multi_image: any;
  multi_images: any
  selectedmulti_image: any
  role: any
  multi_image1: any = { _id: '', title: '', description: '', images: '' };
  submitted = false;
  cols: any[];
  displayDialogforadd: boolean;
  displayDialogforedit: boolean;
  newmulti_image: boolean;
  columns: any[];
  images: any[];

  // Private
  private _unsubscribeAll: Subject<any>;


  image: Image
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
    private ImagesService: ImagesService,
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
      { field: 'Title', header: 'Title', width: '10rem' },
      { field: 'Description', header: 'Description', width: '10rem' },
      { field: 'Images', header: 'Images', width: '20rem' },
      { field: 'Action', header: 'Action', width: '10rem' },
    ];
    this.form = new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      files: new FormControl('')
    });
  }

  getAll() {
    this.ImagesService.getimages().pipe(first()).subscribe(
      data => {
        this.multi_images = data
      });


    this.AdminsService.getprofile().pipe(first()).subscribe(
      data => { this.admin = data });

  }
  showDialogToAdd() {
    this.newmulti_image = true;
    this.multi_image1 = { _id: '', title: '', description: '', images: '' };
    this.displayDialogforadd = true;
  }
  showDialogToedit() {
    this.displayDialogforedit = true;
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
        this.ImagesService.deleteimagesById(id).subscribe(
          data => {
            this.getAll();
          })
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
      text: 'images Added Successfully  !',
      icon: 'success'
    })
    this.ImagesService.getimages().subscribe(
      data => {
        this.getAll();
      })

  }

  selectimage(event, multi_images: Image, overlaypanel) {
    this.selectedmulti_image = multi_images;
    overlaypanel.toggle(event);
  }


  onBeforeUploadFoto(event: any) {
    event.formData.append('title', this.form.value.title,);
    event.formData.append('description', this.form.value.description,)


  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
