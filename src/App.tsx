import React, { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import RegistrationForm from "./components/RegistrationForm.jsx";
import AnnouncementPanel from "./components/AnnouncementPanel.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import { GraduationCap, Phone, Info, CalendarRange, MapPin } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<"register" | "announcement" | "admin">("register");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleRegistrationSuccess = (newApplicant: any) => {
    console.log("New applicant registered:", newApplicant);
    // You can perform some side effect here if needed
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans text-black selection:bg-amber-400 selection:text-black antialiased">
      {/* Neo-brutalist Bold Header Navbar */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin} 
      />

      {/* Hero Banner Area (Only visible on non-admin mode) */}
      {currentTab !== "admin" && (
        <section id="ppdb-hero-section" className="bg-[#FFDD00] text-black py-16 px-6 border-b-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] m-4 md:m-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4">
              <div className="inline-block bg-black text-white px-4 py-1.5 border-2 border-black font-black uppercase text-xs tracking-widest animate-pulse leading-none">
                Pendaftaran Gelombang I Dibuka!
              </div>
              <h2 className="text-5xl sm:text-8xl font-black uppercase tracking-tighter leading-none text-black">
                PPDB <span className="text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">2026</span>
              </h2>
              <p className="text-lg sm:text-2xl font-black tracking-tight uppercase text-black">
                Sistem Pendaftaran Siswa Baru • SMAN 1 PPDB CENTER
              </p>
              <p className="text-xs sm:text-sm font-bold text-neutral-800 uppercase tracking-wider max-w-2xl leading-relaxed">
                Selamat datang di portal Penerimaan Peserta Didik Baru (PPDB) SMAN 1. Proses pendaftaran mudah, transparan, terintegrasi WhatsApp, dan terpantau secara real-time.
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-2 shrink-0 w-full md:w-auto">
              <div className="text-xs font-mono font-bold bg-white border-2 border-black px-3 py-1.5 flex items-center gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] w-full md:w-auto justify-center md:justify-start">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                REAL-TIME SERVER: ONLINE
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Render */}
      <main className="flex-grow py-6">
        {currentTab === "register" && (
          <RegistrationForm onSuccess={handleRegistrationSuccess} />
        )}

        {currentTab === "announcement" && (
          <AnnouncementPanel />
        )}

        {currentTab === "admin" && isAdmin && (
          <AdminDashboard />
        )}
      </main>

      {/* Bold, Neo-Brutalist Footer */}
      <footer id="ppdb-footer" className="bg-black text-white border-t-4 border-black mt-16 print:hidden">
        
        {/* Upper footer grid */}
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-neutral-800">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-amber-400 text-black p-1.5 border border-black rounded-none">
                <GraduationCap size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-black text-md uppercase tracking-wider text-white">SMAN 1 PPDB CENTER</h3>
            </div>
            <p className="text-xs font-bold text-neutral-400 uppercase leading-relaxed">
              Pusat Pelayanan Administrasi & Verifikasi Berkas Penerimaan Peserta Didik Baru Terintegrasi dan Real-Time.
            </p>
            <p className="text-[10px] font-mono font-bold text-amber-400 uppercase">
              Tahun Ajaran 2026/2027 • Versi 1.1.4
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-widest text-amber-400">JADWAL SELEKSI UTAMA</h4>
            <ul className="text-xs font-bold text-neutral-300 space-y-2 uppercase">
              <li className="flex items-center gap-2 leading-none">
                <CalendarRange size={14} className="text-neutral-400 flex-shrink-0" />
                <span>Pendaftaran: 10 Mei - 26 Juni 2026</span>
              </li>
              <li className="flex items-center gap-2 leading-none">
                <CalendarRange size={14} className="text-neutral-400 flex-shrink-0" />
                <span>Rapat Seleksi Berkas: 27 Juni 2026</span>
              </li>
              <li className="flex items-center gap-2 leading-none">
                <CalendarRange size={14} className="text-neutral-400 flex-shrink-0" />
                <span className="text-green-400">Pengumuman Kelulusan: 29 Juni 2026</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-widest text-amber-400">KONTAK & LOKASI</h4>
            <ul className="text-xs font-bold text-neutral-300 space-y-2 uppercase">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-neutral-400 flex-shrink-0 mt-0.5" />
                <span>Jl. Pendidikan No. 45, Kompleks Kampus SMAN 1, Kota Bandung, Jawa Barat</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-neutral-400 flex-shrink-0" />
                <span>Sekretariat: (022) 7654-3210</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower footer copyright */}
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
          <p>© 2026 Panitia PPDB SMAN 1. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Info size={12} />
            <span>Sistem Terverifikasi • Real-Time Database</span>
          </div>
        </div>

      </footer>
    </div>
  );
}
