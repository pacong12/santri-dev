export interface CreateCheckoutParams {
  orderId: string;
  amount: bigint;
  platformFee: bigint;
  gatewayFee: bigint;
  netAmount: bigint;
  tenantGatewayAccountId: string | null;
  santriDetails: {
    nama: string;
    email?: string;
    phone?: string;
  };
  tagihanDetails: {
    nama: string;
    description?: string;
  };
}

export interface CheckoutSessionResult {
  token: string;
  redirectUrl: string;
}

export interface WebhookVerificationResult {
  orderId: string;
  status: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'PENDING';
  paymentMethod: string;
  gatewayReference: string;
  rawResponse: any;
  paidAt: Date | null;
}

export interface IPaymentGatewayService {
  createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutSessionResult>;
  verifyWebhook(payload: any, headers?: Record<string, string>): Promise<WebhookVerificationResult>;
}
