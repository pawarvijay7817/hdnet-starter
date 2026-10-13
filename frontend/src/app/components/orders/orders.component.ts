import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Order, OrderPage } from '../../models/order.model';
import { CancelOrderDialog } from './cancel-order-dialog/cancel-order-dialog.component';

@Component({
  selector: 'app-orders',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  styleUrl: './orders.component.scss',
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  private readonly orderService = inject(OrdersService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly displayedColumns = [
    'orderNumber',
    'orderDate',
    'status',
    'rxCount',
    'shipToState',
    'actions',
  ];

  readonly user = this.authService.user;

  orders: Order[] = [];
  pageIndex = 0;
  pageSize = 25;
  totalItems = 0;
  loading = false;
  errorMessage = '';

  get canCancelOrders(): boolean {
    return this.authService.hasRole('HDNet Cancel');
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getOrders(this.pageIndex, this.pageSize).subscribe({
      next: (response: OrderPage) => {
        this.orders = response.items;
        this.totalItems = response.totalItems;
        this.loading = false;

        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Orders could not be loaded.';
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrders();
  }

  canCancel(order: Order): boolean {
    return this.canCancelOrders && ['RECEIVED', 'PROCESSING'].includes(order.status);
  }

  openCancelDialog(order: Order): void {
    const dialogRef = this.dialog.open(CancelOrderDialog, {
      width: '420px',
      data: { orderNumber: order.orderNumber },
    });

    dialogRef.afterClosed().subscribe((updatedOrder?: Order) => {
      if (!updatedOrder) {
        return;
      }

      this.loadOrders();
    });
  }

  signOut(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
