export function formatRupiah(amount: bigint | number): string {
  const numericAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

export function bigintToNumber(val: bigint): number {
  return Number(val);
}

export function numberToBigint(val: number): bigint {
  return BigInt(Math.round(val));
}

export function addDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export function generateOrderId(prefix = 'TX'): string {
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
}
