
// Database Types and Models

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

export interface ProgramStudi {
  id: string;
  nama: string;
  fakultas: string;
  jenjang: 'D3' | 'S1' | 'S2' | 'S3';
  akreditasi: string;
  deskripsi: string;
  biayaPerSemester: number;
  biayaPendaftaran: number;
  durasi: number; // dalam semester
  prospekKerja: string[];
  mataKuliah: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JadwalAkademik {
  id: string;
  nama: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  tahunAkademik: string;
  semester: 'Ganjil' | 'Genap';
  deskripsi: string;
  isActive: boolean;
  createdAt: string;
}

export interface Berita {
  id: string;
  judul: string;
  konten: string;
  kategori: 'akademik' | 'umum' | 'pengumuman' | 'event';
  tanggalPublish: string;
  author: string;
  imageUrl?: string;
  isPublished: boolean;
  isCrawled: boolean; // true jika dari crawling, false jika manual
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Fasilitas {
  id: string;
  nama: string;
  kategori: 'akademik' | 'olahraga' | 'umum' | 'asrama';
  deskripsi: string;
  lokasi: string;
  kapasitas?: number;
  jamOperasional: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ChatLog {
  id: string;
  userId?: string;
  userQuestion: string;
  botResponse: string;
  timestamp: string;
  sessionId: string;
  isResolved: boolean;
  category?: string;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description: string;
  updatedAt: string;
  updatedBy: string;
}

// Response types for API
export interface ChatResponse {
  message: string;
  suggestions?: string[];
  relatedInfo?: {
    type: 'prodi' | 'berita' | 'jadwal' | 'fasilitas';
    data: any;
  };
}

export interface BiayaEstimasi {
  prodiId: string;
  namaProdi: string;
  biayaPendaftaran: number;
  biayaPerSemester: number;
  totalBiaya: number;
  durasi: number;
  rincian: {
    item: string;
    biaya: number;
  }[];
}
