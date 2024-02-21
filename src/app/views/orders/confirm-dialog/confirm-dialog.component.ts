import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrdersService } from '../shared/orders.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private service: OrdersService){
    this.dialogRef.disableClose = true;
  }

  confirm(): void {
    console.log(this.data)
    let orderData = {
      "id": this.data.orderId,
      "status": 'DONE'
    };

    let body = JSON.stringify(orderData);
    this.service.doneItem(this.data.item.id, body).subscribe({
      next: (data) => {
        console.log(data.message)
        if(data.message.includes('Successful')){
          this.dialogRef.close();
        }
      },
      error: (e) => console.log(e)
    });
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
