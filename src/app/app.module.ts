import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LocationsComponent } from './components/locations/locations.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { HeaderToolbarComponent } from './components/header-toolbar/header-toolbar.component';
import { FooterToolbarComponent } from './components/footer-toolbar/footer-toolbar.component';
import {RouterModule, Routes} from '@angular/router';
import {CategoriesService} from './services/categories.service';
import {LocationsService} from './services/locations.service';



const appRoutes: Routes = [
  { path: 'Categories', component: CategoriesComponent, data: { title: 'Categories List' } },
  { path: 'Locations', component: LocationsComponent, data: { title: 'Locations List' } },
  { path: '**', redirectTo: 'Categories', data: { title: 'Categories List' } }
];

@NgModule({
  declarations: [
    AppComponent,
    LocationsComponent,
    CategoriesComponent,
    HeaderToolbarComponent,
    FooterToolbarComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [CategoriesService, LocationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
