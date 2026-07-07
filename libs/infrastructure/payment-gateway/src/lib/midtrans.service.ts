import { IPaymentGatewayService, CreateCheckoutParams, CheckoutSessionResult, WebhookVerificationResult } from '@org/domain-transaksi';
import axios from 'axios';
import crypto from 'crypto';

export class MidtransPaymentGatewayService implements IPaymentGatewayService {
  private serverKey: string;
  private isProduction: boolean;
  private apiBaseUrl: string;

  constructor(config: { serverKey: string; clientKey: string; isProduction?: boolean }) {
    this.serverKey = config.serverKey;
    this.isProduction = config.isProduction ?? false;
    this.apiBaseUrl = this.isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
  }

  async createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutSessionResult> {
    const authHeader = Buffer.from(`${this.serverKey}:`).toString('base64');
    
    // Construct transaction payload
    const payload: any = {
      transaction_details: {
        order_id: params.orderId,
        gross_amount: Number(params.amount), // Total gross amount paid by santri
      },
      customer_details: {
        first_name: params.santriDetails.nama,
        email: params.santriDetails.email || 'no-email@santri.com',
        phone: params.santriDetails.phone || '',
      },
      item_details: [
        {
          id: 'spp-bill',
          price: Number(params.netAmount), // Amount settled to pesantren (base price)
          quantity: 1,
          name: params.tagihanDetails.nama,
        },
        {
          id: 'platform-fee',
          price: Number(params.platformFee),
          quantity: 1,
          name: 'Platform Fee (SaaS)',
        },
        {
          id: 'gateway-fee',
          price: Number(params.gatewayFee),
          quantity: 1,
          name: 'Gateway Admin Fee',
        }
      ],
    };

    // If split payment is enabled (Collaborative Commerce), route funds appropriately
    if (params.tenantGatewayAccountId) {
      payload.custom_field1 = params.tenantGatewayAccountId; // Custom field to track sub-account matching
      
      // If using Midtrans' direct split payout feature (Collaborative Commerce):
      // payload.payment_sharing = {
      //   shares: [
      //     {
      //       payee: params.tenantGatewayAccountId,
      //       amount: Number(params.netAmount) // Net settled amount to the sub-merchant
      //     }
      //     // The remainder automatically goes to the platform's primary merchant ID
      //   ]
      // };
    }

    try {
      const response = await axios.post(this.apiBaseUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${authHeader}`,
        },
      });

      return {
        token: response.data.token,
        redirectUrl: response.data.redirect_url,
      };
    } catch (error: any) {
      const errorMsg = error.response?.data?.error_messages?.join(', ') || error.message;
      throw new Error(`Failed to create Midtrans Snap checkout session: ${errorMsg}`);
    }
  }

  async verifyWebhook(payload: any, headers?: Record<string, string>): Promise<WebhookVerificationResult> {
    const { order_id, status_code, gross_amount, signature_key, transaction_status, payment_type, transaction_id, settlement_time } = payload;
    
    // Verify signature key: sha512(order_id + status_code + gross_amount + server_key)
    const rawString = `${order_id}${status_code}${gross_amount}${this.serverKey}`;
    const hash = crypto.createHash('sha512').update(rawString).digest('hex');
    
    if (hash !== signature_key) {
      throw new Error('Signature key verification failed: Webhook payload signature is untrusted.');
    }

    const status = 
      transaction_status === 'settlement' || transaction_status === 'capture'
        ? 'SUCCESS'
        : transaction_status === 'pending'
        ? 'PENDING'
        : 'FAILED';

    const paidAt = settlement_time ? new Date(settlement_time) : (status === 'SUCCESS' ? new Date() : null);

    return {
      orderId: order_id,
      status,
      paymentMethod: payment_type || 'credit_card',
      gatewayReference: transaction_id,
      rawResponse: payload,
      paidAt,
    };
  }
}
