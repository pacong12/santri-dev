import { describe, it, expect } from 'vitest';
import { MockInvoiceService, GenerateInvoiceParams } from './invoice.js';

describe('MockInvoiceService', () => {
  const service = new MockInvoiceService();

  it('should successfully generate plain text invoice buffer for unpaid bill', async () => {
    const params: GenerateInvoiceParams = {
      tenantName: 'Pesantren Gontor',
      santriNama: 'Ahmad Fauzi',
      nis: '123456',
      tagihanNama: 'SPP Juli 2026',
      amount: BigInt(500000),
      periode: '2026-07',
      dueDate: new Date('2026-07-15'),
      paidAt: null,
    };

    const buffer = await service.generateInvoicePdf(params);
    expect(buffer).toBeInstanceOf(Buffer);

    const textContent = buffer.toString('utf-8');
    expect(textContent).toContain('INVOICE - PESANTREN GONTOR');
    expect(textContent).toContain('Ahmad Fauzi');
    expect(textContent).toContain('Rp 500.000');
    expect(textContent).toContain('Status      : UNPAID');
  });

  it('should successfully generate plain text invoice buffer for paid bill', async () => {
    const params: GenerateInvoiceParams = {
      tenantName: 'Pesantren Gontor',
      santriNama: 'Ahmad Fauzi',
      nis: '123456',
      tagihanNama: 'SPP Juli 2026',
      amount: BigInt(500000),
      periode: '2026-07',
      dueDate: new Date('2026-07-15'),
      paidAt: new Date('2026-07-10'),
    };

    const buffer = await service.generateInvoicePdf(params);
    const textContent = buffer.toString('utf-8');
    expect(textContent).toContain('Status      : PAID ON');
  });
});
