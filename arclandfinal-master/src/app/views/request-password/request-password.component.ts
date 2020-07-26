import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import {AdminsService  } from '../../services/admins.service';
import { Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AlertService} from './../../services/alert.service';

@Component({
  selector: 'app-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class RequestPasswordComponent implements OnInit {
  RequestResetForm: FormGroup;
  forbiddenEmails: any;
  errorMessage: string;
  successMessage: string;
  IsvalidForm = true;
  error = '';

  /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
  constructor(    private AdminsService: AdminsService,
    private router: Router, 
    private _fuseConfigService: FuseConfigService,
    private AlertService:AlertService,

 ) { 

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


 }

  ngOnInit() {
    this.RequestResetForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
    });
  }


  RequestResetUser(form) {
     if (form.valid) {
      this.IsvalidForm = true;
      this.AdminsService.requestReset(this.RequestResetForm.value).subscribe(
        data => {
          this.RequestResetForm.reset();
          this.successMessage = "Reset password link send to email sucessfully.";
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['login']);
          }, 3000);
        },
        error => {
          this.AlertService.error(error);
       });
    } else {
      this.IsvalidForm = false;
    }
  }
}