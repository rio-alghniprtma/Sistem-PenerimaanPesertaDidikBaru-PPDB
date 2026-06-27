import React, { useState, useEffect } from "react";
import { 
  Users, CheckSquare, ShieldCheck, XCircle, FileText, 
  Search, Filter, RefreshCw, Eye, Check, X, AlertCircle, 
  ArrowUpRight, Send, MessageSquare, Settings, Info, Clock 
} from "lucide-react";
import { RegistrationStatus, Applicant, Document } from "../types.js";
import WhatsAppConfig from "./WhatsAppConfig.jsx"; // We will create this next

export default function AdminDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"applicants" | "whatsapp">("applicants");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [majorFilter, setMajorFilter] = useState<string>("ALL");

  // Verifier detail modal state
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [docNotes, setDocNotes] = useState<{ [docId: string]: string }>({});
  const [statusChangeNotes, setStatusChangeNotes] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    accepted: 0,
    rejected: 0,
    failed: 0,
    docCompletion: 0
  });

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/applicants");
      if (res.ok) {
        const data = await res.json();
        setApplicants(data);
        calculateStats(data);
      }
    } catch (err) {
      console.error("Error fetching applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const calculateStats = (list: Applicant[]) => {
    const total = list.length;
    const pending = list.filter(a => a.status === RegistrationStatus.PENDING).length;
    const verified = list.filter(a => a.status === RegistrationStatus.VERIFIED).length;
    const accepted = list.filter(a => a.status === RegistrationStatus.ACCEPTED).length;
    const rejected = list.filter(a => a.status === RegistrationStatus.REJECTED).length;
    const failed = list.filter(a => a.status === RegistrationStatus.FAILED).length;

    // Calculate document completion: ratio of approved docs to total documents
    let totalDocs = 0;
    let approvedDocs = 0;
    list.forEach(a => {
      totalDocs += a.documents.length;
      approvedDocs += a.documents.filter(d => d.status === "approved").length;
    });
    const docCompletion = totalDocs > 0 ? Math.round((approvedDocs / totalDocs) * 100) : 0;

    setStats({ total, pending, verified, accepted, rejected, failed, docCompletion });
  };

  // Filter applicant list
  const filteredApplicants = applicants.filter(a => {
    const matchesSearch = 
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.nisn.includes(searchQuery) ||
      a.previousSchool.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    const matchesMajor = majorFilter === "ALL" || a.majorPreference === majorFilter;

    return matchesSearch && matchesStatus && matchesMajor;
  });

  // Count majors for custom bar charts
  const majorCounts = {
    IPA: applicants.filter(a => a.majorPreference === "IPA").length,
    IPS: applicants.filter(a => a.majorPreference === "IPS").length,
    Bahasa: applicants.filter(a => a.majorPreference === "Bahasa").length,
    Kejuruan: applicants.filter(a => a.majorPreference === "Kejuruan").length
  };

  const maxMajorCount = Math.max(...Object.values(majorCounts), 1);

  // Update specific document status
  const updateDocStatus = async (docId: string, status: "approved" | "rejected") => {
    if (!selectedApplicant) return;
    const notes = docNotes[docId] || "";

    try {
      const res = await fetch(`/api/applicants/${selectedApplicant.id}/documents/${docId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes, changedBy: "Budi Santoso (Admin)" })
      });
      if (res.ok) {
        const data = await res.json();
        // Update local state
        setApplicants(prev => prev.map(a => a.id === selectedApplicant.id ? data.applicant : a));
        setSelectedApplicant(data.applicant);
        calculateStats(applicants.map(a => a.id === selectedApplicant.id ? data.applicant : a));
        alert(`Dokumen berhasil di-${status === "approved" ? "SETUJUI" : "TOLAK"}.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update applicant final status (Lulus / Tidak Lulus / Verified)
  const updateApplicantStatus = async (status: RegistrationStatus) => {
    if (!selectedApplicant) return;
    setIsUpdatingStatus(true);

    try {
      const res = await fetch(`/api/applicants/${selectedApplicant.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status, 
          changedBy: "Budi Santoso (Admin)", 
          notes: statusChangeNotes || `Status diubah menjadi ${status}` 
        })
      });
      if (res.ok) {
        const data = await res.json();
        setApplicants(prev => prev.map(a => a.id === selectedApplicant.id ? data.applicant : a));
        setSelectedApplicant(data.applicant);
        calculateStats(applicants.map(a => a.id === selectedApplicant.id ? data.applicant : a));
        setStatusChangeNotes("");
        alert(`Status pendaftaran calon siswa berhasil diperbarui menjadi: ${status}. Notifikasi WhatsApp otomatis telah dikirim.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle manual WA trigger from admin
  const triggerManualWhatsApp = async (applicantId: string, status: string) => {
    const confirmSend = window.confirm("Kirim ulang notifikasi WhatsApp untuk status ini secara manual?");
    if (!confirmSend) return;

    try {
      const res = await fetch("/api/whatsapp/send-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId, status })
      });
      if (res.ok) {
        alert("Notifikasi WhatsApp berhasil dikirim ulang secara manual.");
      } else {
        alert("Gagal mengirim notifikasi.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto my-8 px-4">
      {/* Tab Switcher */}
      <div className="flex border-b-4 border-black mb-8 gap-1.5">
        <button
          onClick={() => setActiveTab("applicants")}
          className={`px-6 py-3 font-black text-xs uppercase tracking-widest border-t-4 border-x-4 border-black relative top-[4px] cursor-pointer transition-all duration-100 ${
            activeTab === "applicants"
              ? "bg-white text-black translate-y-0"
              : "bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-black translate-y-1"
          }`}
        >
          <span className="flex items-center gap-2">
            <Users size={16} /> Monitoring Siswa
          </span>
        </button>
        <button
          onClick={() => setActiveTab("whatsapp")}
          className={`px-6 py-3 font-black text-xs uppercase tracking-widest border-t-4 border-x-4 border-black relative top-[4px] cursor-pointer transition-all duration-100 ${
            activeTab === "whatsapp"
              ? "bg-white text-black translate-y-0"
              : "bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-black translate-y-1"
          }`}
        >
          <span className="flex items-center gap-2">
            <MessageSquare size={16} /> WhatsApp Gateway & Logs
          </span>
        </button>
      </div>

      {activeTab === "applicants" && (
        <div className="space-y-8 animate-fade-in">
          {/* STATISTICS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            <div className="bg-[#FFDD00] border-4 border-black p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
              <span className="text-xs font-bold uppercase block mb-1 text-black/80">TOTAL PENDAFTAR</span>
              <p className="text-5xl sm:text-6xl font-black block leading-none text-black mt-2">{stats.total}</p>
              <span className="text-[10px] font-mono font-bold text-black/60 mt-2 block uppercase">Seluruh Berkas</span>
            </div>

            <div className="bg-[#FF7A00] border-4 border-black p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] text-black">
              <span className="text-xs font-bold uppercase block mb-1 text-black/90 flex items-center gap-1">
                <Clock size={12} className="stroke-[3]" /> TERTUNDA
              </span>
              <p className="text-5xl sm:text-6xl font-black block leading-none mt-2">{stats.pending}</p>
              <span className="text-[10px] font-mono font-bold text-black/70 mt-2 block uppercase">Perlu Tindakan</span>
            </div>

            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
              <span className="text-xs font-bold uppercase block mb-1 text-blue-600 flex items-center gap-1">
                <ShieldCheck size={12} className="stroke-[3]" /> VERIFIED
              </span>
              <p className="text-5xl sm:text-6xl font-black block leading-none text-black mt-2">{stats.verified}</p>
              <span className="text-[10px] font-mono font-bold text-neutral-500 mt-2 block uppercase">Lolos Berkas</span>
            </div>

            <div className="bg-[#00D1FF] border-4 border-black p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] text-black">
              <span className="text-xs font-bold uppercase block mb-1 text-black/90 flex items-center gap-1">
                ✓ LULUS SELEKSI
              </span>
              <p className="text-5xl sm:text-6xl font-black block leading-none mt-2">{stats.accepted}</p>
              <span className="text-[10px] font-mono font-bold text-black/70 mt-2 block uppercase">Kuota Utama</span>
            </div>

            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] col-span-2 md:col-span-1">
              <span className="text-xs font-bold uppercase block mb-1 text-red-600 flex items-center gap-1">
                ✗ DITOLAK
              </span>
              <p className="text-5xl sm:text-6xl font-black block leading-none text-black mt-2">{stats.rejected}</p>
              <span className="text-[10px] font-mono font-bold text-neutral-500 mt-2 block uppercase">Tidak Memenuhi</span>
            </div>

          </div>

          {/* DYNAMIC CHARTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Majors Distribution Neo-Brutalist Chart */}
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <h3 className="font-black text-sm uppercase text-black tracking-widest border-b-2 border-black pb-2 mb-4">
                DISTRIBUSI PEMINATAN / PILIHAN JURUSAN
              </h3>
              
              <div className="space-y-4 font-sans">
                {Object.entries(majorCounts).map(([major, count]) => {
                  const percentage = Math.round((count / maxMajorCount) * 100);
                  return (
                    <div key={major}>
                      <div className="flex justify-between items-center text-xs font-black uppercase text-black mb-1">
                        <span>{major === "Kejuruan" ? "Kejuruan / Teknik" : `Jurusan ${major}`}</span>
                        <span>{count} Calon Siswa</span>
                      </div>
                      <div className="w-full bg-neutral-100 border-2 border-black h-8 overflow-hidden relative">
                        <div 
                          style={{ width: `${percentage}%` }}
                          className={`h-full border-r-2 border-black transition-all duration-500 ${
                            major === "IPA" ? "bg-amber-400" :
                            major === "IPS" ? "bg-blue-400" :
                            major === "Bahasa" ? "bg-green-400" : "bg-red-400"
                          }`}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Document stats and guidelines */}
            <div className="bg-black text-white border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col justify-between">
              <div>
                <h3 className="font-black text-sm uppercase text-amber-400 tracking-widest border-b border-neutral-700 pb-2 mb-4">
                  PROGRES SELEKSI ADMINISTRASI & BERKAS
                </h3>
                <div className="flex items-center gap-6 my-4">
                  <div className="text-5xl font-black text-amber-400 font-mono">
                    {stats.docCompletion}%
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-white">Rasio Validitas Dokumen</p>
                    <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase">
                      Persentase total dokumen pendaftaran (Ijazah, KK, Akta) yang telah disetujui (Approved) oleh verifikator sekolah.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-700 p-3.5 mt-2">
                <p className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                  <Info size={12} /> Alur Verifikasi Panitia PPDB:
                </p>
                <ul className="text-[10px] font-bold text-neutral-300 space-y-1.5 mt-2 list-decimal list-inside uppercase">
                  <li>Periksa berkas pendaftaran calon siswa (Ijazah, KK, Akta Kelahiran).</li>
                  <li>Ubah status berkas per berkas: Setujui jika valid, Tolak dengan catatan jika buram.</li>
                  <li>Jika semua berkas disetujui, sistem otomatis mempromosikan berkas ke <span className="text-blue-400 font-black">TERVERIFIKASI</span>.</li>
                  <li>Lakukan seleksi akhir kelulusan siswa dengan status <span className="text-green-400 font-black">LULUS</span> atau <span className="text-neutral-400 font-black">TIDAK LULUS</span>.</li>
                </ul>
              </div>
            </div>

          </div>

          {/* LIST AND VERIFIER AREA */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* APPLICANT LIST COLUMN (SPAN 2) */}
            <div className="xl:col-span-2 bg-white border-4 border-black p-4 sm:p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-black pb-4 mb-4">
                <h3 className="font-black text-lg uppercase text-black tracking-tight flex items-center gap-2">
                  <CheckSquare size={20} /> DATA PENDAFTAR REAL-TIME
                </h3>
                <button
                  onClick={fetchApplicants}
                  disabled={loading}
                  className="bg-black hover:bg-neutral-800 text-white font-black uppercase text-xs tracking-wider px-3 py-1.5 border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0_0_rgba(251,191,36,1)] hover:shadow-none cursor-pointer"
                >
                  <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
              </div>

              {/* SEARCH & FILTERS CONTROLS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama, No. Reg, NISN..."
                    className="w-full bg-white border-2 border-black p-2.5 pl-8 text-xs font-black text-black placeholder-neutral-400 focus:outline-none focus:bg-amber-50"
                  />
                  <Search className="absolute left-2.5 top-3 text-neutral-500" size={14} />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border-2 border-black p-2.5 text-xs font-black text-black focus:outline-none"
                >
                  <option value="ALL">SEMUA STATUS</option>
                  <option value={RegistrationStatus.PENDING}>STATUS: TERTUNDA</option>
                  <option value={RegistrationStatus.VERIFIED}>STATUS: TERVERIFIKASI</option>
                  <option value={RegistrationStatus.ACCEPTED}>STATUS: LULUS</option>
                  <option value={RegistrationStatus.REJECTED}>STATUS: DITOLAK</option>
                  <option value={RegistrationStatus.FAILED}>STATUS: TIDAK LULUS</option>
                </select>

                {/* Major Filter */}
                <select
                  value={majorFilter}
                  onChange={(e) => setMajorFilter(e.target.value)}
                  className="bg-white border-2 border-black p-2.5 text-xs font-black text-black focus:outline-none"
                >
                  <option value="ALL">SEMUA JURUSAN</option>
                  <option value="IPA">JURUSAN: IPA</option>
                  <option value="IPS">JURUSAN: IPS</option>
                  <option value="Bahasa">JURUSAN: BAHASA</option>
                  <option value="Kejuruan">JURUSAN: KEJURUAN</option>
                </select>

              </div>

              {/* LIST TABLE */}
              <div className="overflow-x-auto border-3 border-black">
                <table className="w-full text-left text-xs font-sans border-collapse">
                  <thead className="bg-black text-white font-black uppercase tracking-wider border-b-3 border-black">
                    <tr>
                      <th className="p-3">Siswa / No. Reg</th>
                      <th className="p-3">NISN</th>
                      <th className="p-3">Sekolah Asal</th>
                      <th className="p-3">Peminatan</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black">
                    {filteredApplicants.length > 0 ? (
                      filteredApplicants.map((a) => (
                        <tr 
                          key={a.id} 
                          className={`hover:bg-amber-50/20 cursor-pointer transition-colors ${
                            selectedApplicant?.id === a.id ? "bg-amber-100/40 font-bold" : ""
                          }`}
                          onClick={() => {
                            setSelectedApplicant(a);
                            // initialize document notes from existing notes
                            const notes: { [key: string]: string } = {};
                            a.documents.forEach(d => {
                              notes[d.id] = d.notes || "";
                            });
                            setDocNotes(notes);
                          }}
                        >
                          <td className="p-3">
                            <p className="font-black text-black uppercase leading-none">{a.fullName}</p>
                            <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-tight block mt-1">{a.id}</span>
                          </td>
                          <td className="p-3 font-mono font-bold text-neutral-700">{a.nisn}</td>
                          <td className="p-3 uppercase font-semibold text-neutral-600">{a.previousSchool}</td>
                          <td className="p-3">
                            <span className="bg-neutral-100 text-black border border-black font-black text-[10px] px-1.5 py-0.5 uppercase">
                              {a.majorPreference}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2.5 py-0.5 border border-black font-black text-[9px] uppercase ${
                              a.status === RegistrationStatus.PENDING ? "bg-amber-400 text-black" :
                              a.status === RegistrationStatus.VERIFIED ? "bg-blue-500 text-white" :
                              a.status === RegistrationStatus.ACCEPTED ? "bg-green-500 text-white" :
                              a.status === RegistrationStatus.REJECTED ? "bg-red-500 text-white" : "bg-neutral-600 text-white"
                            }`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                title="Lihat & Verifikasi Berkas"
                                onClick={() => {
                                  setSelectedApplicant(a);
                                  const notes: { [key: string]: string } = {};
                                  a.documents.forEach(d => {
                                    notes[d.id] = d.notes || "";
                                  });
                                  setDocNotes(notes);
                                }}
                                className="bg-black text-white hover:bg-neutral-800 p-1.5 border border-black transition-colors cursor-pointer"
                              >
                                <Eye size={12} />
                              </button>
                              <button
                                title="Kirim Ulang WA Manual"
                                onClick={() => triggerManualWhatsApp(a.id, a.status)}
                                className="bg-green-500 text-white hover:bg-green-600 p-1.5 border border-black transition-colors cursor-pointer"
                              >
                                <Send size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center font-bold text-neutral-500 uppercase">
                          Tidak ada calon siswa terdaftar yang cocok dengan filter / pencarian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DOCUMENT VERIFIER & DECISION PANEL (SPAN 1) */}
            <div className="bg-white border-4 border-black p-4 sm:p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              {selectedApplicant ? (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="border-b-4 border-black pb-3">
                    <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">Verifikator Berkas</span>
                    <h3 className="font-black text-lg text-black uppercase leading-tight mt-0.5">{selectedApplicant.fullName}</h3>
                    <p className="text-xs font-bold text-neutral-500">Reg: {selectedApplicant.id} • NISN: {selectedApplicant.nisn}</p>
                  </div>

                  {/* Documents Verification List */}
                  <div>
                    <h4 className="text-xs font-black uppercase text-black mb-3.5 tracking-wider">1. PEMERIKSAAN DOKUMEN FISIK</h4>
                    <div className="space-y-4">
                      {selectedApplicant.documents.map((doc) => (
                        <div 
                          key={doc.id}
                          className={`border-2 border-black p-3.5 relative ${
                            doc.status === "approved" ? "bg-green-50/70 border-green-500" :
                            doc.status === "rejected" ? "bg-red-50/70 border-red-500" : "bg-neutral-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <p className="font-black text-xs text-black uppercase">{doc.name}</p>
                              <p className="text-[10px] font-bold text-neutral-500 truncate max-w-56 uppercase mt-0.5">{doc.fileName}</p>
                            </div>
                            <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase border border-black ${
                              doc.status === "approved" ? "bg-green-500 text-white border-green-500" :
                              doc.status === "rejected" ? "bg-red-500 text-white border-red-500" : "bg-amber-400 text-black"
                            }`}>
                              {doc.status === "approved" ? "Approved" : doc.status === "rejected" ? "Rejected" : "Pending"}
                            </span>
                          </div>

                          {/* Notes field */}
                          <div className="mt-3">
                            <input
                              type="text"
                              value={docNotes[doc.id] || ""}
                              onChange={(e) => setDocNotes({ ...docNotes, [doc.id]: e.target.value })}
                              placeholder="Catatan penolakan / koreksi berkas..."
                              className="w-full bg-white border border-black p-1.5 text-[10px] font-bold text-black focus:outline-none"
                            />
                          </div>

                          {/* Action for each doc */}
                          <div className="mt-2.5 flex justify-end gap-1.5">
                            <button
                              onClick={() => updateDocStatus(doc.id, "rejected")}
                              className="bg-white hover:bg-red-100 text-red-600 font-black uppercase text-[9px] px-2.5 py-1 border border-black flex items-center gap-1 cursor-pointer"
                            >
                              <X size={10} strokeWidth={3} /> Tolak Berkas
                            </button>
                            <button
                              onClick={() => updateDocStatus(doc.id, "approved")}
                              className="bg-black text-amber-400 hover:bg-neutral-800 font-black uppercase text-[9px] px-2.5 py-1 border border-black flex items-center gap-1 cursor-pointer"
                            >
                              <Check size={10} strokeWidth={3} /> Setujui Berkas
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final Admission Decisions */}
                  <div className="border-t-3 border-black pt-4">
                    <h4 className="text-xs font-black uppercase text-black mb-3 tracking-wider">2. SELEKSI AKHIR & KEPUTUSAN KELULUSAN</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1.5">
                          Catatan Pleno Keputusan Seleksi *
                        </label>
                        <textarea
                          rows={2}
                          value={statusChangeNotes}
                          onChange={(e) => setStatusChangeNotes(e.target.value)}
                          placeholder="Contoh: Selamat anda dinyatakan lulus seleksi administrasi dan nilai akhir..."
                          className="w-full bg-white border-2 border-black p-2 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none"
                        ></textarea>
                      </div>

                      {/* Decisive Buttons */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <button
                          disabled={isUpdatingStatus}
                          onClick={() => updateApplicantStatus(RegistrationStatus.FAILED)}
                          className="bg-neutral-600 text-white hover:bg-neutral-700 font-black uppercase text-xs p-2.5 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-50 text-center flex items-center justify-center gap-1"
                        >
                          <XCircle size={14} /> TIDAK LULUS
                        </button>
                        <button
                          disabled={isUpdatingStatus}
                          onClick={() => updateApplicantStatus(RegistrationStatus.ACCEPTED)}
                          className="bg-green-500 text-white hover:bg-green-600 font-black uppercase text-xs p-2.5 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-50 text-center flex items-center justify-center gap-1"
                        >
                          <ShieldCheck size={14} /> DINYATAKAN LULUS
                        </button>
                      </div>

                      {/* Manual reset to pending for test */}
                      <button
                        onClick={() => updateApplicantStatus(RegistrationStatus.PENDING)}
                        className="w-full bg-white hover:bg-neutral-50 text-black border-2 border-black font-black uppercase text-[10px] p-2 cursor-pointer transition-all text-center block mt-2"
                      >
                        Reset Status ke Antrean Berkas (Tertunda)
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-neutral-300">
                  <FileText size={44} className="text-neutral-300 mb-2" />
                  <p className="text-xs font-black uppercase text-neutral-400">Pilih Calon Siswa</p>
                  <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase max-w-xs">
                    Klik nama calon siswa di baris tabel pendaftar untuk memuat data dokumen fisik dan membuat keputusan kelulusan.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {activeTab === "whatsapp" && (
        <div className="animate-fade-in">
          <WhatsAppConfig />
        </div>
      )}
    </div>
  );
}
