import { Routes } from '@angular/router';
import { UserComponent } from './views/user/user.component';
import { HomeComponent } from './views/home/home.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { OrdersComponent } from './views/orders/orders.component';

export const routes: Routes = [
    { 
      path: '', redirectTo: '/dashboard', pathMatch: 'full' 
    },
    {
      path: 'dashboard',
      title: 'Dashboard Page',
      component: DashboardComponent,
    },
    {
      path: 'orders',
      title: 'Orders Page',
      component: OrdersComponent,
    },
];
