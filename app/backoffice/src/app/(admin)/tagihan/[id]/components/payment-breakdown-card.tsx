'use client';

import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';

interface PaymentBreakdownCardProps {
  baseAmount: number;
  platformFee: number;
  gatewayFee: number;
}

interface BreakdownRowProps {
  label: string;
  sublabel?: string;
  amount: number;
  variant?: 'normal' | 'fee' | 'total';
}

function BreakdownRow({ label, sublabel, amount, variant = 'normal' }: BreakdownRowProps) {
  const amtColor =
    variant === 'total'
      ? 'text-indigo-300 text-xl font-bold font-mono'
      : variant === 'fee'
      ? 'text-rose-400 text-sm font-mono'
      : 'text-zinc-200 text-sm font-mono';

  return (
    <div
      className={`flex items-center justify-between py-3 ${
        variant === 'total' ? 'border-t border-zinc-700/80 pt-4 mt-1' : ''
      }`}
    >
      <div>
        <p className={`text-sm ${variant === 'total' ? 'font-semibold text-zinc-100' : 'text-zinc-400'}`}>
          {label}
        </p>
        {sublabel && <p className="text-[10px] text-zinc-600 mt-0.5">{sublabel}</p>}
      </div>
      <p className={amtColor}>
        {variant === 'fee' ? '+ ' : ''}Rp {amount.toLocaleString('id-ID')}
      </p>
    </div>
  );
}

export function PaymentBreakdownCard({
  baseAmount,
  platformFee,
  gatewayFee,
}: PaymentBreakdownCardProps) {
  const totalAmount = baseAmount + platformFee + gatewayFee;

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
          <Layers className="size-4 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">Rincian Split Payment</h3>
          <p className="text-[10px] text-zinc-500">Biaya ditanggung oleh santri/wali</p>
        </div>
      </div>

      {/* Rows */}
      <BreakdownRow
        label="Nominal Tagihan Dasar"
        sublabel="Diterima utuh oleh pesantren"
        amount={baseAmount}
      />
      <BreakdownRow
        label="Platform Fee (SaaS)"
        sublabel="Biaya berlangganan platform"
        amount={platformFee}
        variant="fee"
      />
      <BreakdownRow
        label="Gateway Fee (MDR)"
        sublabel="Biaya pemrosesan payment gateway"
        amount={gatewayFee}
        variant="fee"
      />
      <BreakdownRow
        label="Total Dibayar Wali"
        sublabel="Nominal yang masuk ke virtual account / QRIS"
        amount={totalAmount}
        variant="total"
      />

      {/* Flow diagram */}
      <div className="mt-4 pt-4 border-t border-zinc-800/60">
        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
          <div className="bg-zinc-800 rounded px-2 py-1 text-zinc-400">Wali Bayar</div>
          <ArrowRight className="size-3 shrink-0" />
          <div className="bg-zinc-800 rounded px-2 py-1 text-zinc-400">Gateway</div>
          <ArrowRight className="size-3 shrink-0" />
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded px-2 py-1 text-indigo-400">
            Pesantren Rp {baseAmount.toLocaleString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  );
}
