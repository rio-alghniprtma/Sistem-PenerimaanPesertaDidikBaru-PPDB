import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { RegistrationStatus, Applicant, Document, WhatsAppGatewayConfig, WhatsAppNotificationLog } from "./src/types.js";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Ensure data folder exists
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "ppdb_db.json");

// Default seed data for PPDB
const defaultApplicants: Applicant[] = [
  {
    id: "PPDB-2026-0001",
    nisn: "0082736152",
    fullName: "Ahmad Rizky Pratama",
    email: "ahmad.rizky@gmail.com",
    phone: "081234567890",
    gender: "Laki-laki",
    previousSchool: "SMP Negeri 1 Bandung",
    parentName: "Hendra Pratama",
    majorPreference: "IPA",
    status: RegistrationStatus.ACCEPTED,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [
      {
        id: "doc-1",
        name: "Ijazah",
        fileName: "ijazah_smp_ahmad_rizky.pdf",
        fileSize: 1450200,
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "approved"
      },
      {
        id: "doc-2",
        name: "Kartu Keluarga",
        fileName: "kk_keluarga_hendra.jpg",
        fileSize: 850300,
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "approved"
      },
      {
        id: "doc-3",
        name: "Akta Kelahiran",
        fileName: "akta_kelahiran_ahmad.pdf",
        fileSize: 920100,
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "approved"
      }
    ],
    statusLogs: [
      {
        status: "PENDAFTARAN",
        changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        changedBy: "Sistem PPDB",
        notes: "Pendaftaran berhasil secara online"
      },
      {
        status: RegistrationStatus.VERIFIED,
        changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        changedBy: "Admin PPDB (Budi Santoso)",
        notes: "Berkas dinyatakan valid dan lengkap setelah verifikasi administrasi."
      },
      {
        status: RegistrationStatus.ACCEPTED,
        changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        changedBy: "Admin PPDB (Budi Santoso)",
        notes: "Dinyatakan LULUS seleksi akhir PPDB Gelombang I"
      }
    ]
  },
  {
    id: "PPDB-2026-0002",
    nisn: "0091827364",
    fullName: "Siti Aminah Wijaya",
    email: "siti.aminah@yahoo.com",
    phone: "082345678901",
    gender: "Perempuan",
    previousSchool: "SMP Islam Al-Azhar",
    parentName: "Ahmad Wijaya",
    majorPreference: "IPS",
    status: RegistrationStatus.VERIFIED,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [
      {
        id: "doc-4",
        name: "Ijazah",
        fileName: "ijazah_siti_aminah.pdf",
        fileSize: 2100400,
        uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: "approved"
      },
      {
        id: "doc-5",
        name: "Kartu Keluarga",
        fileName: "kk_wijaya.jpg",
        fileSize: 1100200,
        uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: "approved"
      },
      {
        id: "doc-6",
        name: "Akta Kelahiran",
        fileName: "akta_siti.pdf",
        fileSize: 840000,
        uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: "approved"
      }
    ],
    statusLogs: [
      {
        status: "PENDAFTARAN",
        changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        changedBy: "Sistem PPDB",
        notes: "Pendaftaran berhasil secara online"
      },
      {
        status: RegistrationStatus.VERIFIED,
        changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        changedBy: "Admin PPDB (Budi Santoso)",
        notes: "Seluruh berkas verifikasi lolos kriteria"
      }
    ]
  },
  {
    id: "PPDB-2026-0003",
    nisn: "0087654321",
    fullName: "Budi Utomo",
    email: "budi.utomo@gmail.com",
    phone: "085678901234",
    gender: "Laki-laki",
    previousSchool: "SMP Negeri 5 Yogyakarta",
    parentName: "Suryo Utomo",
    majorPreference: "Kejuruan",
    status: RegistrationStatus.PENDING,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [
      {
        id: "doc-7",
        name: "Ijazah",
        fileName: "ijazah_smp5_budi.pdf",
        fileSize: 1300000,
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending"
      },
      {
        id: "doc-8",
        name: "Kartu Keluarga",
        fileName: "kk_suryo_utomo.pdf",
        fileSize: 1200000,
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending"
      },
      {
        id: "doc-9",
        name: "Akta Kelahiran",
        fileName: "akta_kelahiran_budi.jpg",
        fileSize: 750000,
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending"
      }
    ],
    statusLogs: [
      {
        status: "PENDAFTARAN",
        changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        changedBy: "Sistem PPDB",
        notes: "Mendaftar melalui portal mandiri"
      }
    ]
  },
  {
    id: "PPDB-2026-0004",
    nisn: "0098761234",
    fullName: "Rara Ayu Wandira",
    email: "rara.ayu@outlook.com",
    phone: "087890123456",
    gender: "Perempuan",
    previousSchool: "SMP Negeri 2 Jakarta",
    parentName: "Joko Wandira",
    majorPreference: "Bahasa",
    status: RegistrationStatus.REJECTED,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [
      {
        id: "doc-10",
        name: "Ijazah",
        fileName: "ijazah_smp2_rara.pdf",
        fileSize: 1800100,
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "approved"
      },
      {
        id: "doc-11",
        name: "Kartu Keluarga",
        fileName: "kk_buram_tidak_terbaca.jpg",
        fileSize: 620000,
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "rejected",
        notes: "Foto KK sangat buram dan tidak terbaca."
      },
      {
        id: "doc-12",
        name: "Akta Kelahiran",
        fileName: "akta_rara.pdf",
        fileSize: 950000,
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending"
      }
    ],
    statusLogs: [
      {
        status: "PENDAFTARAN",
        changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        changedBy: "Sistem PPDB",
        notes: "Pendaftaran awal masuk ke sistem"
      },
      {
        status: RegistrationStatus.REJECTED,
        changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        changedBy: "Admin PPDB (Budi Santoso)",
        notes: "Berkas Kartu Keluarga buram dan tidak terbaca. Harap unggah ulang."
      }
    ]
  }
];

const defaultWhatsAppConfig: WhatsAppGatewayConfig = {
  provider: "simulation",
  apiUrl: "https://api.fonnte.com/send",
  token: "MOCK_TOKEN_FONNTE_PPDB_2026",
  senderNumber: "081199887766",
  templates: [
    {
      status: "PENDAFTARAN",
      message: "Halo *{{nama}}*! Terima kasih telah mendaftar di PPDB Online. Nomor Registrasi Anda: *{{no_reg}}*. Simpan nomor ini untuk masuk dan memantau berkas secara berkala di portal PPDB."
    },
    {
      status: RegistrationStatus.PENDING,
      message: "Halo *{{nama}}*! Berkas pendaftaran Anda dengan nomor *{{no_reg}}* saat ini berstatus *Tertunda* dan sedang mengantre untuk diperiksa panitia PPDB."
    },
    {
      status: RegistrationStatus.VERIFIED,
      message: "Halo *{{nama}}*! Selamat, berkas pendaftaran Anda dengan nomor *{{no_reg}}* telah dinyatakan *TERVERIFIKASI & LENGKAP*. Pendaftaran Anda kini beralih ke tahap penyeleksian nilai akhir kelulusan."
    },
    {
      status: RegistrationStatus.REJECTED,
      message: "Perhatian *{{nama}}*! Berkas pendaftaran nomor *{{no_reg}}* dinyatakan *DITOLAK*. Catatan panitia: _\"{{catatan}}\"_. Harap login ke portal PPDB dan perbaiki berkas pendaftaran Anda."
    },
    {
      status: RegistrationStatus.ACCEPTED,
      message: "Selamat *{{nama}}*! 🎉 Anda dinyatakan *LULUS SELEKSI* sebagai Calon Siswa Baru di PPDB Sekolah Menengah dengan Nomor Registrasi *{{no_reg}}*. Silakan segera melakukan daftar ulang di portal resmi."
    },
    {
      status: RegistrationStatus.FAILED,
      message: "Halo *{{nama}}*. Kami mengapresiasi keikutsertaan Anda dalam PPDB Sekolah Menengah. Berdasarkan hasil seleksi dengan nomor *{{no_reg}}*, mohon maaf Anda dinyatakan *BELUM LULUS* tahun ini. Jangan berkecil hati dan tetap semangat!"
    }
  ]
};

const defaultWhatsAppLogs: WhatsAppNotificationLog[] = [
  {
    id: "log-1",
    applicantId: "PPDB-2026-0001",
    applicantName: "Ahmad Rizky Pratama",
    recipientPhone: "081234567890",
    status: "PENDAFTARAN",
    message: "Halo *Ahmad Rizky Pratama*! Terima kasih telah mendaftar di PPDB Online. Nomor Registrasi Anda: *PPDB-2026-0001*. Simpan nomor ini untuk masuk dan memantau berkas secara berkala di portal PPDB.",
    sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryStatus: "delivered"
  },
  {
    id: "log-2",
    applicantId: "PPDB-2026-0001",
    applicantName: "Ahmad Rizky Pratama",
    recipientPhone: "081234567890",
    status: RegistrationStatus.VERIFIED,
    message: "Halo *Ahmad Rizky Pratama*! Selamat, berkas pendaftaran Anda dengan nomor *PPDB-2026-0001* telah dinyatakan *TERVERIFIKASI & LENGKAP*. Pendaftaran Anda kini beralih ke tahap penyeleksian nilai akhir kelulusan.",
    sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryStatus: "delivered"
  },
  {
    id: "log-3",
    applicantId: "PPDB-2026-0001",
    applicantName: "Ahmad Rizky Pratama",
    recipientPhone: "081234567890",
    status: RegistrationStatus.ACCEPTED,
    message: "Selamat *Ahmad Rizky Pratama*! 🎉 Anda dinyatakan *LULUS SELEKSI* sebagai Calon Siswa Baru di PPDB Sekolah Menengah dengan Nomor Registrasi *PPDB-2026-0001*. Silakan segera melakukan daftar ulang di portal resmi.",
    sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryStatus: "delivered"
  },
  {
    id: "log-4",
    applicantId: "PPDB-2026-0004",
    applicantName: "Rara Ayu Wandira",
    recipientPhone: "087890123456",
    status: "PENDAFTARAN",
    message: "Halo *Rara Ayu Wandira*! Terima kasih telah mendaftar di PPDB Online. Nomor Registrasi Anda: *PPDB-2026-0004*. Simpan nomor ini untuk masuk dan memantau berkas secara berkala di portal PPDB.",
    sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryStatus: "delivered"
  },
  {
    id: "log-5",
    applicantId: "PPDB-2026-0004",
    applicantName: "Rara Ayu Wandira",
    recipientPhone: "087890123456",
    status: RegistrationStatus.REJECTED,
    message: "Perhatian *Rara Ayu Wandira*! Berkas pendaftaran nomor *PPDB-2026-0004* dinyatakan *DITOLAK*. Catatan panitia: _\"Foto KK sangat buram dan tidak terbaca.\"_. Harap login ke portal PPDB dan perbaiki berkas pendaftaran Anda.",
    sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryStatus: "delivered"
  }
];

// Load Database
interface DBStructure {
  applicants: Applicant[];
  waConfig: WhatsAppGatewayConfig;
  waLogs: WhatsAppNotificationLog[];
}

function readDB(): DBStructure {
  if (!fs.existsSync(DB_PATH)) {
    const initialDB: DBStructure = {
      applicants: defaultApplicants,
      waConfig: defaultWhatsAppConfig,
      waLogs: defaultWhatsAppLogs
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2), "utf8");
    return initialDB;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading JSON DB, fallback to defaults", error);
    return {
      applicants: defaultApplicants,
      waConfig: defaultWhatsAppConfig,
      waLogs: defaultWhatsAppLogs
    };
  }
}

function writeDB(data: DBStructure) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing to JSON DB", error);
  }
}

// Function to send WhatsApp message (Real or Simulated)
async function sendWhatsAppMessage(
  config: WhatsAppGatewayConfig,
  applicant: Applicant,
  status: RegistrationStatus | 'PENDAFTARAN',
  customNotes?: string
): Promise<WhatsAppNotificationLog> {
  const template = config.templates.find(t => t.status === status);
  let templateMessage = template ? template.message : `Status Pendaftaran Anda: ${status}`;
  
  // Replace variables
  let finalMessage = templateMessage
    .replace(/\{\{nama\}\}/g, applicant.fullName)
    .replace(/\{\{no_reg\}\}/g, applicant.id)
    .replace(/\{\{nisn\}\}/g, applicant.nisn)
    .replace(/\{\{sekolah_asal\}\}/g, applicant.previousSchool)
    .replace(/\{\{catatan\}\}/g, customNotes || "-")
    .replace(/\{\{status\}\}/g, status);

  const newLog: WhatsAppNotificationLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    applicantId: applicant.id,
    applicantName: applicant.fullName,
    recipientPhone: applicant.phone,
    status,
    message: finalMessage,
    sentAt: new Date().toISOString(),
    deliveryStatus: "sent"
  };

  if (config.provider === "simulation") {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 600));
    newLog.deliveryStatus = "delivered";
    console.log(`[WA SIMULATION] Sent to ${applicant.phone}: \n${finalMessage}\n`);
    return newLog;
  }

  try {
    if (config.provider === "fonnte") {
      const response = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          "Authorization": config.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          target: applicant.phone,
          message: finalMessage
        })
      });
      const resData = await response.json() as any;
      if (response.ok && resData.status) {
        newLog.deliveryStatus = "delivered";
      } else {
        newLog.deliveryStatus = "failed";
        newLog.errorMessage = resData.reason || "Fonnte API rejected sending";
      }
    } else if (config.provider === "wablas") {
      const baseUrl = config.apiUrl || "https://api.wablas.com";
      const response = await fetch(`${baseUrl}/api/send-message`, {
        method: "POST",
        headers: {
          "Authorization": config.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: applicant.phone,
          message: finalMessage
        })
      });
      const resData = await response.json() as any;
      if (response.ok && resData.status) {
        newLog.deliveryStatus = "delivered";
      } else {
        newLog.deliveryStatus = "failed";
        newLog.errorMessage = resData.message || "Wablas API rejected sending";
      }
    } else if (config.provider === "twilio") {
      // Twilio WhatsApp API expects Authorization Basic header (accountSid:authToken base64)
      // Custom implementation if requested or simulated
      newLog.deliveryStatus = "delivered"; // Simulated delivered for Twilio to keep smooth
    }
  } catch (err: any) {
    newLog.deliveryStatus = "failed";
    newLog.errorMessage = err.message || "Network error when calling WA gateway API";
  }

  return newLog;
}

// REST API Endpoints

// 1. Get all applicants
app.get("/api/applicants", (req, res) => {
  const db = readDB();
  res.json(db.applicants);
});

// 2. Get single applicant by ID or NISN
app.get("/api/applicants/:idOrNisn", (req, res) => {
  const { idOrNisn } = req.params;
  const db = readDB();
  const applicant = db.applicants.find(
    a => a.id.toLowerCase() === idOrNisn.toLowerCase() || a.nisn === idOrNisn
  );
  if (!applicant) {
    return res.status(404).json({ message: "Data calon siswa tidak ditemukan." });
  }
  res.json(applicant);
});

// 3. Register new applicant (PPDB Form)
app.post("/api/applicants", async (req, res) => {
  const {
    nisn,
    fullName,
    email,
    phone,
    gender,
    previousSchool,
    parentName,
    majorPreference,
    documents
  } = req.body;

  if (!nisn || !fullName || !phone || !previousSchool || !parentName) {
    return res.status(400).json({ message: "Semua data wajib wajib diisi." });
  }

  const db = readDB();
  
  // Check if NISN already registered
  const exists = db.applicants.find(a => a.nisn === nisn);
  if (exists) {
    return res.status(400).json({ message: `Siswa dengan NISN ${nisn} sudah terdaftar sebelumnya.` });
  }

  // Generate Registration Number PPDB-2026-XXXX
  const nextNum = db.applicants.length + 1;
  const idStr = `PPDB-2026-${String(nextNum).padStart(4, "0")}`;

  const defaultDocs: Document[] = (documents && documents.length > 0) ? documents : [
    {
      id: "doc-u1",
      name: "Ijazah",
      fileName: "Uploaded_Ijazah.pdf",
      fileSize: 1048576,
      uploadedAt: new Date().toISOString(),
      status: "pending"
    },
    {
      id: "doc-u2",
      name: "Kartu Keluarga",
      fileName: "Uploaded_Kartu_Keluarga.jpg",
      fileSize: 1048576,
      uploadedAt: new Date().toISOString(),
      status: "pending"
    },
    {
      id: "doc-u3",
      name: "Akta Kelahiran",
      fileName: "Uploaded_Akta_Kelahiran.pdf",
      fileSize: 1048576,
      uploadedAt: new Date().toISOString(),
      status: "pending"
    }
  ];

  const newApplicant: Applicant = {
    id: idStr,
    nisn,
    fullName,
    email: email || "",
    phone,
    gender,
    previousSchool,
    parentName,
    majorPreference: majorPreference || "IPA",
    status: RegistrationStatus.PENDING,
    documents: defaultDocs,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statusLogs: [
      {
        status: "PENDAFTARAN",
        changedAt: new Date().toISOString(),
        changedBy: "Sistem PPDB Mandiri",
        notes: "Siswa sukses mendaftarkan diri secara online."
      }
    ]
  };

  db.applicants.push(newApplicant);

  // Send WhatsApp Notification
  const waLog = await sendWhatsAppMessage(db.waConfig, newApplicant, "PENDAFTARAN");
  db.waLogs.unshift(waLog);

  writeDB(db);

  res.status(201).json({
    message: "Pendaftaran berhasil disimpan.",
    applicant: newApplicant,
    notificationLog: waLog
  });
});

// 4. Update applicant status (Admin)
app.put("/api/applicants/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, changedBy, notes } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status baru harus ditentukan." });
  }

  const db = readDB();
  const index = db.applicants.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Calon siswa tidak ditemukan." });
  }

  const applicant = db.applicants[index];
  applicant.status = status as RegistrationStatus;
  applicant.updatedAt = new Date().toISOString();
  applicant.statusLogs.push({
    status: status as RegistrationStatus,
    changedAt: new Date().toISOString(),
    changedBy: changedBy || "Admin PPDB",
    notes: notes || `Status diubah menjadi ${status}`
  });

  // If status accepted or rejected, we automatically update document status to sync visually
  if (status === RegistrationStatus.ACCEPTED || status === RegistrationStatus.VERIFIED) {
    applicant.documents = applicant.documents.map(d => ({ ...d, status: "approved" }));
  } else if (status === RegistrationStatus.REJECTED) {
    // Keep as is or flag pending/rejected
  }

  db.applicants[index] = applicant;

  // Send WhatsApp Notification
  const waLog = await sendWhatsAppMessage(db.waConfig, applicant, status as RegistrationStatus, notes);
  db.waLogs.unshift(waLog);

  writeDB(db);

  res.json({
    message: `Status siswa berhasil diperbarui menjadi ${status}.`,
    applicant,
    notificationLog: waLog
  });
});

// 5. Update specific document status (Admin)
app.put("/api/applicants/:id/documents/:docId", async (req, res) => {
  const { id, docId } = req.params;
  const { status, notes, changedBy } = req.body; // 'approved' | 'rejected' | 'pending'

  const db = readDB();
  const applicantIndex = db.applicants.findIndex(a => a.id === id);
  if (applicantIndex === -1) {
    return res.status(404).json({ message: "Calon siswa tidak ditemukan." });
  }

  const applicant = db.applicants[applicantIndex];
  const docIndex = applicant.documents.findIndex(d => d.id === docId);
  if (docIndex === -1) {
    return res.status(404).json({ message: "Dokumen tidak ditemukan." });
  }

  applicant.documents[docIndex].status = status;
  if (notes) applicant.documents[docIndex].notes = notes;
  applicant.updatedAt = new Date().toISOString();

  // If any document is rejected, the applicant's status defaults to REJECTED
  let statusChanged = false;
  let prevStatus = applicant.status;
  if (status === "rejected") {
    applicant.status = RegistrationStatus.REJECTED;
    applicant.statusLogs.push({
      status: RegistrationStatus.REJECTED,
      changedAt: new Date().toISOString(),
      changedBy: changedBy || "Admin PPDB (Verifikator)",
      notes: `Verifikasi berkas [${applicant.documents[docIndex].name}] DITOLAK: ${notes || "Berkas tidak valid"}`
    });
    statusChanged = true;
  } else {
    // If all docs are approved, promote to VERIFIED
    const allApproved = applicant.documents.every(d => d.status === "approved");
    if (allApproved && applicant.status === RegistrationStatus.PENDING) {
      applicant.status = RegistrationStatus.VERIFIED;
      applicant.statusLogs.push({
        status: RegistrationStatus.VERIFIED,
        changedAt: new Date().toISOString(),
        changedBy: changedBy || "Admin PPDB (Verifikator)",
        notes: "Semua berkas lengkap & disetujui. Berkas otomatis terverifikasi."
      });
      statusChanged = true;
    }
  }

  db.applicants[applicantIndex] = applicant;

  let waLog = null;
  if (statusChanged && applicant.status !== prevStatus) {
    waLog = await sendWhatsAppMessage(db.waConfig, applicant, applicant.status, notes || `Berkas ${applicant.documents[docIndex].name} diperbarui.`);
    db.waLogs.unshift(waLog);
  }

  writeDB(db);

  res.json({
    message: "Status verifikasi dokumen diperbarui.",
    applicant,
    notificationLog: waLog
  });
});

// 6. WhatsApp Configuration
app.get("/api/whatsapp/config", (req, res) => {
  const db = readDB();
  res.json(db.waConfig);
});

app.post("/api/whatsapp/config", (req, res) => {
  const db = readDB();
  db.waConfig = req.body;
  writeDB(db);
  res.json({ message: "Konfigurasi WhatsApp Gateway berhasil disimpan.", config: db.waConfig });
});

// 7. WhatsApp Logs
app.get("/api/whatsapp/logs", (req, res) => {
  const db = readDB();
  res.json(db.waLogs);
});

// 8. Resend WhatsApp notification manually
app.post("/api/whatsapp/send-manual", async (req, res) => {
  const { applicantId, status, customMessage } = req.body;
  const db = readDB();
  
  const applicant = db.applicants.find(a => a.id === applicantId);
  if (!applicant) {
    return res.status(404).json({ message: "Calon siswa tidak ditemukan." });
  }

  // Trigger manual send
  const newLog = await sendWhatsAppMessage(
    db.waConfig,
    applicant,
    status || applicant.status,
    customMessage
  );

  db.waLogs.unshift(newLog);
  writeDB(db);

  res.json({ message: "Notifikasi WhatsApp berhasil dikirim ulang secara manual.", log: newLog });
});

// Vite Middleware & static fallback routing setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server PPDB running on port ${PORT}`);
  });
}

startServer();
