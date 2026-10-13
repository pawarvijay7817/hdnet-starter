import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CancelOrderDialog } from './cancel-order-dialog.component';
import { OrdersComponent } from '../orders.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrdersService } from '../../../services/orders.service';

describe('CancelOrderDialog', () => {
  let component: CancelOrderDialog;
  let fixture: ComponentFixture<CancelOrderDialog>;
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    dialogRef = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [CancelOrderDialog],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { orderNumber: 'HD100312' },
        },
        {
          provide: MatDialogRef,
          useValue: dialogRef,
        },
        {
          provide: OrdersService,
          useValue: { cancelOrder: vi.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelOrderDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should not cancel when reason is missing', () => {
    component.confirm();

    expect(component.form.invalid).toBe(true);
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('it should close when user choose keep order', () => {
    component.keepOrder();
    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
