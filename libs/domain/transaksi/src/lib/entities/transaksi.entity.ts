import { StatusTransaksi } from '@org/shared-enums';
export { StatusTransaksi };

export interface Transaksi {
  id: string;
  tenantId: string;
  santriId: string;
  tagihanId: string | null;
  orderId: string;
  amount: bigint;
  platformFee: bigint;
  gatewayFee: bigint;
  netAmount: bigint;
  status: StatusTransaksi;
  paymentMethod: string | null;
  gateway: string | null;
  gatewayReference: string | null;
  gatewayResponse: any | null;
  paidAt: Date | null;
  createdAt: Date;
}
