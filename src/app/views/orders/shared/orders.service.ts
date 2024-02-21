import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, shareReplay, tap } from 'rxjs';
import { OrderDetailsPage, OrderDetailsView } from './order-details';
import { response } from 'express';

const baseUrl = 'http://localhost:8080/api/orders';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  public REST_URL = 'api/orders';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  feedback: any = {};

  constructor(private http: HttpClient) { }

  public getOrdersByGet(): Observable<OrderDetailsPage> {
    return this.http.get<OrderDetailsPage>(this.REST_URL);
  }

  public getOrdersByGetWithoutObs() {
    return this.http.get<OrderDetailsPage>(this.REST_URL);
  }

  async getOrdersByFetch(): Promise<OrderDetailsPage>{
    const data = await fetch(baseUrl);
    return await data.json() ?? [];
  };

  getOrders(){
    return this.http.get(this.REST_URL)
    .pipe(
      shareReplay()
    );
  };

  getOrderList(): Observable<OrderDetailsPage>{
    return this.http.get<OrderDetailsPage>(this.REST_URL)
    .pipe(
      tap(res => res),
        catchError(
          this.handleError<OrderDetailsPage>('getOrderList', new OrderDetailsPage)
        )
    )
  };

  searchOrderList(params?: string): Observable<OrderDetailsPage>{
    return this.http.get<OrderDetailsPage>(this.REST_URL + '?' + params)
    .pipe(
      tap(res => res),
        catchError(
          this.handleError<OrderDetailsPage>('getOrderList', new OrderDetailsPage)
        )
    )
  };

  getOrderListByDay(day: number): Observable<OrderDetailsPage>{
    return this.http.get<OrderDetailsPage>(this.REST_URL + '/' + day)
    .pipe(
      tap(res => res),
        catchError(
          this.handleError<OrderDetailsPage>('getOrderListByDay', new OrderDetailsPage)
        )
    )
  };

  addOrder(order): Observable<any> {
    return this.http.post<OrderDetailsView>('api/order', order, this.httpOptions)
      .pipe(
        tap(res => console.log(res)),
        catchError(this.handleError('addOrder', order))
      );
  }

  updateOrder(id, order): Observable<any> {
    return this.http.put<OrderDetailsView>('api/order/' + id, order, this.httpOptions)
      .pipe(
        tap(res => console.log(res)),
        catchError(this.handleError('updateOrder', order))
      );
  }

  doneItem(id, order): Observable<any> {
    return this.http.put<OrderDetailsView>('api/item/' + id, order, this.httpOptions)
      .pipe(
        tap(res => console.log(res)),
        catchError(this.handleError('updateOrder', order))
      );
  }

  updatePaymentStatus(id, isPaid, order): Observable<any> {
    return this.http.put<OrderDetailsView>('api/order/pay/' + id + '/' + isPaid, order, this.httpOptions)
      .pipe(
        tap(res => console.log(res)),
        catchError(this.handleError('updatePaymentStatus', order))
      );
  }

  updateOrderStatus(id, status, order): Observable<any> {
    return this.http.put<OrderDetailsView>('api/order/' + id + '/' + status, order, this.httpOptions)
      .pipe(
        tap(res => console.log(res)),
        catchError(this.handleError('updateOrderStatus', order))
      );
  }

  saveOrder1(order){
    const id = order.id;
    const method = id ? 'put' : 'post';

    return this.http[method](`/api/order${id ? '/' + id : ''}`, order).subscribe({
      next: () => {
        this.feedback = {type: 'success', message: 'Save was successful!'};
        setTimeout(async () => {
          await console.log('Done Saving');
        }, 1000);
      },
      error: () => {
        this.feedback = {type: 'error', message: 'Error saving'};
      }
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
