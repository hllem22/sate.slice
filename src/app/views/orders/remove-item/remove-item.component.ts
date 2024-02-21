import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-remove-item',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule],
  templateUrl: './remove-item.component.html',
  styleUrl: './remove-item.component.css'
})
export class RemoveItemComponent {
  
  constructor(public dialogRef: MatDialogRef<RemoveItemComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  remove(): void {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
