import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ItemDetailsView } from '../shared/item-details';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AddItemComponent } from '../add-item/add-item.component';
import { OrderDetailsView } from '../shared/order-details';
import { RemoveItemComponent } from '../remove-item/remove-item.component';
import { OrdersService } from '../shared/orders.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

// const ELEMENT_DATA: ItemDetailsView[] = [
//   {id: 1, code: 'S01', description: 'TT Choco', size: 'Tiny Treat', price: 70, quantity: 2, status: 'Pending'},
//   {id: 2, code: 'S02', description: 'TT Dark', size: 'Tiny Treat', price: 70, quantity: 1, status: 'Pending'},
//   {id: 3, code: 'M01', description: 'MM Choco', size: 'Midsize Marvel', price: 265, quantity: 1, status: 'Pending'},
//   {id: 4, code: 'M02', description: 'MM Dark', size: 'Midsize Marvel', price: 265, quantity: 2, status: 'Pending'},
//   {id: 5, code: 'B01', description: 'GD Choco', size: 'Grand Delight', price: 600, quantity: 1, status: 'Pending'}
// ];

@Component({
  selector: 'app-add-order',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatDialogModule, MatError, MatFormField, FlexLayoutModule, MatInputModule, MatButtonModule, MatTableModule, MatDatepickerModule],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.css'
})
export class AddOrderComponent {
  // dataSource = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns: string[] = ["quantity", "description", "price", "remove"];
  itemList : ItemDetailsView[] = [];
  @ViewChild(MatTable) table: MatTable<ItemDetailsView>;

  constructor(private service: OrdersService, public dialogRef: MatDialogRef<AddOrderComponent>, public dialog: MatDialog, private changeDetectorRefs: ChangeDetectorRef){
    this.dialogRef.disableClose = true;
  }

  addOrderForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    region: new FormControl('', Validators.required),
    remarks: new FormControl(),
    pickupDate: new FormControl('', Validators.required),
    itemList: new FormControl('', Validators.required),
  });

  save() {
    const order = this.addOrderForm.value

    let orderData = {
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

    this.service.addOrder(body).subscribe({
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
        // this.itemList.forEach((obj) => {
        //   if(obj.code === resultItem.code){
        //     let itemIndex = this.itemList.findIndex(item => item.code == obj.code);
        //     obj.quantity = obj.quantity + resultItem.quantity;
        //     this.itemList[itemIndex] = obj;
        //   }
        //   else{
        //     this.itemList.push(resultItem);
        //   }
        // });
        if(this.itemList.length > 0){
          this.addOrderForm.get('itemList')?.setValue('Loaded');
        }
        else{
          this.addOrderForm.get('itemList')?.setValue('');
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
        this.addOrderForm.get('itemList')?.setValue('Loaded');
      }
      else{
        this.addOrderForm.get('itemList')?.setValue('');
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

  refresh(){

  }


}
