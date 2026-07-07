import { paymentGateway } from './payment-gateway.js';

describe('paymentGateway', () => {
  it('should work', () => {
    expect(paymentGateway()).toEqual('payment-gateway');
  });
});
