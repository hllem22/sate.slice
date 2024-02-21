import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTable, MatTableModule } from '@angular/material/table';
import { ItemDetailsView } from '../shared/item-details';
import { OrdersService } from '../shared/orders.service';
import { RemoveItemComponent } from '../remove-item/remove-item.component';
import { AddItemComponent } from '../add-item/add-item.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-modify-order',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatDialogModule, MatError, MatFormField, FlexLayoutModule, MatInputModule, MatButtonModule, MatTableModule, MatGridListModule, MatIconModule, MatDatepickerModule],
  templateUrl: './modify-order.component.html',
  styleUrl: './modify-order.component.css'
})
export class ModifyOrderComponent {
  displayedColumns: string[] = ["quantity", "description", "price", "remove"];
  itemList : ItemDetailsView[] = [];
  @ViewChild(MatTable) table: MatTable<ItemDetailsView>;

  constructor(private service: OrdersService, public dialogRef: MatDialogRef<ModifyOrderComponent>, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any){
    this.dialogRef.disableClose = true;
    console.log(data);
    this.itemList = data.order.itemList;
  }

  modifyOrderForm = new FormGroup({
    firstName: new FormControl(this.data.order.firstName, Validators.required),
    lastName: new FormControl(this.data.order.lastName, Validators.required),
    address: new FormControl(this.data.order.address, Validators.required),
    city: new FormControl(this.data.order.city, Validators.required),
    region: new FormControl(this.data.order.region, Validators.required),
    remarks: new FormControl(this.data.order.remarks),
    pickupDate: new FormControl(this.data.order.pickupDate, Validators.required),
    itemList: new FormControl(this.data.itemList, Validators.required)
  });

  save() {
    const order = this.modifyOrderForm.value

    function convert(str) {
      var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
    }

    let orderData = {
      "id": this.data.order.id,
      "firstName": order.firstName,
      "lastName": order.lastName,
      "address": order.address,
      "city": order.city,
      "region": order.region,
      "remarks": order.remarks,
      "itemList": this.itemList,
      "pickupDate": order.pickupDate
    };

    let body = JSON.stringify(orderData);

    console.log(body)

    this.service.updateOrder(this.data.order.id, body).subscribe({
      next: (data) => {
        console.log(data.message)
        if(data.message.includes('Successful')){
          this.dialogRef.close();
        }
      },
      error: (e) => console.log(e)
    });
  }

  cancel(){
    this.dialogRef.close();
  }

  getTotalCost() {
    return this.itemList.map(t => t.quantity * t.price).reduce((acc, value) => acc + value, 0);
  }

  addItemDialog(): void {
    let dialogRef = this.dialog.open(AddItemComponent, {
      width: '768px',
      maxHeight: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!(result === undefined || result === null)){
        let resultItem : ItemDetailsView = result[0].item;
        let quantity: number = result[0].quantity;
        let itemIndex = this.itemList.findIndex(item => item.code == resultItem.code);
        if(itemIndex === -1){
          resultItem.quantity = quantity;
          this.itemList.push(resultItem);
        }
        else{
          resultItem.quantity = quantity + this.itemList[itemIndex].quantity;
          this.itemList[itemIndex] = resultItem;
          resultItem = this.itemList[itemIndex];
          this.itemList = Object.assign([], this.itemList);
        }

        if(this.itemList.length > 0){
          this.modifyOrderForm.get('itemList')?.setValue('Loaded');
        }
        else{
          this.modifyOrderForm.get('itemList')?.setValue('');
        }
        this.table.renderRows();
      }
    });
  }

  removeItem(item: ItemDetailsView){
    const dialogRef = this.dialog.open(RemoveItemComponent, {
      data: {item: item}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.itemList.splice(this.itemList.indexOf(item), 1);
      }

      if(this.itemList.length > 0){
        this.modifyOrderForm.get('itemList')?.setValue('Loaded');
      }
      else{
        this.modifyOrderForm.get('itemList')?.setValue('');
      }
      this.table.renderRows();
    });
  }

  addQty(itemSelected){
    let itemIndex = this.itemList.findIndex(item => item.code == itemSelected.code);
    if(itemIndex !== -1){
      this.itemList[itemIndex].quantity = this.itemList[itemIndex].quantity + 1;
    }
  }

  isValidToAdd(quantity){
    let value = Number(quantity??1);
    if(value < 999){
      return true;
    }
    return false;
  }

  subQty(itemSelected){
    let itemIndex = this.itemList.findIndex(item => item.code == itemSelected.code);
    if(itemIndex !== -1){
      this.itemList[itemIndex].quantity = this.itemList[itemIndex].quantity - 1;
    }
  }

  isValidToSub(quantity){
    let value = Number(quantity??1);
    if(value > 1){
      return true;
    }
    return false;
  }

  updateQty(itemSelected, event){
    console.log(event.target.value)
    let itemIndex = this.itemList.findIndex(item => item.code == itemSelected.code);
    if(itemIndex !== -1){
      this.itemList[itemIndex].quantity = Number(event.target.value);
    }
  }

  checkDate(){
    console.log(moment(this.modifyOrderForm.value.pickupDate));
  }
}
