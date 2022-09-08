import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AppRoutingModule } from './app-routing.module';
import { OrderFormModule } from './order-form/order-form.module';
import { OrderResultModule } from './order-result/order-result.module';
import { CommonModule } from '@angular/common';
// import { OrderDataServiceModule } from './core/services/order-data/order-data-service.module';
import { OrderDataService } from './core/services/order-data/order-data-service.service';
import { SharedResourcesService } from './core/services/order-data/shared-resources-service.service';
// import { RouterModule } from '@angular/router';
// import { OrderDataService } from './order-data-service.service';





@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule, 
    HttpClientModule, 
    BrowserAnimationsModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    OrderFormModule,
    OrderResultModule,
    AppRoutingModule
  ],
  providers: [OrderDataService, SharedResourcesService],
  bootstrap: [AppComponent],
})
export class AppModule {}
