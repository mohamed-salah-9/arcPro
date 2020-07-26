import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {Admin } from './../../models/admins';
import {AdminsService} from './../../services/admins.service';
import { ActivatedRoute,Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Subscription } from "rxjs";
import {MessageService} from 'primeng/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertService} from './../../services/alert.service';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations,
  providers: [MessageService]

})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  Admin:any;
  submitted = false;
  error = '';
  private authStatusSub: Subscription;
  isLoading = false;

  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
      private _fuseConfigService: FuseConfigService,
      private _formBuilder: FormBuilder,
      private AdminsService:AdminsService,
      private AlertService:AlertService,

      private router: Router,private messageService: MessageService
  )
  {
      // Configure the layout
      this._fuseConfigService.config = {
          layout: {
              navbar   : {
                  hidden: true
              },
              toolbar  : {
                  hidden: true
              },
              footer   : {
                  hidden: true
              },
              sidepanel: {
                  hidden: true
              }
          }
      };
    //   if (this.AdminsService.loggedIn) { 
    //     this.router.navigate(['/']);
    // }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
      this.loginForm = this._formBuilder.group({
          email   :  [ '',Validators.required],
          password:  ['',Validators.compose([Validators.required, Validators.minLength(6)])]
      });
      this.authStatusSub = this.AdminsService.getAuthStatusListener().subscribe(
        authStatus => {
            this.isLoading = false;
        }
      );
  }


  get f() { return this.loginForm.controls; }




 
  loginUser( ) {
    this.submitted = true;
    if (this.loginForm.invalid) {
        return;
    }    
    
    this.AdminsService.login(this.loginForm.value).pipe(first())
    .subscribe(
        data => {
            this.router.navigate(['/home']);
        },
        error => {
            this.AlertService.error(error);
         });
}
    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
      }
}
