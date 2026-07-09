import { RegistrationStatus, Applicant, Document, WhatsAppGatewayConfig, WhatsAppNotificationLog } from "../types";

// Seed Data
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
    createdAt: "2026-06-22T04:33:18.780Z",
    updatedAt: "2026-06-26T04:33:18.780Z",
    documents: [
      {
        id: "doc-1",
        name: "Ijazah",
        fileName: "ijazah_smp_ahmad_rizky.pdf",
        fileSize: 1450200,
        uploadedAt: "2026-06-22T04:33:18.780Z",
        status: "approved"
      },
      {
        id: "doc-2",
        name: "Kartu Keluarga",
        fileName: "kk_keluarga_hendra.jpg",
        fileSize: 850300,
        uploadedAt: "2026-06-22T04:33:18.780Z",
        status: "approved"
      },
      {
        id: "doc-3",
        name: "Akta Kelahiran",
        fileName: "akta_kelahiran_ahmad.pdf",
        fileSize: 920100,
        uploadedAt: "2026-06-22T04:33:18.780Z",
        status: "approved"
      }
    ],
    statusLogs: [
      {
        status: "PENDAFTARAN",
        changedAt: "2026-06-22T04:33:18.780Z",
        changedBy: "Sistem PPDB",
        notes: "Pendaftaran berhasil secara online"
      },
      {
        status: RegistrationStatus.VERIFIED,
        changedAt: "2026-06-24T04:33:18.780Z",
        changedBy: "Admin PPDB (Budi Santoso)",
        notes: "Berkas dinyatakan valid dan lengkap setelah verifikasi administrasi."
      },
      {
        status: RegistrationStatus.ACCEPTED,
        changedAt: "2026-06-26T04:33:18.780Z",
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
    createdAt: "2026-06-23T04:33:18.780Z",
    updatedAt: "2026-06-25T04:33:18.780Z",
    documents: [
      {
        id: "doc-4",
        name: "Ijazah",
        fileName: "ijazah_siti_aminah.pdf",
        fileSize: 2100400,
        uploadedAt: "2026-06-23T04:33:18.780Z",
        status: "approved"
      },
      {
        id: "doc-5",
        name: "Kartu Keluarga",
        fileName: "kk_wijaya.jpg",
        fileSize: 1100200,
        uploadedAt: "2026-06-23T04:33:18.780Z",
        status: "approved"
      },
      {
        id: "doc-6",
        name: "Akta Kelahiran",
        fileName: "akta_siti.pdf",
        fileSize: 840000,
        uploadedAt: "2026-06-23T04:33:18.780Z",
        status: "approved"
      }
    ],
    statusLogs: [
      {
        status: "PENDAFTARAN",
        changedAt: "2026-06-23T04:33:18.780Z",
        changedBy: "Sistem PPDB",
        notes: "Pendaftaran berhasil secara online"
      },
      {
        status: RegistrationStatus.VERIFIED,
        changedAt: "2026-06-25T04:33:18.780Z",
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
    createdAt: "2026-06-24T04:33:18.780Z",
    updatedAt: "2026-06-24T04:33:18.780Z",
    documents: [
      {
        id: "doc-7",
        name: "Ijazah",
        fileName: "ijazah_smp5_budi.pdf",
        fileSize: 1300000,
        uploadedAt: "2026-06-24T04:33:18.780Z",
        status: "pending"
      },
      {
        id: "doc-8",
        name: "Kartu Keluarga",
        fileName: "kk_suryo_utomo.pdf",
        fileSize: 1200000,
        uploadedAt: "2026-06-24T04:33:18.780Z",
        status: "pending"
      },
      {
        id: "doc-9",
        name: "Akta Kelahiran",
        fileName: "akta_kelahiran_budi.jpg",
        fileSize: 750000,
        uploadedAt: "2026-06-24T04:33:18.780Z",
        status: "pending"
      }
    ],
    statusLogs: [
      {
        status: "PENDAFTARAN",
        changedAt: "2026-06-24T04:33:18.780Z",
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
    createdAt: "2026-06-23T04:33:18.780Z",
    updatedAt: "2026-06-25T04:33:18.780Z",
    documents: [
      {
        id: "doc-10",
        name: "Ijazah",
        fileName: "ijazah_smp2_rara.pdf",
        fileSize: 1800100,
        uploadedAt: "2026-06-23T04:33:18.780Z",
        status: "approved"
      },
      {
        id: "doc-11",
        name: "Kartu Keluarga",
        fileName: "kk_buram_tidak_terbaca.jpg",
        fileSize: 620000,
        uploadedAt: "2026-06-23T04:33:18.780Z",
        status: "rejected",
        notes: "Foto KK sangat buram dan tidak terbaca."
      },
      {
        id: "doc-12",
        name: "Akta Kelahiran",
        fileName: "akta_rara.pdf",
        fileSize: 950000,
        uploadedAt: "2026-06-23T04:33:18.780Z",
        status: "pending"
      }
    ],
    statusLogs: [
      {
        status: "PENDAFTARAN",
        changedAt: "2026-06-23T04:33:18.780Z",
        changedBy: "Sistem PPDB",
        notes: "Pendaftaran awal masuk ke sistem"
      },
      {
        status: RegistrationStatus.REJECTED,
        changedAt: "2026-06-25T04:33:18.780Z",
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
    sentAt: "2026-06-22T04:33:18.780Z",
    deliveryStatus: "delivered"
  },
  {
    id: "log-2",
    applicantId: "PPDB-2026-0001",
    applicantName: "Ahmad Rizky Pratama",
    recipientPhone: "081234567890",
    status: RegistrationStatus.VERIFIED,
    message: "Halo *Ahmad Rizky Pratama*! Selamat, berkas pendaftaran Anda dengan nomor *PPDB-2026-0001* telah dinyatakan *TERVERIFIKASI & LENGKAP*. Pendaftaran Anda kini beralih ke tahap penyeleksian nilai akhir kelulusan.",
    sentAt: "2026-06-24T04:33:18.780Z",
    deliveryStatus: "delivered"
  },
  {
    id: "log-3",
    applicantId: "PPDB-2026-0001",
    applicantName: "Ahmad Rizky Pratama",
    recipientPhone: "081234567890",
    status: RegistrationStatus.ACCEPTED,
    message: "Selamat *Ahmad Rizky Pratama*! 🎉 Anda dinyatakan *LULUS SELEKSI* sebagai Calon Siswa Baru di PPDB Sekolah Menengah dengan Nomor Registrasi *PPDB-2026-0001*. Silakan segera melakukan daftar ulang di portal resmi.",
    sentAt: "2026-06-26T04:33:18.780Z",
    deliveryStatus: "delivered"
  },
  {
    id: "log-4",
    applicantId: "PPDB-2026-0004",
    applicantName: "Rara Ayu Wandira",
    recipientPhone: "087890123456",
    status: "PENDAFTARAN",
    message: "Halo *Rara Ayu Wandira*! Terima kasih telah mendaftar di PPDB Online. Nomor Registrasi Anda: *PPDB-2026-0004*. Simpan nomor ini untuk masuk dan memantau berkas secara berkala di portal PPDB.",
    sentAt: "2026-06-23T04:33:18.780Z",
    deliveryStatus: "delivered"
  },
  {
    id: "log-5",
    applicantId: "PPDB-2026-0004",
    applicantName: "Rara Ayu Wandira",
    recipientPhone: "087890123456",
    status: RegistrationStatus.REJECTED,
    message: "Perhatian *Rara Ayu Wandira*! Berkas pendaftaran nomor *PPDB-2026-0004* dinyatakan *DITOLAK*. Catatan panitia: _\"Foto KK sangat buram dan tidak terbaca.\"_. Harap login ke portal PPDB dan perbaiki berkas pendaftaran Anda.",
    sentAt: "2026-06-25T04:33:18.780Z",
    deliveryStatus: "delivered"
  }
];

// Helper to interact with client-side simulated DB in localStorage
function getLocalApplicants(): Applicant[] {
  const data = localStorage.getItem("ppdb_applicants");
  if (!data) {
    localStorage.setItem("ppdb_applicants", JSON.stringify(defaultApplicants));
    return defaultApplicants;
  }
  return JSON.parse(data);
}

function saveLocalApplicants(applicants: Applicant[]) {
  localStorage.setItem("ppdb_applicants", JSON.stringify(applicants));
}

function getLocalWhatsAppConfig(): WhatsAppGatewayConfig {
  const data = localStorage.getItem("ppdb_wa_config");
  if (!data) {
    localStorage.setItem("ppdb_wa_config", JSON.stringify(defaultWhatsAppConfig));
    return defaultWhatsAppConfig;
  }
  return JSON.parse(data);
}

function saveLocalWhatsAppConfig(config: WhatsAppGatewayConfig) {
  localStorage.setItem("ppdb_wa_config", JSON.stringify(config));
}

function getLocalWhatsAppLogs(): WhatsAppNotificationLog[] {
  const data = localStorage.getItem("ppdb_wa_logs");
  if (!data) {
    localStorage.setItem("ppdb_wa_logs", JSON.stringify(defaultWhatsAppLogs));
    return defaultWhatsAppLogs;
  }
  return JSON.parse(data);
}

function saveLocalWhatsAppLogs(logs: WhatsAppNotificationLog[]) {
  localStorage.setItem("ppdb_wa_logs", JSON.stringify(logs));
}

// Generate notification log helper
function generateSimulatedWhatsAppLog(
  config: WhatsAppGatewayConfig,
  applicant: Applicant,
  status: RegistrationStatus | "PENDAFTARAN",
  customNotes?: string
): WhatsAppNotificationLog {
  const template = config.templates.find(t => t.status === status);
  const templateMessage = template ? template.message : `Status Pendaftaran Anda: ${status}`;
  
  const finalMessage = templateMessage
    .replace(/\{\{nama\}\}/g, applicant.fullName)
    .replace(/\{\{no_reg\}\}/g, applicant.id)
    .replace(/\{\{nisn\}\}/g, applicant.nisn)
    .replace(/\{\{sekolah_asal\}\}/g, applicant.previousSchool)
    .replace(/\{\{catatan\}\}/g, customNotes || "-")
    .replace(/\{\{status\}\}/g, status);

  return {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    applicantId: applicant.id,
    applicantName: applicant.fullName,
    recipientPhone: applicant.phone,
    status,
    message: finalMessage,
    sentAt: new Date().toISOString(),
    deliveryStatus: "delivered"
  };
}

// Simulation function to mimic Express backend
function simulateApi(urlStr: string, init?: RequestInit): Promise<Response> {
  const url = new URL(urlStr, window.location.origin);
  const path = url.pathname;
  const method = init?.method?.toUpperCase() || "GET";
  const body = init?.body ? JSON.parse(init.body as string) : null;

  let responseData: any = null;
  let responseStatus = 200;

  // 1. GET /api/applicants
  if (path === "/api/applicants" && method === "GET") {
    responseData = getLocalApplicants();
  }
  
  // 2. POST /api/applicants
  else if (path === "/api/applicants" && method === "POST") {
    const applicants = getLocalApplicants();
    const config = getLocalWhatsAppConfig();
    const logs = getLocalWhatsAppLogs();

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
    } = body;

    const exists = applicants.find(a => a.nisn === nisn);
    if (exists) {
      return Promise.resolve(new Response(JSON.stringify({ message: `Siswa dengan NISN ${nisn} sudah terdaftar sebelumnya.` }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }));
    }

    const nextNum = applicants.length + 1;
    const idStr = `PPDB-2026-${String(nextNum).padStart(4, "0")}`;

    const defaultDocs: Document[] = (documents && documents.length > 0) ? documents : [
      { id: "doc-u1", name: "Ijazah", fileName: "Uploaded_Ijazah.pdf", fileSize: 1048576, uploadedAt: new Date().toISOString(), status: "pending" },
      { id: "doc-u2", name: "Kartu Keluarga", fileName: "Uploaded_Kartu_Keluarga.jpg", fileSize: 1048576, uploadedAt: new Date().toISOString(), status: "pending" },
      { id: "doc-u3", name: "Akta Kelahiran", fileName: "Uploaded_Akta_Kelahiran.pdf", fileSize: 1048576, uploadedAt: new Date().toISOString(), status: "pending" }
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

    applicants.push(newApplicant);
    saveLocalApplicants(applicants);

    const waLog = generateSimulatedWhatsAppLog(config, newApplicant, "PENDAFTARAN");
    logs.unshift(waLog);
    saveLocalWhatsAppLogs(logs);

    responseData = {
      message: "Pendaftaran berhasil disimpan.",
      applicant: newApplicant,
      notificationLog: waLog
    };
    responseStatus = 201;
  }

  // 3. GET /api/applicants/:idOrNisn
  else if (path.startsWith("/api/applicants/") && method === "GET") {
    const parts = path.split("/");
    // path: /api/applicants/:idOrNisn
    if (parts.length === 4) {
      const idOrNisn = decodeURIComponent(parts[3]);
      const applicants = getLocalApplicants();
      const applicant = applicants.find(
        a => a.id.toLowerCase() === idOrNisn.toLowerCase() || a.nisn === idOrNisn
      );
      if (!applicant) {
        return Promise.resolve(new Response(JSON.stringify({ message: "Data calon siswa tidak ditemukan." }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        }));
      }
      responseData = applicant;
    }
  }

  // 4. PUT /api/applicants/:id/status
  else if (path.startsWith("/api/applicants/") && path.endsWith("/status") && method === "PUT") {
    const parts = path.split("/");
    const id = decodeURIComponent(parts[3]);
    const applicants = getLocalApplicants();
    const index = applicants.findIndex(a => a.id === id);
    
    if (index === -1) {
      return Promise.resolve(new Response(JSON.stringify({ message: "Calon siswa tidak ditemukan." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      }));
    }

    const { status, changedBy, notes } = body;
    const applicant = applicants[index];
    applicant.status = status as RegistrationStatus;
    applicant.updatedAt = new Date().toISOString();
    applicant.statusLogs.push({
      status: status as RegistrationStatus,
      changedAt: new Date().toISOString(),
      changedBy: changedBy || "Admin PPDB",
      notes: notes || `Status diubah menjadi ${status}`
    });

    if (status === RegistrationStatus.ACCEPTED || status === RegistrationStatus.VERIFIED) {
      applicant.documents = applicant.documents.map(d => ({ ...d, status: "approved" }));
    }

    applicants[index] = applicant;
    saveLocalApplicants(applicants);

    const config = getLocalWhatsAppConfig();
    const logs = getLocalWhatsAppLogs();
    const waLog = generateSimulatedWhatsAppLog(config, applicant, status as RegistrationStatus, notes);
    logs.unshift(waLog);
    saveLocalWhatsAppLogs(logs);

    responseData = {
      message: `Status siswa berhasil diperbarui menjadi ${status}.`,
      applicant,
      notificationLog: waLog
    };
  }

  // 5. PUT /api/applicants/:id/documents/:docId
  else if (path.startsWith("/api/applicants/") && path.includes("/documents/") && method === "PUT") {
    const parts = path.split("/");
    const id = decodeURIComponent(parts[3]);
    const docId = decodeURIComponent(parts[5]);
    
    const applicants = getLocalApplicants();
    const applicantIndex = applicants.findIndex(a => a.id === id);
    if (applicantIndex === -1) {
      return Promise.resolve(new Response(JSON.stringify({ message: "Calon siswa tidak ditemukan." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      }));
    }

    const { status, notes, changedBy } = body;
    const applicant = applicants[applicantIndex];
    const docIndex = applicant.documents.findIndex(d => d.id === docId);
    
    if (docIndex === -1) {
      return Promise.resolve(new Response(JSON.stringify({ message: "Dokumen tidak ditemukan." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      }));
    }

    applicant.documents[docIndex].status = status;
    if (notes) applicant.documents[docIndex].notes = notes;
    applicant.updatedAt = new Date().toISOString();

    let statusChanged = false;
    const prevStatus = applicant.status;

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

    applicants[applicantIndex] = applicant;
    saveLocalApplicants(applicants);

    let waLog = null;
    if (statusChanged && applicant.status !== prevStatus) {
      const config = getLocalWhatsAppConfig();
      const logs = getLocalWhatsAppLogs();
      waLog = generateSimulatedWhatsAppLog(config, applicant, applicant.status, notes || `Berkas ${applicant.documents[docIndex].name} diperbarui.`);
      logs.unshift(waLog);
      saveLocalWhatsAppLogs(logs);
    }

    responseData = {
      message: "Status verifikasi dokumen diperbarui.",
      applicant,
      notificationLog: waLog
    };
  }

  // 6. GET /api/whatsapp/config
  else if (path === "/api/whatsapp/config" && method === "GET") {
    responseData = getLocalWhatsAppConfig();
  }

  // 7. POST /api/whatsapp/config
  else if (path === "/api/whatsapp/config" && method === "POST") {
    saveLocalWhatsAppConfig(body);
    responseData = { message: "Konfigurasi WhatsApp Gateway berhasil disimpan.", config: body };
  }

  // 8. GET /api/whatsapp/logs
  else if (path === "/api/whatsapp/logs" && method === "GET") {
    responseData = getLocalWhatsAppLogs();
  }

  // 9. POST /api/whatsapp/test
  else if (path === "/api/whatsapp/test" && method === "POST") {
    const { phone, message } = body;
    const config = getLocalWhatsAppConfig();
    const logs = getLocalWhatsAppLogs();

    const testLog: WhatsAppNotificationLog = {
      id: `test-log-${Date.now()}`,
      applicantId: "TEST",
      applicantName: "Tester WhatsApp",
      recipientPhone: phone,
      status: "PENDAFTARAN",
      message: message,
      sentAt: new Date().toISOString(),
      deliveryStatus: "delivered"
    };

    logs.unshift(testLog);
    saveLocalWhatsAppLogs(logs);

    responseData = { success: true, log: testLog };
  }

  // Return simulated HTTP response
  return Promise.resolve(new Response(JSON.stringify(responseData), {
    status: responseStatus,
    headers: { "Content-Type": "application/json" }
  }));
}

// Global fetch Interceptor
const originalFetch = window.fetch ? window.fetch.bind(window) : null;

export async function customFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === "string" ? input : (input instanceof URL ? input.toString() : (input && 'url' in input ? (input as Request).url : ""));
  
  if (url.startsWith("/api/")) {
    if (localStorage.getItem("ppdb_use_local_db") === "true") {
      return simulateApi(url, init);
    }

    try {
      if (!originalFetch) {
        throw new Error("Original window.fetch is not available.");
      }
      const response = await originalFetch(input, init);
      const contentType = response.headers.get("content-type");
      
      // If Vercel serves index.html (SPA fallback) or returns 404, fallback to localStorage
      if (response.status === 404 || (contentType && contentType.includes("text/html"))) {
        console.warn("Backend API not found or returned HTML, switching to Local Storage DB.");
        localStorage.setItem("ppdb_use_local_db", "true");
        return simulateApi(url, init);
      }
      return response;
    } catch (error) {
      console.warn("Backend API call failed, falling back to Local Storage DB.", error);
      localStorage.setItem("ppdb_use_local_db", "true");
      return simulateApi(url, init);
    }
  }

  if (!originalFetch) {
    throw new Error("Original window.fetch is not available.");
  }
  return originalFetch(input, init);
}

// Try to globally define customFetch on window.fetch if writable/configurable,
// to catch any other un-migrated fetches, but handle failure gracefully.
try {
  if (window && typeof window === 'object') {
    Object.defineProperty(window, 'fetch', {
      value: customFetch,
      writable: true,
      configurable: true
    });
  }
} catch (e) {
  console.warn("Failed to define window.fetch via Object.defineProperty. Falling back to direct assignment.", e);
  try {
    (window as any).fetch = customFetch;
  } catch (err) {
    console.warn("Could not assign window.fetch directly (read-only/getter-only). Applications should import and use customFetch explicitly.", err);
  }
}

