import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CANCEL_REASONS, CancelReason, Order } from '../../../models/order.model';
import { OrdersService } from '../../../services/orders.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface CancelDialogData {
  orderNumber: string;
}

@Component({
  selector: 'app-cancel-order-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
  styleUrl: './cancel-order-dialog.component.scss',
  templateUrl: './cancel-order-dialog.component.html',
})
export class CancelOrderDialog {
  private readonly fb = inject(FormBuilder);
  private readonly orderService = inject(OrdersService);
  private readonly dialogRef = inject(MatDialogRef<CancelOrderDialog, Order | undefined>);

  readonly data = inject<CancelDialogData>(MAT_DIALOG_DATA);
  readonly reasons = CANCEL_REASONS;

  readonly form = this.fb.group({
    reason: ['', Validators.required],
  });

  errorMessage = '';
  saving = false;

  confirm(): void {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const reason = this.form.getRawValue().reason as CancelReason;

    this.orderService.cancelOrder(this.data.orderNumber, { reason }).subscribe({
      next: (order) => {
        this.saving = false;
        this.dialogRef.close(order);
      },
      error: (error: HttpErrorResponse) => {
        this.saving = false;
        const apiError = error.error as { message?: string } | null;
        this.errorMessage = apiError?.message ?? 'The order could not be cancelled.';
      },
    });
  }

  keepOrder(): void {
    this.dialogRef.close();
  }
}
