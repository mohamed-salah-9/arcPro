
/*   @angular and @fuse *********/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AgmCoreModule } from '@agm/core';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { fuseConfig } from 'app/fuse-config';
import { FormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEg from '@angular/common/locales/ar-EG';
import { FileUploadModule } from 'primeng/fileupload';
import { OrderModule } from 'ngx-order-pipe';
import { InputTextareaModule } from 'primeng/inputtextarea';

/******  angular fonteawesome *********/
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

/******  services *********/
import { AdminsService } from './services/admins.service';
import { LocationDetailsService } from './services/location-details.service';
import { AuthInterceptor } from './helpers/admin-intersptors';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { AuthGuard } from './helpers/auth.gaurd';
import { Role } from './models/role';
import { LocationService } from './services/location.service';
import { BussinesService } from './services/bussines.service';
import { AlertService } from './services/alert.service';
import { BandService } from './services/band.service';
import { NumericDirective } from "./numeric.directive";

/******  primeng Module *********/
import { GalleriaModule } from 'primeng/galleria';

import { SidebarModule } from 'primeng/sidebar';
import { GMapModule } from 'primeng/gmap';
import { ChartModule } from 'primeng/chart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog'
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { LightboxModule } from 'primeng/lightbox';

/******   ngx Module  *********/
import { CountdownModule } from 'ngx-countdown';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartsModule } from 'ng2-charts';
import { ExportAsModule } from 'ngx-export-as';

/******   components  *********/
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { HomeComponent } from './home/home.component';
import { AdminsComponent } from './views/admins/admins.component';
import { LoginComponent } from './views/login/login.component';
import { BusinessComponent } from './views/business/business.component';

import { AlertComponent } from './views/alert/alert.component';
import { LocationComponent } from './views/location/location.component';
import { LocationDetailsComponent } from './views/location-details/location-details.component';
import { RequestPasswordComponent } from './views/request-password/request-password.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { BillsComponent } from './views/bills/bills.component';
import { ReportsComponent } from './views/reports/reports.component';
import { WebsiteImagesComponent } from './views/website-images/website-images.component';
import { WebsiteDetailsComponent } from './views/website-details/website-details.component';
import { WebsiteVideosComponent } from './views/website-videos/website-videos.component';
import { SponsersComponent } from './views/sponsers/sponsers.component';
import { ContactsComponent } from './views/contacts/contacts.component';



registerLocaleData(localeEg);


const appRoutes: Routes = [

    {
        path: 'home', component: HomeComponent,
        canActivate: [AuthGuard],



    },
    {
        path: 'admins', component: AdminsComponent,
        canActivate: [AuthGuard],

    },
    {
        path: 'upload_images', component: WebsiteImagesComponent,
        canActivate: [AuthGuard],

    },
    {
        path: 'website_detail', component: WebsiteDetailsComponent,
        canActivate: [AuthGuard],

    },
    {
        path: 'website_videos', component: WebsiteVideosComponent,
        canActivate: [AuthGuard],

    },
    {
        path: 'sponsors', component: SponsersComponent,
        canActivate: [AuthGuard],

    },
    {
        path: 'business', component: BusinessComponent,
        canActivate: [AuthGuard],

    },
    {
        path: 'contacts', component: ContactsComponent,
        canActivate: [AuthGuard],

    }

    ,
    {
        path: 'location', component: LocationComponent,
        canActivate: [AuthGuard],

    }

    ,
    {
        path: 'location_details/:id', component: LocationDetailsComponent,
        canActivate: [AuthGuard],

    }
    , {
        path: 'reports/:id', component: ReportsComponent,
        canActivate: [AuthGuard],

    }
    ,
    {
        path: 'bills/:id', component: BillsComponent,
        canActivate: [AuthGuard],

    }
    ,
    {
        path: 'login', component: LoginComponent
    },

    {
        path: 'request-password',
        component: RequestPasswordComponent,
    },
    {
        path: 'reset-password/:token',
        component: ResetPasswordComponent
    },

    {
        path: '**',
        redirectTo: 'login',
        canActivate: [AuthGuard],

    }
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        BusinessComponent,
        AdminsComponent,
        LoginComponent,
        BusinessComponent,

        AlertComponent,
        LocationComponent,
        LocationDetailsComponent,
        RequestPasswordComponent,
        ResetPasswordComponent,
        BillsComponent,
        ReportsComponent,
        WebsiteImagesComponent,
        WebsiteDetailsComponent,
        WebsiteVideosComponent,
        SponsersComponent, NumericDirective, ContactsComponent
    ],
    imports: [
        MatButtonModule, FontAwesomeModule, FileUploadModule, OrderModule, LightboxModule,
        MatCheckboxModule, GalleriaModule,
        MatDatepickerModule, ConfirmDialogModule,
        MatFormFieldModule, NgxChartsModule, ChartsModule,
        MatIconModule, DropdownModule,
        MatInputModule, OverlayPanelModule, InputTextareaModule,
        MatMenuModule, FormsModule,
        MatRippleModule, ChartModule,
        MatTableModule, GMapModule,
        MatToolbarModule, SidebarModule, ToastModule,
        NgxDatatableModule, InputTextModule,
        FuseSharedModule, ButtonModule,
        FuseSidebarModule, ExportAsModule,
        BrowserModule, DataViewModule, MessagesModule, MessageModule
        , AccordionModule, DialogModule,
        BrowserAnimationsModule, ReactiveFormsModule,
        HttpClientModule, TableModule, CountdownModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SampleModule, AgmCoreModule.forRoot({
            apiKey: "AIzaSyAitE_UONnRxG9J5YvXkP7z79Rt6R3XuB8",
            libraries: ["places"]
            /* apiKey is required, unless you are a premium customer, in which case you can use clientId */
        })
    ],
    providers: [
        AdminsService, ConfirmationService, BandService, LocationService, BussinesService, AuthGuard, LocationDetailsService, AlertService, { provide: LOCALE_ID, useValue: 'ar-EG' },
        {
            provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
        },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
    constructor() {
        library.add(fas, far);
    }
}
