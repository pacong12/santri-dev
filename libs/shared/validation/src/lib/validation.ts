import { z } from 'zod';

export const CreateTenantSchema = z.object({
  name: z.string().min(3).max(100),
  code: z.string().min(3).max(20).regex(/^[a-z0-9-]+$/),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  emailOfficial: z.string().email().optional().nullable(),
  defaultDueDays: z.number().int().min(1).default(7),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const CreateUserSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional().nullable(),
});

export const CreateSantriSchema = z.object({
  nis: z.string().min(3).max(20),
  nama: z.string().min(3).max(100),
  kelasId: z.string().uuid(),
  namaBapak: z.string().optional().nullable(),
  namaIbu: z.string().optional().nullable(),
  alamat: z.string().optional().nullable(),
});

export const CreateTagihanSchema = z.object({
  santriId: z.string().uuid(),
  jenisTagihanId: z.string().uuid(),
  tahunAjaranId: z.string().uuid().optional().nullable(),
  nama: z.string().min(3),
  amount: z.union([z.bigint(), z.number().transform((val) => BigInt(val))]),
  periode: z.string().regex(/^\d{4}-\d{2}$/), // e.g. "2026-07"
  dueDate: z.coerce.date(),
});

export const CreateTransaksiSchema = z.object({
  santriId: z.string().uuid(),
  tagihanId: z.string().uuid().optional().nullable(),
  orderId: z.string().min(3),
  amount: z.union([z.bigint(), z.number().transform((val) => BigInt(val))]),
  platformFee: z.union([z.bigint(), z.number().transform((val) => BigInt(val))]),
  gatewayFee: z.union([z.bigint(), z.number().transform((val) => BigInt(val))]),
  netAmount: z.union([z.bigint(), z.number().transform((val) => BigInt(val))]),
  paymentMethod: z.string().optional().nullable(),
  gateway: z.string().optional().nullable(),
});
