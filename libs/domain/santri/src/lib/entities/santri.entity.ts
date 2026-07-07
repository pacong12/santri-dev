export interface Santri {
  id: string;
  tenantId: string;
  userId: string | null;
  kelasId: string;
  nis: string;
  nama: string;
  namaBapak: string | null;
  namaIbu: string | null;
  alamat: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface TahunAjaran {
  id: string;
  tenantId: string;
  name: string;
  aktif: boolean;
  createdAt: Date;
}

export interface Kelas {
  id: string;
  tenantId: string;
  tahunAjaranId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface RiwayatKelas {
  id: string;
  tenantId: string;
  santriId: string;
  kelasLamaId: string;
  kelasBaruId: string;
  tanggal: Date;
}
