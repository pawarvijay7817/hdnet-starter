export interface Order {
  orderNumber: string;
  orderDate: string;
  status: string;
  rxCount: number;
  shipToState: string;
  lastUpdated: string;
}

export interface OrderPage {
  items: Order[];
  page: number;
  size: number;
  totalItems: number;
}

export interface CancelOrderRequest {
  reason: CancelReason;
}

export type CancelReason = 'CUSTOMER_REQUEST' | 'DUPLICATE_ORDER' | 'ADDRESS_ISSUE' | 'OTHER';

export interface ApiError {
  error: string;
  message: string;
}

export const CANCEL_REASONS: {
  value: CancelReason;
  label: string;
}[] = [
  { value: 'CUSTOMER_REQUEST', label: 'Customer Request' },
  { value: 'DUPLICATE_ORDER', label: 'Duplicate Order' },
  { value: 'ADDRESS_ISSUE', label: 'Address Issue' },
  { value: 'OTHER', label: 'Other' },
];
