import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CancelOrderRequest, Order, OrderPage } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}`;

  getOrders(page: number, size = 25): Observable<OrderPage> {
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<OrderPage>(this.apiUrl + '/orders', { params });
  }

  cancelOrder(orderNumber: string, request: CancelOrderRequest): Observable<Order> {
    return this.http.post<Order>(
      `${this.apiUrl}/orders/${encodeURIComponent(orderNumber)}/cancel`,
      request,
    );
  }
}
