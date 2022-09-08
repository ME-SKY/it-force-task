import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyModuleRoutingModule } from './lazy-module-routing.module';
import { LazyModuleComponent } from './lazy-module.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: LazyModuleComponent }];

@NgModule({
  declarations: [
    LazyModuleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class LazyModuleModule { }
