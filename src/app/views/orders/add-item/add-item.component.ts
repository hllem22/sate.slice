import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ItemDetailsView } from '../shared/item-details';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';

// const ELEMENT_DATA: ItemDetailsView[] = [
//   {id: 1, code: 'S01', description: 'TT Choco', size: 'Tiny Treat', price: 70, quantity: 0, status: 'Available'},
//   {id: 2, code: 'S02', description: 'TT Dark', size: 'Tiny Treat', price: 70, quantity: 0, status: 'Not Available'},
//   {id: 3, code: 'M01', description: 'MM Choco', size: 'Midsize Marvel', price: 265, quantity: 0, status: 'Available'},
//   {id: 4, code: 'M02', description: 'MM Dark', size: 'Midsize Marvel', price: 265, quantity: 0, status: 'Available'},
//   {id: 5, code: 'B01', description: 'GD Choco', size: 'Grand Delight', price: 600, quantity: 0, status: 'Available'}
// ];

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatDialogModule, MatSelectModule, MatButtonModule, MatInputModule],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.css'
})
export class AddItemComponent {

  listofitems : ItemDetailsView[] = [];
  
  constructor(public dialogRef: MatDialogRef<AddItemComponent>){
    this.dialogRef.disableClose = true;
    this.listofitems = [
      {id: 1, code: 'TTCHOCO', description: 'Tiny Treat Chocolate', size: 'Tiny Treat', price: 70, quantity: 0, status: 'AVAILABLE'},
      {id: 2, code: 'TTDARK', description: 'Tiny Treat Dark Chocolate', size: 'Tiny Treat', price: 70, quantity: 0, status: 'AVAILABLE'},
      {id: 3, code: 'PDCHOCO', description: 'Petite Delight Chocolate', size: 'Petite Delight', price: 205, quantity: 0, status: 'AVAILABLE'},
      {id: 4, code: 'PDDARK', description: 'Petite Delight Dark Chocolate', size: 'Petite Delight', price: 205, quantity: 0, status: 'AVAILABLE'},
      {id: 5, code: 'MMCHOCO', description: 'Midsize Marvel Chocolate', size: 'Midsize Marvel', price: 265, quantity: 0, status: 'AVAILABLE'},
      {id: 6, code: 'MMDARK', description: 'Midsize Marvel Dark Chocolate', size: 'Midsize Marvel', price: 265, quantity: 0, status: 'AVAILABLE'},
      {id: 7, code: 'GDCHOCO', description: 'Grand Delight Chocolate', size: 'Grand Delight', price: 600, quantity: 0, status: 'AVAILABLE'},
      {id: 8, code: 'GDDARK', description: 'Grand Delight Dark Chocolate', size: 'Grand Delight', price: 600, quantity: 0, status: 'AVAILABLE'}
    ]
    console.log(this.listofitems)
  }

  addItemForm = new FormGroup({
    item: new FormControl('', Validators.required),
    quantity: new FormControl(1, [
      Validators.required, 
      Validators.max(999),
      Validators.min(1)
    ])
  });

  addItem() {
    let itemIndex = this.listofitems.findIndex(item => item.code == this.addItemForm.value.item);
    if(itemIndex !== -1){
      let item = this.listofitems[itemIndex];
      let result = [
        {
          item: item,
          quantity: isNullOrUndefined(this.addItemForm.value.quantity) ? 1 : parseInt(this.addItemForm.value.quantity.toString())
        }
      ]
      this.dialogRef.close(result);
    }
  }

  addQty(){
    let value = Number(this.addItemForm.value.quantity??1);
    this.addItemForm.get('quantity')?.setValue(value + 1);
  }

  isValidToAdd(){
    let value = Number(this.addItemForm.value.quantity??1);
    if(value < 999){
      return true;
    }
    return false;
  }

  subQty(){
    let value = Number(this.addItemForm.value.quantity??1);
    this.addItemForm.get('quantity')?.setValue(value - 1);
  }

  isValidToSub(){
    let value = Number(this.addItemForm.value.quantity??1);
    if(value > 1){
      return true;
    }
    return false;
  }

  isAvailable(value){
    if(value === 'AVAILABLE'){
      return true;
    }
    return false;
  }

  cancel(){
    this.dialogRef.close();
  }
}
