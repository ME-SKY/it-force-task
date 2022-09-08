import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'course-dialog',
    templateUrl: './create-new-form-dialog.component.html',
    styleUrls: ['./create-new-form-dialog.scss']
})
export class CreateNewFormDialog {

    constructor(
        private dialogRef: MatDialogRef<CreateNewFormDialog>,
    ) {
    }

    createNew() {
        this.dialogRef.close(false); //do not use previos data
    }

    usePreviousData() {
        this.dialogRef.close(true); // use previous data
    }
}