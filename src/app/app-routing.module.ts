import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// import {}

const routes: Routes = [
  {
    path: '', redirectTo: 'order-form', pathMatch: 'full'
  },
  {
    path: 'order-result',
    loadChildren: () => import('./order-result/order-result.module').then(m => m.OrderResultModule)
  },
  {
    path: 'order-form',
    loadChildren: () => import('./order-form/order-form.module').then(m => m.OrderFormModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }