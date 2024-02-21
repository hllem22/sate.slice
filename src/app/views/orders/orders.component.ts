import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { OrderDetails, OrderDetailsPage, OrderDetailsView, TotalOrders, TotalOrdersView } from './shared/order-details';
import { MatCard, MatCardContent, MatCardHeader, MatCardModule } from '@angular/material/card';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { OrdersService } from './shared/orders.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddOrderComponent } from './add-order/add-order.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemDetailsView } from './shared/item-details';
import { ModifyOrderComponent } from './modify-order/modify-order.component';
import { CommonModule, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';

// const ELEMENT_DATA: OrderDetails[] = [
//   {id: 1, firstName: 'Wally', lastName: 'Monacillo', address: 'Tower 2, Kasara Urban Resort Residences, Ugong', city: 'Pasig City', region: 'Metro Manila', dateCreated: '2024-01-28 21:16:43', createdBy: 'wmonacillo', status: 'Pending'},
//   {id: 2, firstName: 'Wally', lastName: 'Monacillo', address: 'Tower 2, Kasara Urban Resort Residences, Ugong', city: 'Pasig City', region: 'Metro Manila', dateCreated: '2024-01-28 21:16:43', createdBy: 'wmonacillo', status: 'Pending'},
//   {id: 3, firstName: 'Wally', lastName: 'Monacillo', address: 'Tower 2, Kasara Urban Resort Residences, Ugong', city: 'Pasig City', region: 'Metro Manila', dateCreated: '2024-01-28 21:16:43', createdBy: 'wmonacillo', status: 'Pending'},
//   {id: 4, firstName: 'Wally', lastName: 'Monacillo', address: 'Tower 2, Kasara Urban Resort Residences, Ugong', city: 'Pasig City', region: 'Metro Manila', dateCreated: '2024-01-28 21:16:43', createdBy: 'wmonacillo', status: 'Pending'},
//   {id: 5, firstName: 'Wally', lastName: 'Monacillo', address: 'Tower 2, Kasara Urban Resort Residences, Ugong', city: 'Pasig City', region: 'Metro Manila', dateCreated: '2024-01-28 21:16:43', createdBy: 'wmonacillo', status: 'Pending'}
// ];

export const expandableRowAnimation = trigger('expandableRow', [
  state('collapsed, void', style({
    height: '0px',
    visibility: 'hidden'
  })),
  state('expanded', style({
    'min-height': '48px',
    height: '*',
    visibility: 'visible'
  })),
  transition(
    'expanded <=> collapsed, void <=> *',
    animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
  ),
]);

export const detailExpandAnimation = trigger('expandableRow', [
  state('collapsed,void', style({height: '0px', minHeight: '0'})),
  state('expanded', style({height: '*'})),
  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, FormsModule, DecimalPipe, TitleCasePipe, MatSortModule, MatPaginatorModule, MatChipsModule, MatTooltipModule, DatePipe, MatFormFieldModule, ReactiveFormsModule, MatDatepickerModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  animations: [expandableRowAnimation],
})
export class OrdersComponent implements OnInit {
  // dataSource = new MatTableDataSource(ELEMENT_DATA);
  dataSource: MatTableDataSource<OrderDetails>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ["id", "firstName", "lastName", "address", "city", "region", "pickupDate", "remarks", "dateCreated", "createdBy", "paid", "status", "actions"];
  itemColumns: string[] = ["code", "description", "price", "quantity", "totalAmount", "status", "actions"];
  listofcolumns = [
    { code: 'id', name: 'Order#' },
    { code: 'firstName', name: 'First Name' },
    { code: 'lastName', name: 'Last Name' },
    { code: 'address', name: 'Address' },
    { code: 'city', name: 'City' },
    { code: 'region', name: 'Region' },
    { code: 'pickupDate', name: 'Pickup Date' },
    { code: 'remarks', name: 'Remarks' },
    { code: 'dateCreated', name: 'Date Created' },
    { code: 'createdBy', name: 'Created By' },
    { code: 'paid', name: 'Paid' },
    { code: 'status', name: 'Status' },
  ];

  listofcolumnsToDisplayWithExpand = [...this.listofcolumns, { code: 'actions', name: 'Actions' }];

  listofitemcolumns = [
    { code: 'code', name: 'Code' },
    { code: 'description', name: 'Description' },
    { code: 'price', name: 'Price' },
    { code: 'quantity', name: 'Quantity' },
    { code: 'totalAmount', name: 'Total Amount' },
    { code: 'status', name: 'Status' }
  ];
  expandedSymbol: string = '';
  orders: OrderDetails[] = [];
  totalOrders: TotalOrders[] = [];
  pipe = new DatePipe('en-US');

  orderForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  
  constructor(private service: OrdersService, public dialog: MatDialog){ 
    this.getOrderList();
  }

  ngOnInit(): void {
    // this.dataSource.sort = this.sort;
  }

  getOrderList(): void {
    this.service.getOrderList().subscribe({
      next: (data) => {
        this.orders = data.list;
        this.totalOrders = data.totalList;
        this.dataSource = new MatTableDataSource(data.list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (e) => console.log(e)
    });
  }

  getOrdersByGet(){
    this.service.getOrdersByGetWithoutObs().subscribe(data => {
      this.orders = data.list;
    });
  }

  getOrdersByFetch(){
    this.service.getOrdersByFetch().then(orders => {
      this.orders = orders.list;
      console.log(orders);
    })
  }

  toggleExpandableSymbol(symbol: string): void {
    this.expandedSymbol = this.expandedSymbol === symbol
      ? ''
      : symbol;
  }

  openAddOrderDialog(): void {
    let dialogRef = this.dialog.open(AddOrderComponent, {
      width: '1200px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getOrderList();
    });
  }

  openModifyOrderDialog(order: OrderDetails): void {
    let dialogRef = this.dialog.open(ModifyOrderComponent, {
      data: {
        order: order,
        itemList: order.itemList.length > 0 ? 'Loaded' : ''
      },
      width: '1200px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getOrderList();
    });
  }

  doneItem(item: ItemDetailsView, orderId){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Done Item',
        message: 'Do you really want to done this item from Order# ' + orderId + ' ?',
        label: item.quantity + 'x ' + item.description,
        orderId: orderId,
        item: item
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        let orderData = {
          "id": orderId,
          "status": 'DONE'
        };
    
        let body = JSON.stringify(orderData);
        this.service.doneItem(item.id, body).subscribe({
          next: (data) => {
            console.log(data.message)
            if(data.message.includes('Successful')){
              this.getOrderList();
            }
          },
          error: (e) => console.log(e)
        });
      }
    });
  }

  getTotalItems(itemList) {
    if(itemList !== undefined && itemList !== null){
      return itemList.map(t => t.quantity).reduce((acc, value) => acc + value, 0);
    }
  }

  getTotalCost(itemList) {
    if(itemList !== undefined && itemList !== null){
      return itemList.map(t => t.quantity * t.price).reduce((acc, value) => acc + value, 0);
    }
  }

  markAsPaidorUnPaid(order: OrderDetailsView, isPaid: boolean){
    if(!isPaid){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: order.paid === true ? 'Revert Payment' : 'Pay Order',
          message: order.paid === true ? 'Do you really want to revert payment of this order# ' + order.id + ' ?' : 'Do you really want to mark as paid this order# ' + order.id + ' ?',
          label: ''
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result === true){
          let orderData = {
            "id": order.id,
            "ispaid": isPaid
          };
      
          let body = JSON.stringify(orderData);
          this.service.updatePaymentStatus(order.id, isPaid, body).subscribe({
            next: (data) => {
              console.log(data.message)
              if(data.message.includes('Successful')){
                this.getOrderList();
              }
            },
            error: (e) => console.log(e)
          });
        }
      });
    }
    else{
      let orderData = {
        "id": order.id,
        "ispaid": isPaid
      };
  
      let body = JSON.stringify(orderData);
      this.service.updatePaymentStatus(order.id, isPaid, body).subscribe({
        next: (data) => {
          console.log(data.message)
          if(data.message.includes('Successful')){
            this.getOrderList();
          }
        },
        error: (e) => console.log(e)
      });
    }
  }

  updateOrderStatus(order: OrderDetailsView, status: string){
    let orderData = {
      "id": order.id,
      "status": status
    };

    let body = JSON.stringify(orderData);
    this.service.updateOrderStatus(order.id, status, body).subscribe({
      next: (data) => {
        console.log(data.message)
        if(data.message.includes('Successful')){
          this.getOrderList();
        }
      },
      error: (e) => console.log(e)
    });
  }

  findTotal(code: string){
    let itemIndex = this.totalOrders.findIndex(total => total.code === code);
    if(itemIndex !== -1){
      return this.totalOrders[itemIndex];
    }
    return new TotalOrdersView();
  }

  reload(){
    this.getOrderList();
  }

  convertDate(date : string){
    let today = new Date(date);
    let ChangedFormat = this.pipe.transform( today, 'MMM d yyyy');
    return ChangedFormat;
  }

  search() {
    const order = this.orderForm.value;
    let params = new URLSearchParams();

    let start = new Date(order.start === undefined || order.start === null ? '' : order.start.toString());
    let end = new Date(order.end === undefined || order.end === null ? '' : order.end.toString());
    let startFormat = this.pipe.transform(start, 'MM-dd-yyyy');
    let endFormat = this.pipe.transform(end, 'MM-dd-yyyy');

    if (order.start) {
      params.append('pickupDateStart', startFormat === undefined || startFormat === null ? '' : startFormat.toString());
    }
    if (order.end) {
      params.append('pickupDateEnd', endFormat === undefined || endFormat === null ? '' : endFormat.toString());
    }

    console.log(params.toString())

    this.service.searchOrderList(params.toString()).subscribe({
      next: (data) => {
        this.orders = data.list;
        this.totalOrders = data.totalList;
        this.dataSource = new MatTableDataSource(data.list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (e) => console.log(e)
    });
  }

  clear() {
    this.orderForm.reset();
  }

}