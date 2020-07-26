import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { GalleryComponent } from './layout/gallery/gallery.component';
import { StepsComponent } from './layout/steps/steps.component';
import { ContactComponent } from './views/contact/contact.component';
import { AboutUsComponent } from './views/about-us/about-us.component';
import { HeadComponent } from './layout/head/head.component';
import { PhotosComponent } from './views/photos/photos.component';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule
} from '@angular/material';
import {MatStepperModule} from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule   } from '@angular/forms';
import { FooterComponent } from './layout/footer/footer.component';
import { ServicesComponent } from './views/services/services.component';
import { DetailsService } from './services/details.service';
import { SingleimgComponent } from './views/singleimg/singleimg.component';
import { NumericDirective } from "./numeric.directive"
import { from } from 'rxjs';
import { LightboxModule } from 'ngx-lightbox';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    GalleryComponent,
    StepsComponent,
    ContactComponent,
    AboutUsComponent,
    HeadComponent,
    PhotosComponent,
    FooterComponent,
    ServicesComponent,
    SingleimgComponent,
    NumericDirective
  ],
  imports: [ 
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CarouselModule.forRoot(),
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatRippleModule ,
    LightboxModule ,
    AgmCoreModule.forRoot({
        apiKey : 'AIzaSyCOAZ3sQ2kjkL8f7Uoil6B3R4fT562HsXM'
    }),
    
  ],
  providers: [DetailsService],
  bootstrap: [AppComponent]
}) 
export class AppModule { }
 