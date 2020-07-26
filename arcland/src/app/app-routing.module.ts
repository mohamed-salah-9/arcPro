import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'src/app/views/home/home.component';
import { ContactComponent} from 'src/app/views/contact/contact.component';
import { AboutUsComponent} from 'src/app/views/about-us/about-us.component';
import { PhotosComponent} from 'src/app/views/photos/photos.component';
import { ServicesComponent } from 'src/app/views/services/services.component';
import { SingleimgComponent } from 'src/app/views/singleimg/singleimg.component'
import { from } from 'rxjs';
const routes: Routes = [
  {path :"" , component : HomeComponent},
  {path :"contact" , component : ContactComponent},
  {path :"about" , component: AboutUsComponent},
  {path :"photo" , component: PhotosComponent},
  {path :"photo/:id" , component : SingleimgComponent}
  /*---{path :"services" , component : ServicesComponent }--*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
