import { Component, ViewChild } from '@angular/core';
import { NgxDatatableModule, isNullOrUndefined } from '@swimlane/ngx-datatable';
import { OrderDetails, OrderDetailsPage, OrderDetailsView, TotalOrders, TotalOrdersView } from '../orders/shared/order-details';
import { MatCardModule } from '@angular/material/card';
import { OrdersService } from '../orders/shared/orders.service';
import { MatListModule } from '@angular/material/list';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxDatatableModule, MatCardModule, MatListModule, DecimalPipe, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private service: OrdersService){
    this.getOrderList();
    this.getTomorrowOrderList();
    this.getNextOrderList();
  }

  orders: OrderDetails[] = [];
  totalOrders: TotalOrders[] = [];
  tomorrowOrders: OrderDetails[] = [];
  tomorrowTotalOrders: TotalOrders[] = [];
  nextOrders: OrderDetails[] = [];
  nextTotalOrders: TotalOrders[] = [];
  pipe = new DatePipe('en-US');

  getOrderList(): void {
    this.service.getOrderListByDay(0).subscribe({
      next: (data) => {
        this.orders = data.list;
        this.totalOrders = data.totalList;
      },
      error: (e) => console.log(e)
    });
  }

  getTomorrowOrderList(): void {
    this.service.getOrderListByDay(1).subscribe({
      next: (data) => {
        this.tomorrowOrders = data.list;
        this.tomorrowTotalOrders = data.totalList;
      },
      error: (e) => console.log(e)
    });
  }

  getNextOrderList(): void {
    this.service.getOrderListByDay(2).subscribe({
      next: (data) => {
        this.nextOrders = data.list;
        this.nextTotalOrders = data.totalList;
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

  findTomorrowTotal(code: string){
    let itemIndex = this.tomorrowTotalOrders.findIndex(total => total.code === code);
    if(itemIndex !== -1){
      return this.tomorrowTotalOrders[itemIndex];
    }
    return new TotalOrdersView();
  }

  findNextTotalOrder(code: string){
    let itemIndex = this.nextTotalOrders.findIndex(total => total.code === code);
    if(itemIndex !== -1){
      return this.nextTotalOrders[itemIndex];
    }
    return new TotalOrdersView();
  }

  getTotalLoafs(totalOrders) {
    if(totalOrders !== null && totalOrders !== undefined){
      return totalOrders.map(t => t.code === 'TT' ? t.quantity/6 : t.code === 'PD' ? t.quantity/2 : t.code === 'MM' ? t.quantity/1.5 : t.code === 'GD' ? t.quantity/0.666666666666666 : 0).reduce((acc, value) => acc + value, 0);
    }
    return 0;
  }

  getPickupDate(){
    let today = new Date();
    let ChangedFormat = this.pipe.transform(new Date(today.setDate(today.getDate() + 2)), 'MMM d');
    return ChangedFormat;
  }
}
