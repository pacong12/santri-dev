export interface GenerateInvoiceParams {
  tenantName: string;
  santriNama: string;
  nis: string;
  tagihanNama: string;
  amount: bigint;
  periode: string;
  dueDate: Date;
  paidAt?: Date | null;
}

export interface IInvoiceService {
  generateInvoicePdf(params: GenerateInvoiceParams): Promise<Buffer>;
}

export class MockInvoiceService implements IInvoiceService {
  async generateInvoicePdf(params: GenerateInvoiceParams): Promise<Buffer> {
    // Generate a simple text-based invoice representing a PDF buffer mock
    const docLines = [
      `=========================================`,
      `INVOICE - ${params.tenantName.toUpperCase()}`,
      `=========================================`,
      `Santri Name : ${params.santriNama} (${params.nis})`,
      `Bill Name   : ${params.tagihanNama}`,
      `Period      : ${params.periode}`,
      `Amount      : Rp ${Number(params.amount).toLocaleString('id-ID')}`,
      `Due Date    : ${params.dueDate.toLocaleDateString('id-ID')}`,
      `Status      : ${params.paidAt ? `PAID ON ${params.paidAt.toLocaleDateString('id-ID')}` : 'UNPAID'}`,
      `=========================================`,
    ];
    
    return Buffer.from(docLines.join('\n'), 'utf-8');
  }
}
