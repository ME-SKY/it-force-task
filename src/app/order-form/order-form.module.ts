import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatDialogModule} from "@angular/material/dialog";
import { RouterModule, Routes } from '@angular/router';
import { OrderFormComponent } from './order-form.component';
import { CreateNewFormDialog } from './create-new-form-dialog/create-new-form-dialog.component';

const routes: Routes = [{ path: '', component: OrderFormComponent }];

@NgModule({
  declarations: [OrderFormComponent, CreateNewFormDialog],
  imports: [
    CommonModule,
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
    MatDialogModule,
    RouterModule.forChild(routes),
  ],
  providers: [],
  exports: [
    OrderFormComponent
  ],
  entryComponents: [CreateNewFormDialog],
})
export class OrderFormModule {}