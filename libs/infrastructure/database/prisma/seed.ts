import { PrismaClient } from '../src/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env variables
dotenv.config({ path: resolve(__dirname, '../../../../.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding with rich dataset...');

  // 1. Clean up existing data to ensure idempotency
  console.log('🗑️ Cleaning up existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.notifikasi.deleteMany();
  await prisma.transaksi.deleteMany();
  await prisma.tagihan.deleteMany();
  await prisma.kelasPayment.deleteMany();
  await prisma.jenisTagihan.deleteMany();
  await prisma.riwayatKelas.deleteMany();
  await prisma.santri.deleteMany();
  await prisma.kelas.deleteMany();
  await prisma.tahunAjaran.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.platformSetting.deleteMany();

  // 2. Create Platform Settings
  console.log('⚙️ Creating platform settings...');
  await prisma.platformSetting.create({
    data: {
      transactionFee: BigInt(5000), // Rp 5.000 platform fee
    },
  });

  // 3. Create Tenants (Pesantren)
  console.log('🏫 Creating tenants (pesantren)...');
  const tenantAlIman = await prisma.tenant.create({
    data: {
      name: 'Pondok Pesantren Al-Iman',
      code: 'aliman',
      status: 'ACTIVE',
      phone: '081234567890',
      address: 'Jl. Raya Pesantren No. 1, Kota Kediri',
      bankName: 'Bank Syariah Indonesia (BSI)',
      bankAccountNumber: '7123456789',
      bankAccountName: 'Yayasan Al-Iman Kediri',
      emailOfficial: 'info@aliman.sch.id',
      defaultDueDays: 10,
    },
  });

  const tenantDarulHuffaz = await prisma.tenant.create({
    data: {
      name: 'Pondok Pesantren Darul Huffaz',
      code: 'darulhuffaz',
      status: 'ACTIVE',
      phone: '089876543210',
      address: 'Jl. Tahfidz Qur\'an No. 9, Bogor',
      bankName: 'Bank Muamalat',
      bankAccountNumber: '3450099881',
      bankAccountName: 'Darul Huffaz Indonesia',
      emailOfficial: 'admin@darulhuffaz.org',
      defaultDueDays: 7,
    },
  });

  // 4. Create Users (hashed passwords: "password123")
  console.log('👤 Creating users...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  // Platform Superadmin
  const superadmin = await prisma.user.create({
    data: {
      username: 'superadmin',
      email: 'superadmin@platform.com',
      password: passwordHash,
      name: 'Super Administrator',
      platformRole: 'SUPERADMIN',
    },
  });

  // Tenant Owners & Admins
  const ownerAlIman = await prisma.user.create({
    data: {
      username: 'owner_aliman',
      email: 'owner.aliman@test.com',
      password: passwordHash,
      name: 'KH. Ahmad Dahlan',
    },
  });

  const adminAlIman = await prisma.user.create({
    data: {
      username: 'admin_aliman',
      email: 'admin.aliman@test.com',
      password: passwordHash,
      name: 'Ustadz Mansur',
    },
  });

  const ownerDarulHuffaz = await prisma.user.create({
    data: {
      username: 'owner_darulhuffaz',
      email: 'owner.darulhuffaz@test.com',
      password: passwordHash,
      name: 'KH. Muhammad Natsir',
    },
  });

  // Parent Users (Wali Murid)
  const parent1 = await prisma.user.create({
    data: {
      username: 'wali_ahmad',
      email: 'wali.ahmad@test.com',
      password: passwordHash,
      name: 'Budi Santoso',
    },
  });

  const parent2 = await prisma.user.create({
    data: {
      username: 'wali_aisyah',
      email: 'wali.aisyah@test.com',
      password: passwordHash,
      name: 'Siti Rahmawati',
    },
  });

  const parent3 = await prisma.user.create({
    data: {
      username: 'wali_fatimah',
      email: 'wali.fatimah@test.com',
      password: passwordHash,
      name: 'Rahmat Hidayat',
    },
  });

  const parent4 = await prisma.user.create({
    data: {
      username: 'wali_hasan',
      email: 'wali.hasan@test.com',
      password: passwordHash,
      name: 'Joko Widodo',
    },
  });

  // 5. Create Memberships
  console.log('🔑 Assigning memberships...');
  await prisma.membership.createMany({
    data: [
      { userId: ownerAlIman.id, tenantId: tenantAlIman.id, role: 'OWNER' },
      { userId: adminAlIman.id, tenantId: tenantAlIman.id, role: 'ADMIN' },
      { userId: ownerDarulHuffaz.id, tenantId: tenantDarulHuffaz.id, role: 'OWNER' },
      { userId: parent1.id, tenantId: tenantAlIman.id, role: 'SANTRI' },
      { userId: parent2.id, tenantId: tenantAlIman.id, role: 'SANTRI' },
      { userId: parent3.id, tenantId: tenantAlIman.id, role: 'SANTRI' },
      { userId: parent4.id, tenantId: tenantAlIman.id, role: 'SANTRI' },
    ],
  });

  // 6. Create Tahun Ajaran
  console.log('📅 Creating academic years...');
  const tahunAjaranLalu = await prisma.tahunAjaran.create({
    data: {
      tenantId: tenantAlIman.id,
      name: '2024/2025',
      aktif: false,
    },
  });

  const tahunAjaranAktif = await prisma.tahunAjaran.create({
    data: {
      tenantId: tenantAlIman.id,
      name: '2025/2026',
      aktif: true,
    },
  });

  // 7. Create Kelas
  console.log('🚪 Creating classes...');
  // Historical Class
  const kelas6Old = await prisma.kelas.create({
    data: {
      tenantId: tenantAlIman.id,
      tahunAjaranId: tahunAjaranLalu.id,
      name: 'Kelas 6 (Alumni)',
    },
  });

  // Current Classes
  const kelas7A = await prisma.kelas.create({
    data: {
      tenantId: tenantAlIman.id,
      tahunAjaranId: tahunAjaranAktif.id,
      name: 'Kelas 7A',
    },
  });

  const kelas7B = await prisma.kelas.create({
    data: {
      tenantId: tenantAlIman.id,
      tahunAjaranId: tahunAjaranAktif.id,
      name: 'Kelas 7B',
    },
  });

  const kelas8A = await prisma.kelas.create({
    data: {
      tenantId: tenantAlIman.id,
      tahunAjaranId: tahunAjaranAktif.id,
      name: 'Kelas 8A',
    },
  });

  const kelas8B = await prisma.kelas.create({
    data: {
      tenantId: tenantAlIman.id,
      tahunAjaranId: tahunAjaranAktif.id,
      name: 'Kelas 8B',
    },
  });

  // 8. Create Santri (link User Wali to Santri)
  console.log('👦 Creating students (santri)...');
  const santriAhmad = await prisma.santri.create({
    data: {
      tenantId: tenantAlIman.id,
      userId: parent1.id,
      kelasId: kelas7A.id,
      nis: '1001',
      nama: 'Ahmad Fauzi',
      namaBapak: 'Budi Santoso',
      namaIbu: 'Halimah',
      alamat: 'Jl. Pemuda No. 12, Kediri',
    },
  });

  const santriAisyah = await prisma.santri.create({
    data: {
      tenantId: tenantAlIman.id,
      userId: parent2.id,
      kelasId: kelas7B.id,
      nis: '1002',
      nama: 'Aisyah Humaira',
      namaBapak: 'Hasan Basri',
      namaIbu: 'Siti Rahmawati',
      alamat: 'Jl. Merdeka No. 45, Kediri',
    },
  });

  const santriFatimah = await prisma.santri.create({
    data: {
      tenantId: tenantAlIman.id,
      userId: parent3.id,
      kelasId: kelas8A.id,
      nis: '1003',
      nama: 'Fatimah Az-Zahra',
      namaBapak: 'Rahmat Hidayat',
      namaIbu: 'Laila',
      alamat: 'Jl. Melati No. 8, Kediri',
    },
  });

  const santriHasan = await prisma.santri.create({
    data: {
      tenantId: tenantAlIman.id,
      userId: parent4.id,
      kelasId: kelas8B.id,
      nis: '1004',
      nama: 'Hasan Al-Banna',
      namaBapak: 'Joko Widodo',
      namaIbu: 'Iriana',
      alamat: 'Jl. Solo No. 99, Kediri',
    },
  });

  // 9. Riwayat Kelas (Class transition logs)
  console.log('🔄 Creating class history records...');
  await prisma.riwayatKelas.createMany({
    data: [
      {
        tenantId: tenantAlIman.id,
        santriId: santriAhmad.id,
        kelasLamaId: kelas6Old.id,
        kelasBaruId: kelas7A.id,
        tanggal: new Date('2025-07-01T08:00:00Z'),
      },
      {
        tenantId: tenantAlIman.id,
        santriId: santriAisyah.id,
        kelasLamaId: kelas6Old.id,
        kelasBaruId: kelas7B.id,
        tanggal: new Date('2025-07-01T08:00:00Z'),
      },
    ],
  });

  // 10. Create Jenis Tagihan (Bill Types)
  console.log('🏷️ Creating bill types...');
  const jenisSpp = await prisma.jenisTagihan.create({
    data: {
      tenantId: tenantAlIman.id,
      name: 'Syahriah Bulanan (SPP)',
      description: 'Uang SPP bulanan rutin santri',
    },
  });

  const jenisUangGedung = await prisma.jenisTagihan.create({
    data: {
      tenantId: tenantAlIman.id,
      name: 'Uang Pembangunan (Gedung)',
      description: 'Biaya fasilitas gedung baru',
    },
  });

  const jenisUangBuku = await prisma.jenisTagihan.create({
    data: {
      tenantId: tenantAlIman.id,
      name: 'Uang Buku & Modul',
      description: 'Biaya modul paket per semester',
    },
  });

  // 11. Create Kelas Payment Map (Standard billing amounts per class)
  console.log('💰 Setting standard class payment configurations...');
  await prisma.kelasPayment.createMany({
    data: [
      {
        tenantId: tenantAlIman.id,
        kelasId: kelas7A.id,
        jenisTagihanId: jenisSpp.id,
        amount: BigInt(250000), // Rp 250.000 for Class 7
        periode: 'MONTHLY',
      },
      {
        tenantId: tenantAlIman.id,
        kelasId: kelas7B.id,
        jenisTagihanId: jenisSpp.id,
        amount: BigInt(250000),
        periode: 'MONTHLY',
      },
      {
        tenantId: tenantAlIman.id,
        kelasId: kelas8A.id,
        jenisTagihanId: jenisSpp.id,
        amount: BigInt(300000), // Rp 300.000 for Class 8
        periode: 'MONTHLY',
      },
      {
        tenantId: tenantAlIman.id,
        kelasId: kelas8B.id,
        jenisTagihanId: jenisSpp.id,
        amount: BigInt(300000),
        periode: 'MONTHLY',
      },
    ],
  });

  // 12. Create Tagihan (Bills)
  console.log('📝 Creating student billing records...');

  // === CURRENT PENDING / OVERDUE BILLS ===
  // Pending SPP for Ahmad (July 2026)
  const tagihanSppAhmadJuli = await prisma.tagihan.create({
    data: {
      tenantId: tenantAlIman.id,
      santriId: santriAhmad.id,
      jenisTagihanId: jenisSpp.id,
      tahunAjaranId: tahunAjaranAktif.id,
      nama: 'SPP Bulan Juli 2026',
      amount: BigInt(250000),
      periode: 'Juli 2026',
      status: 'PENDING',
      dueDate: new Date('2026-07-20T23:59:59Z'),
    },
  });

  // Overdue SPP for Aisyah (July 2026)
  const tagihanSppAisyahJuli = await prisma.tagihan.create({
    data: {
      tenantId: tenantAlIman.id,
      santriId: santriAisyah.id,
      jenisTagihanId: jenisSpp.id,
      tahunAjaranId: tahunAjaranAktif.id,
      nama: 'SPP Bulan Juli 2026',
      amount: BigInt(250000),
      periode: 'Juli 2026',
      status: 'OVERDUE',
      dueDate: new Date('2026-07-05T23:59:59Z'),
    },
  });

  // Pending SPP for Fatimah (July 2026)
  await prisma.tagihan.create({
    data: {
      tenantId: tenantAlIman.id,
      santriId: santriFatimah.id,
      jenisTagihanId: jenisSpp.id,
      tahunAjaranId: tahunAjaranAktif.id,
      nama: 'SPP Bulan Juli 2026',
      amount: BigInt(300000),
      periode: 'Juli 2026',
      status: 'PENDING',
      dueDate: new Date('2026-07-20T23:59:59Z'),
    },
  });

  // Pending SPP for Hasan (July 2026)
  await prisma.tagihan.create({
    data: {
      tenantId: tenantAlIman.id,
      santriId: santriHasan.id,
      jenisTagihanId: jenisSpp.id,
      tahunAjaranId: tahunAjaranAktif.id,
      nama: 'SPP Bulan Juli 2026',
      amount: BigInt(300000),
      periode: 'Juli 2026',
      status: 'PENDING',
      dueDate: new Date('2026-07-20T23:59:59Z'),
    },
  });

  // Pending Pembangunan for Aisyah
  await prisma.tagihan.create({
    data: {
      tenantId: tenantAlIman.id,
      santriId: santriAisyah.id,
      jenisTagihanId: jenisUangGedung.id,
      tahunAjaranId: tahunAjaranAktif.id,
      nama: 'Uang Pembangunan Gedung 2025',
      amount: BigInt(1000000),
      periode: 'Sekali Bayar',
      status: 'PENDING',
      dueDate: new Date('2026-08-30T23:59:59Z'),
    },
  });

  // === HISTORICAL PAID BILLS (June 2026) ===
  const tagihanSppAhmadJuni = await prisma.tagihan.create({
    data: {
      tenantId: tenantAlIman.id,
      santriId: santriAhmad.id,
      jenisTagihanId: jenisSpp.id,
      tahunAjaranId: tahunAjaranAktif.id,
      nama: 'SPP Bulan Juni 2026',
      amount: BigInt(250000),
      periode: 'Juni 2026',
      status: 'PAID',
      dueDate: new Date('2026-06-20T23:59:59Z'),
    },
  });

  const tagihanSppAisyahJuni = await prisma.tagihan.create({
    data: {
      tenantId: tenantAlIman.id,
      santriId: santriAisyah.id,
      jenisTagihanId: jenisSpp.id,
      tahunAjaranId: tahunAjaranAktif.id,
      nama: 'SPP Bulan Juni 2026',
      amount: BigInt(250000),
      periode: 'Juni 2026',
      status: 'PAID',
      dueDate: new Date('2026-06-20T23:59:59Z'),
    },
  });

  const tagihanSppFatimahJuni = await prisma.tagihan.create({
    data: {
      tenantId: tenantAlIman.id,
      santriId: santriFatimah.id,
      jenisTagihanId: jenisSpp.id,
      tahunAjaranId: tahunAjaranAktif.id,
      nama: 'SPP Bulan Juni 2026',
      amount: BigInt(300000),
      periode: 'Juni 2026',
      status: 'PAID',
      dueDate: new Date('2026-06-20T23:59:59Z'),
    },
  });

  const tagihanUangBukuHasan = await prisma.tagihan.create({
    data: {
      tenantId: tenantAlIman.id,
      santriId: santriHasan.id,
      jenisTagihanId: jenisUangBuku.id,
      tahunAjaranId: tahunAjaranAktif.id,
      nama: 'Paket Buku Semester 1',
      amount: BigInt(450000),
      periode: 'Sekali Bayar',
      status: 'PAID',
      dueDate: new Date('2026-06-15T23:59:59Z'),
    },
  });

  // 13. Create Transaksi Records (Varying payment methods & values)
  console.log('💳 Creating transaction records...');

  // 1. Ahmad: SPP Juni paid via Bank Transfer BNI (MDR BNI = Rp 4.000, Platform Fee = Rp 1.000)
  await prisma.transaksi.create({
    data: {
      tenantId: tenantAlIman.id,
      santriId: santriAhmad.id,
      tagihanId: tagihanSppAhmadJuni.id,
      amount: BigInt(255000), // bill 250k + 1k + 4k
      platformFee: BigInt(1000),
      gatewayFee: BigInt(4000),
      netAmount: BigInt(250000),
      orderId: 'TRX-ALIMAN-20260618-001',
      status: 'SUCCESS',
      paymentMethod: 'bank_transfer_bni',
      gateway: 'midtrans',
      gatewayReference: 'bref-bni-88998',
      gatewayResponse: { status_code: '200', transaction_status: 'settlement', payment_type: 'bank_transfer' },
      paidAt: new Date('2026-06-18T09:00:00Z'),
      createdAt: new Date('2026-06-18T08:45:00Z'),
    },
  });

  // 2. Aisyah: SPP Juni paid via QRIS (MDR QRIS e.g. Rp 2.000, Platform Fee = Rp 1.000)
  await prisma.transaksi.create({
    data: {
      tenantId: tenantAlIman.id,
      santriId: santriAisyah.id,
      tagihanId: tagihanSppAisyahJuni.id,
      amount: BigInt(253000), // bill 250k + 1k + 2k
      platformFee: BigInt(1000),
      gatewayFee: BigInt(2000),
      netAmount: BigInt(250000),
      orderId: 'TRX-ALIMAN-20260619-002',
      status: 'SUCCESS',
      paymentMethod: 'qris',
      gateway: 'midtrans',
      gatewayReference: 'bref-qris-12345',
      gatewayResponse: { status_code: '200', transaction_status: 'settlement', payment_type: 'qris' },
      paidAt: new Date('2026-06-19T14:30:00Z'),
      createdAt: new Date('2026-06-19T14:22:00Z'),
    },
  });

  // 3. Fatimah: SPP Juni paid via Alfamart (MDR Alfamart = Rp 5.000, Platform Fee = Rp 1.000)
  await prisma.transaksi.create({
    data: {
      tenantId: tenantAlIman.id,
      santriId: santriFatimah.id,
      tagihanId: tagihanSppFatimahJuni.id,
      amount: BigInt(306000), // bill 300k + 1k + 5k
      platformFee: BigInt(1000),
      gatewayFee: BigInt(5000),
      netAmount: BigInt(300000),
      orderId: 'TRX-ALIMAN-20260620-003',
      status: 'SUCCESS',
      paymentMethod: 'cstore_alfamart',
      gateway: 'midtrans',
      gatewayReference: 'bref-alfa-7788',
      gatewayResponse: { status_code: '200', transaction_status: 'settlement', payment_type: 'cstore' },
      paidAt: new Date('2026-06-20T10:15:00Z'),
      createdAt: new Date('2026-06-20T09:40:00Z'),
    },
  });

  // 4. Hasan: Paket Buku Semester 1 paid via GoPay (MDR GoPay = Rp 3.000, Platform Fee = Rp 1.000)
  await prisma.transaksi.create({
    data: {
      tenantId: tenantAlIman.id,
      santriId: santriHasan.id,
      tagihanId: tagihanUangBukuHasan.id,
      amount: BigInt(454000), // bill 450k + 1k + 3k
      platformFee: BigInt(1000),
      gatewayFee: BigInt(3000),
      netAmount: BigInt(450000),
      orderId: 'TRX-ALIMAN-20260614-001',
      status: 'SUCCESS',
      paymentMethod: 'gopay',
      gateway: 'midtrans',
      gatewayReference: 'bref-gpay-9988',
      gatewayResponse: { status_code: '200', transaction_status: 'settlement', payment_type: 'gopay' },
      paidAt: new Date('2026-06-14T07:20:00Z'),
      createdAt: new Date('2026-06-14T07:15:00Z'),
    },
  });

  // 5. Ahmad: Failed/Expired billing attempt for SPP Juli
  await prisma.transaksi.create({
    data: {
      tenantId: tenantAlIman.id,
      santriId: santriAhmad.id,
      tagihanId: tagihanSppAhmadJuli.id,
      amount: BigInt(255000),
      platformFee: BigInt(1000),
      gatewayFee: BigInt(4000),
      netAmount: BigInt(250000),
      orderId: 'TRX-ALIMAN-20260709-002',
      status: 'EXPIRED',
      paymentMethod: 'bank_transfer_mandiri',
      gateway: 'midtrans',
      gatewayReference: 'bref-mandiri-failed',
      gatewayResponse: { status_code: '407', transaction_status: 'expire', payment_type: 'bank_transfer' },
      createdAt: new Date('2026-07-09T08:00:00Z'),
    },
  });

  // 6. Aisyah: Pending payment transaction for SPP Juli (active Virtual Account checkout)
  await prisma.transaksi.create({
    data: {
      tenantId: tenantAlIman.id,
      santriId: santriAisyah.id,
      tagihanId: tagihanSppAisyahJuli.id,
      amount: BigInt(255000),
      platformFee: BigInt(1000),
      gatewayFee: BigInt(4000),
      netAmount: BigInt(250000),
      orderId: 'TRX-ALIMAN-20260710-099',
      status: 'PENDING',
      paymentMethod: 'bank_transfer_bca',
      gateway: 'midtrans',
      gatewayReference: 'bref-bca-pending',
      gatewayResponse: { status_code: '201', transaction_status: 'pending', payment_type: 'bank_transfer' },
      createdAt: new Date('2026-07-10T18:00:00Z'),
    },
  });

  // 14. Create Notifications
  console.log('🔔 Creating notification records...');
  await prisma.notifikasi.createMany({
    data: [
      {
        tenantId: tenantAlIman.id,
        userId: parent1.id,
        title: 'Tagihan Baru Diterbitkan',
        message: 'Tagihan SPP Bulan Juli 2026 senilai Rp 250.000 untuk Ahmad Fauzi telah diterbitkan.',
        type: 'BILLING_ISSUED',
        isRead: false,
        tagihanId: tagihanSppAhmadJuli.id,
        createdAt: new Date('2026-07-01T08:00:00Z'),
      },
      {
        tenantId: tenantAlIman.id,
        userId: parent1.id,
        title: 'Pembayaran Sukses',
        message: 'Pembayaran SPP Bulan Juni 2026 Ahmad Fauzi berhasil diproses.',
        type: 'PAYMENT_SUCCESS',
        isRead: true,
        tagihanId: tagihanSppAhmadJuni.id,
        createdAt: new Date('2026-06-18T09:05:00Z'),
      },
    ],
  });

  // 15. Create AuditLog
  console.log('📋 Creating audit log...');
  await prisma.auditLog.createMany({
    data: [
      {
        tenantId: tenantAlIman.id,
        userId: adminAlIman.id,
        action: 'BULK_GENERATE_BILL',
        details: 'Berhasil generate tagihan bulanan SPP Juli 2026 untuk Kelas 7A dan Kelas 7B',
        createdAt: new Date('2026-07-01T08:00:00Z'),
      },
      {
        tenantId: tenantAlIman.id,
        userId: adminAlIman.id,
        action: 'PROMOTE_CLASS',
        details: 'Berhasil memindahkan 2 santri dari Kelas 6 (Alumni) ke Kelas 7',
        createdAt: new Date('2025-07-01T08:00:00Z'),
      },
    ],
  });

  console.log('🎉 Seeding successfully completed with rich datasets!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    pool.end();
  });
