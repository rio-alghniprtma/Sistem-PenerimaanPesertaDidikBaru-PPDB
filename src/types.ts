export enum RegistrationStatus {
  PENDING = 'Tertunda',      // Berkas belum diverifikasi
  VERIFIED = 'Terverifikasi', // Berkas terverifikasi, menunggu seleksi akhir
  REJECTED = 'Ditolak',       // Berkas tidak valid / ditolak
  ACCEPTED = 'Lulus',         // Diterima / Lulus seleksi akhir
  FAILED = 'Tidak Lulus'      // Tidak lulus seleksi akhir
}

export interface Document {
  id: string;
  name: 'Ijazah' | 'Kartu Keluarga' | 'Akta Kelahiran';
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface Applicant {
  id: string; // Reg Number e.g., PPDB-2026-0001
  nisn: string;
  fullName: string;
  email: string;
  phone: string; // WhatsApp
  gender: 'Laki-laki' | 'Perempuan';
  previousSchool: string;
  parentName: string;
  majorPreference: 'IPA' | 'IPS' | 'Bahasa' | 'Kejuruan';
  status: RegistrationStatus;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
  statusLogs: {
    status: RegistrationStatus | 'PENDAFTARAN';
    changedAt: string;
    changedBy: string;
    notes?: string;
  }[];
}

export interface WhatsAppTemplate {
  status: RegistrationStatus | 'PENDAFTARAN';
  message: string;
}

export interface WhatsAppGatewayConfig {
  provider: 'fonnte' | 'wablas' | 'twilio' | 'simulation';
  apiUrl: string;
  token: string;
  senderNumber: string;
  templates: WhatsAppTemplate[];
}

export interface WhatsAppNotificationLog {
  id: string;
  applicantId: string;
  applicantName: string;
  recipientPhone: string;
  status: RegistrationStatus | 'PENDAFTARAN';
  message: string;
  sentAt: string;
  deliveryStatus: 'sent' | 'delivered' | 'failed';
  errorMessage?: string;
}
