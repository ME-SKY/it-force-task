import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderResultComponent } from './order-result.component';

const routes: Routes = [{ path: '', component: OrderResultComponent }];

@NgModule({
  declarations: [
    OrderResultComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [],
  exports: [
    OrderResultComponent
  ]
})
export class OrderResultModule { }
