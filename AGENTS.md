<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

# Project Memories & Guidelines (SaaS Pembayaran Pesantren)

## 1. Multi-Tenant Architecture
- Platform ini merupakan SaaS Multi-Tenant. Setiap pesantren diwakili oleh model `Tenant`.
- Semua data yang terisolasi wajib memiliki kolom `tenant_id` dan di-index menggunakan composite index `(tenant_id, ...)` pada database.
- Semua query di application layer wajib menyertakan context `tenant_id` (`WHERE tenant_id = '...'`) untuk mencegah kebocoran data antar pesantren.

## 2. Aturan Peran (Role Management)
- User global hanya memiliki `platform_role` opsional (misal: `SUPERADMIN` untuk pengelola platform).
- Akses dan peran user di dalam pesantren ditentukan oleh tabel `Membership` dengan `role`:
  - `OWNER`: Pemilik pesantren yang mendaftar.
  - `ADMIN`: Administrator pengelola.
  - `SANTRI`: Akun santri/orang tua.
- Hubungan `User` ke `Santri` bersifat **1-to-Many** (satu user orang tua bisa memiliki banyak anak/santri). Jangan beri constraint `@unique` pada `user_id` di tabel `Santri`.

## 3. Split Payment & Perhitungan Biaya (Fee Borne by Student)
- Sistem pemotongan biaya transaksi menggunakan model **Split Payment** di mana biaya ditanggung oleh santri.
- Transaksi pembayaran memiliki formula perhitungan sebagai berikut:
  - `amount` (Total bayar santri) = `Tagihan.amount` + `platform_fee` (SaaS Fee, e.g. Rp 1.000) + `gateway_fee` (MDR Fee dari Gateway, e.g. Rp 4.000).
  - `net_amount` (Diterima pesantren) = `amount - platform_fee - gateway_fee` (= `Tagihan.amount` utuh).
- Tabel `Transaksi` wajib mencatat `gateway_fee` dan `gateway_response` (format JSON) untuk audit.

## 4. Kepatuhan Prisma v7
- Proyek ini menggunakan **Prisma v7**.
- **PENTING**: Jangan mendeklarasikan properti `url` atau `directUrl` di dalam blok `datasource db` pada file `schema.prisma`. 
- Semua konfigurasi koneksi database wajib diletakkan di [prisma.config.ts](file:///c:/Users/pacong2/Videos/santri-dev/libs/infrastructure/database/prisma.config.ts).
- File `prisma.config.ts` memuat file `.env` dari root workspace secara dinamis menggunakan resolusi path mutlak:
  ```typescript
  import dotenv from "dotenv";
  import { fileURLToPath } from "url";
  import { dirname, resolve } from "path";
  dotenv.config({ path: resolve(__dirname, "../../../.env") });
  ```

## 5. Library Database Shared (`@org/database`)
- Modul database dibungkus sebagai Nx library di bawah `@org/database`.
- Instansiasi client (`prisma` singleton) dan seluruh tipe data diekspor dari [database.ts](file:///c:/Users/pacong2/Videos/santri-dev/libs/infrastructure/database/src/lib/database.ts).
- Package yang ingin mengonsumsi database harus menyertakan `"@org/database": "workspace:*"` di dependencies-nya dan melakukan `bun install`.

## 6. Audit & Keamanan
- Perubahan administratif sensitif (seperti membatalkan tagihan, mengubah biaya) wajib dicatat ke dalam model `AuditLog`.
- Untuk menjaga integritas data transaksi masa lalu, tabel utama seperti `Tenant`, `User`, `Santri`, `Kelas`, dan `Tagihan` menggunakan fitur **Soft Delete** (`deletedAt DateTime? @map("deleted_at")`).

## 7. AI Agent Onboarding & Context Memory
Setiap kali AI Agent memulai sesi percakapan baru di workspace ini, Agent **wajib**:
1. Membaca dan memahami dokumen spesifikasi kebutuhan proyek berikut di folder [**PRD/**](file:///c:/Users/pacong2/Videos/santri-dev/PRD):
   - [**Indeks PRD Utama (`PRD/sprint_prd.md`)**](file:///c:/Users/pacong2/Videos/santri-dev/PRD/sprint_prd.md)
   - [**Spesifikasi Fungsional (`PRD/functional_requirements.md`)**](file:///c:/Users/pacong2/Videos/santri-dev/PRD/functional_requirements.md)
   - [**Spesifikasi Non-Fungsional (`PRD/non_functional_requirements.md`)**](file:///c:/Users/pacong2/Videos/santri-dev/PRD/non_functional_requirements.md)
   - [**Matriks Ketertelusuran (`PRD/traceability_matrix.md`)**](file:///c:/Users/pacong2/Videos/santri-dev/PRD/traceability_matrix.md)
   - [**Panduan Developer (`PRD/developer_guide.md`)**](file:///c:/Users/pacong2/Videos/santri-dev/PRD/developer_guide.md)
2. Mematuhi aturan teknis pengkodean berikut:
   - Menggunakan referensi ESM dengan akhiran ekstensi `.js` pada penulisan path impor lokal di TypeScript.
   - Menggunakan skema validasi masukan Zod yang terletak di `@org/shared-validation`.
   - Menggunakan enums terpusat di `@org/shared-enums` dan di-reexport dari file entitas masing-masing.
   - Menghindari konversi JSON bawaan langsung pada data model yang memiliki tipe data `bigint` (gunakan helper serializer dari `@org/shared-utils`).


