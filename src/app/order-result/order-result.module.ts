import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderResultComponent } from './order-result.component';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


const routes: Routes = [{ path: '', component: OrderResultComponent }];

@NgModule({
  declarations: [
    OrderResultComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterModule.forChild(routes),
  ],
  providers: [],
  exports: [
    OrderResultComponent
  ]
})
export class OrderResultModule { }
