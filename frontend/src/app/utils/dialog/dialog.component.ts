import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
    title: string = 'title';
    text: string = "text";
  
    constructor(
      @Inject(MAT_DIALOG_DATA) public dialogData: any,
      private dialogRef: MatDialogRef<DialogComponent>
    ) {
      this.title = dialogData.title || "";
      this.text = dialogData.text || "";
    }
  
    closeDialog(): void {
      this.dialogRef.close();
    }
  }
