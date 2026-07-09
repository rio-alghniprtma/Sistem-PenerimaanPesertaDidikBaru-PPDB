import React, { useState } from "react";
import { Search, GraduationCap, Calendar, Check, X, AlertTriangle, FileText, Printer, ShieldCheck, Download, Clock } from "lucide-react";
import { RegistrationStatus, Applicant } from "../types.js";
import { customFetch } from "../lib/apiInterceptor.js";

export default function AnnouncementPanel() {
  const [searchKey, setSearchKey] = useState("");
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKey.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setApplicant(null);
    setSearched(false);

    try {
      const res = await customFetch(`/api/applicants/${searchKey.trim()}`);
      const data = await res.json();

      if (res.ok) {
        setApplicant(data);
        setSearched(true);
      } else {
        setErrorMsg(data.message || "Data tidak ditemukan. Pastikan NISN atau No. Registrasi benar.");
        setSearched(true);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Koneksi gagal ke server. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.PENDING:
        return "bg-amber-400 text-black";
      case RegistrationStatus.VERIFIED:
        return "bg-blue-500 text-white";
      case RegistrationStatus.REJECTED:
        return "bg-red-500 text-white";
      case RegistrationStatus.ACCEPTED:
        return "bg-green-500 text-white animate-pulse";
      case RegistrationStatus.FAILED:
        return "bg-neutral-600 text-white";
      default:
        return "bg-neutral-400 text-black";
    }
  };

  return (
    <div id="announcement-panel-container" className="max-w-3xl mx-auto my-8 px-4">
      {/* Search Bar section */}
      <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] mb-8">
        <h2 className="text-2xl font-black uppercase text-black mb-2 tracking-tight">
          PORTAL PENGUMUMAN SELEKSI PPDB
        </h2>
        <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-6">
          Masukkan No. Registrasi Anda (Contoh: PPDB-2026-0001) atau 10 digit NISN Anda untuk memeriksa status kelulusan terbaru secara real-time.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="No. Registrasi / NISN Calon Siswa..."
              className="w-full bg-white border-3 border-black p-4 pl-12 font-black text-black uppercase focus:bg-amber-50 focus:outline-none transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
            />
            <Search className="absolute left-4 top-4.5 text-neutral-500" size={20} strokeWidth={2.5} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-amber-400 hover:bg-neutral-800 font-black uppercase tracking-wider px-8 py-4 border-3 border-black shadow-[4px_4px_0_0_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Memeriksa..." : "Cek Status"}
          </button>
        </form>
      </div>

      {/* Result Display Section */}
      {searched && applicant && (
        <div className="space-y-8 print:space-y-0">
          
          {/* Status Header Block */}
          <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-black pb-4 mb-4">
              <div>
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">Status Calon Siswa</span>
                <h3 className="font-black text-xl text-black uppercase tracking-tight mt-1">{applicant.fullName}</h3>
                <p className="text-xs font-bold text-neutral-600">No. Registrasi: <span className="font-black text-black uppercase select-all">{applicant.id}</span> • NISN: {applicant.nisn}</p>
              </div>
              <span className={`px-4 py-1.5 border-2 border-black font-black uppercase tracking-wider text-sm shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${getStatusBadge(applicant.status)}`}>
                {applicant.status}
              </span>
            </div>

            {/* Render different UI based on state */}
            
            {/* 1. STATUS PENDING (TERTUNDA) */}
            {applicant.status === RegistrationStatus.PENDING && (
              <div className="bg-amber-50 border-3 border-amber-400 p-5">
                <div className="flex items-start gap-3.5">
                  <div className="bg-amber-400 text-black p-2 border border-black flex-shrink-0">
                    <Clock size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-black uppercase leading-tight">BERKAS DALAM ANTRIAN VERIFIKASI</h4>
                    <p className="text-xs font-semibold text-neutral-700 mt-2">
                      Halo <span className="font-black uppercase">{applicant.fullName}</span>, berkas administrasi Anda (Ijazah, KK, Akta Kelahiran) telah berhasil diterima di server kami. Saat ini berkas Anda berada dalam antrean untuk divalidasi oleh panitia PPDB Sekolah Menengah.
                    </p>
                    <p className="text-xs font-black text-amber-950 mt-3 uppercase tracking-wider">
                      * Notifikasi otomatis WhatsApp akan terkirim setelah berkas diperiksa.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. STATUS VERIFIED (TERVERIFIKASI) */}
            {applicant.status === RegistrationStatus.VERIFIED && (
              <div className="bg-blue-50 border-3 border-blue-400 p-5">
                <div className="flex items-start gap-3.5">
                  <div className="bg-blue-500 text-white p-2 border border-black flex-shrink-0">
                    <ShieldCheck size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-blue-950 uppercase leading-tight">BERKAS LENGKAP & TERVERIFIKASI</h4>
                    <p className="text-xs font-semibold text-neutral-700 mt-2">
                      Selamat! Seluruh berkas administrasi yang Anda unggah dinyatakan <span className="font-black text-blue-900 uppercase">LENGKAP DAN VALID</span>. Anda lolos seleksi berkas administrasi PPDB Gelombang I.
                    </p>
                    <p className="text-xs font-semibold text-neutral-700 mt-2">
                      Pendaftaran Anda saat ini berlanjut ke tahap seleksi akhir perangkingan nilai kelulusan. Pengumuman kelulusan akhir akan diumumkan sesuai jadwal.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. STATUS REJECTED (DITOLAK) */}
            {applicant.status === RegistrationStatus.REJECTED && (
              <div className="bg-red-50 border-3 border-red-400 p-5">
                <div className="flex items-start gap-3.5">
                  <div className="bg-red-500 text-white p-2 border border-black flex-shrink-0">
                    <AlertTriangle size={22} strokeWidth={2.5} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-black text-sm text-red-950 uppercase leading-tight">VERIFIKASI BERKAS DITOLAK</h4>
                    <p className="text-xs font-semibold text-neutral-700 mt-2">
                      Mohon maaf, berkas pendaftaran Anda dinyatakan <span className="font-black text-red-950">BELUM MEMENUHI SYARAT</span> oleh verifikator PPDB.
                    </p>
                    
                    {/* Committee notes */}
                    <div className="bg-white border-2 border-red-400 p-3 my-3 text-xs">
                      <p className="font-black uppercase text-red-600 mb-1">Catatan Penolakan Panitia:</p>
                      <p className="font-mono text-red-900 italic">
                        "{applicant.statusLogs.find(l => l.status === RegistrationStatus.REJECTED)?.notes || 'Berkas tidak sesuai/kurang terbaca.'}"
                      </p>
                    </div>

                    <p className="text-xs font-bold text-neutral-700">
                      Silakan hubungi panitia PPDB Sekolah di ruang verifikator atau login kembali untuk mengunggah ulang dokumen yang ditolak.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. STATUS LULUS (ACCEPTED) - CELEBRATORY CARD */}
            {applicant.status === RegistrationStatus.ACCEPTED && (
              <div className="bg-green-50 border-3 border-green-400 p-5 relative">
                <div className="flex items-start gap-3.5">
                  <div className="bg-green-500 text-white p-2 border border-black flex-shrink-0 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    <Check size={22} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-green-950 uppercase leading-none">CONGRATULATIONS! ANDA DINYATAKAN LULUS</h4>
                    <p className="text-xs font-semibold text-neutral-700 mt-2">
                      Selamat, Anda telah dinyatakan <span className="font-black text-green-900 uppercase">LULUS SELEKSI AKHIR</span> sebagai peserta didik baru di Sekolah Menengah Atas Negeri 1 Tahun Ajaran 2026/2027.
                    </p>
                    <p className="text-xs font-semibold text-neutral-700 mt-2">
                      Guna mengukuhkan status Anda sebagai siswa resmi, silakan unduh Surat Keputusan Kelulusan di bawah dan lakukan daftar ulang berkas di sekolah sebelum tanggal <span className="font-black">10 Juli 2026</span>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 5. STATUS TIDAK LULUS (FAILED) */}
            {applicant.status === RegistrationStatus.FAILED && (
              <div className="bg-neutral-100 border-3 border-neutral-400 p-5">
                <div className="flex items-start gap-3.5">
                  <div className="bg-neutral-600 text-white p-2 border border-black flex-shrink-0">
                    <X size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-neutral-900 uppercase leading-tight">KEPUTUSAN SELEKSI AKHIR</h4>
                    <p className="text-xs font-semibold text-neutral-700 mt-2">
                      Kami menyampaikan terima kasih yang sebesar-besarnya atas keikutsertaan Anda dalam proses PPDB Sekolah Menengah tahun ini.
                    </p>
                    <p className="text-xs font-semibold text-neutral-700 mt-2">
                      Berdasarkan hasil rapat pleno panitia dan perangkingan batas kuota nilai kelulusan, mohon maaf Anda dinyatakan <span className="font-black text-neutral-900">BELUM LULUS SELEKSI AKHIR</span> untuk tahun ajaran ini.
                    </p>
                    <p className="text-xs font-bold text-neutral-600 mt-3">
                      Tetaplah bersemangat! Seleksi PPDB masih terbuka di jalur-jalur alternatif atau sekolah swasta kemitraan. Perjalanan pendidikan Anda masih sangat panjang dan penuh peluang.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TIMELINE PROGRESS */}
            <div className="mt-6 border-t-2 border-black pt-5 print:hidden">
              <h4 className="text-xs font-black uppercase text-black mb-4">Progres Tahapan Pendaftaran PPDB</h4>
              <div className="grid grid-cols-3 gap-2 relative">
                
                {/* Step 1 */}
                <div className="text-center">
                  <div className="mx-auto w-8 h-8 flex items-center justify-center border-2 border-black bg-black text-white font-black text-xs">
                    ✓
                  </div>
                  <p className="text-[10px] font-black uppercase text-black mt-1.5">Pendaftaran</p>
                  <p className="text-[9px] font-bold text-neutral-500 uppercase mt-0.5">Selesai</p>
                </div>

                {/* Step 2 */}
                <div className="text-center">
                  <div className={`mx-auto w-8 h-8 flex items-center justify-center border-2 border-black font-black text-xs ${
                    applicant.status === RegistrationStatus.PENDING
                      ? "bg-amber-400 text-black animate-pulse"
                      : applicant.status === RegistrationStatus.REJECTED
                      ? "bg-red-500 text-white"
                      : "bg-black text-white"
                  }`}>
                    {applicant.status === RegistrationStatus.PENDING ? "••" : applicant.status === RegistrationStatus.REJECTED ? "✗" : "✓"}
                  </div>
                  <p className="text-[10px] font-black uppercase text-black mt-1.5">Seleksi Berkas</p>
                  <p className="text-[9px] font-bold text-neutral-500 uppercase mt-0.5">
                    {applicant.status === RegistrationStatus.PENDING 
                      ? "Proses" 
                      : applicant.status === RegistrationStatus.REJECTED 
                      ? "Gagal" 
                      : "Selesai"}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="text-center">
                  <div className={`mx-auto w-8 h-8 flex items-center justify-center border-2 border-black font-black text-xs ${
                    applicant.status === RegistrationStatus.ACCEPTED
                      ? "bg-green-500 text-white"
                      : applicant.status === RegistrationStatus.FAILED
                      ? "bg-neutral-600 text-white"
                      : "bg-white text-neutral-300 border-neutral-300"
                  }`}>
                    {applicant.status === RegistrationStatus.ACCEPTED ? "✓" : applicant.status === RegistrationStatus.FAILED ? "✗" : "-"}
                  </div>
                  <p className="text-[10px] font-black uppercase text-black mt-1.5">Kelulusan Akhir</p>
                  <p className="text-[9px] font-bold text-neutral-500 uppercase mt-0.5">
                    {applicant.status === RegistrationStatus.ACCEPTED 
                      ? "LULUS" 
                      : applicant.status === RegistrationStatus.FAILED 
                      ? "TIDAK LULUS" 
                      : "Terkunci"}
                  </p>
                </div>
                
              </div>
            </div>
          </div>

          {/* CELEBRATORY CERTIFICATE FOR ACCEPTED APPLICANT */}
          {applicant.status === RegistrationStatus.ACCEPTED && (
            <div className="bg-white border-8 border-double border-black p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)] text-center relative max-w-2xl mx-auto print:shadow-none print:border-4 print:my-0">
              
              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-black"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-black"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-black"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-black"></div>

              {/* Logo / Header */}
              <div className="flex justify-center mb-3">
                <div className="bg-black text-amber-400 p-2 border border-black">
                  <GraduationCap size={32} />
                </div>
              </div>

              <h1 className="font-black text-2xl text-black uppercase tracking-widest leading-none">
                SURAT KEPUTUSAN KELULUSAN
              </h1>
              <p className="text-[10px] font-black text-black tracking-widest uppercase mt-1">
                NOMOR : SK-PPDB/SMAN1/2026/{applicant.id.split("-").pop()}
              </p>

              <div className="w-48 h-1 bg-black mx-auto my-4"></div>

              <p className="text-xs font-semibold text-neutral-700 max-w-md mx-auto leading-relaxed uppercase">
                Berdasarkan keputusan rapat koordinasi panitia penerimaan peserta didik baru (PPDB) Sekolah Menengah Atas Negeri 1 tahun ajaran 2026/2027, menyatakan bahwa:
              </p>

              {/* Student Details in Certificate */}
              <div className="my-6 max-w-md mx-auto bg-neutral-50 border-3 border-black p-4 text-left font-sans">
                <table className="w-full text-xs font-bold text-black border-collapse">
                  <tbody>
                    <tr className="border-b border-neutral-200">
                      <td className="py-2 w-32 uppercase text-[10px]">Nama Calon Siswa</td>
                      <td className="py-2 text-md font-black uppercase text-black">: {applicant.fullName}</td>
                    </tr>
                    <tr className="border-b border-neutral-200">
                      <td className="py-2 uppercase text-[10px]">NISN / Nomor ID</td>
                      <td className="py-2 font-mono">: {applicant.nisn} / {applicant.id}</td>
                    </tr>
                    <tr className="border-b border-neutral-200">
                      <td className="py-2 uppercase text-[10px]">Sekolah Asal</td>
                      <td className="py-2 uppercase">: {applicant.previousSchool}</td>
                    </tr>
                    <tr>
                      <td className="py-2 uppercase text-[10px]">Jurusan Pilihan</td>
                      <td className="py-2">
                        <span className="bg-black text-white px-2 py-0.5 uppercase text-[10px] font-black border border-black">
                          {applicant.majorPreference}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs font-black text-green-800 uppercase tracking-wide leading-tight max-w-sm mx-auto mb-6">
                DINYATAKAN LULUS SELEKSI PPDB UTAMA & DITERIMA SEBAGAI SISWA BARU SMAN 1
              </p>

              {/* Signatures */}
              <div className="flex justify-between items-end mt-8 text-left font-sans max-w-md mx-auto">
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase">Tgl Kelulusan</p>
                  <p className="text-xs font-black text-black uppercase">26 Juni 2026</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase">Kepala Sekolah SMAN 1</p>
                  <p className="font-serif italic text-sm font-black text-black underline mt-4">Drs. H. Mulyadi, M.Pd.</p>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase">NIP. 197412102003121004</p>
                </div>
              </div>

              {/* Action for printing */}
              <div className="mt-8 pt-4 border-t border-black/15 flex justify-center gap-3 print:hidden">
                <button
                  onClick={handlePrint}
                  className="bg-black text-amber-400 hover:bg-neutral-800 font-black uppercase tracking-wider text-xs px-5 py-2.5 border-2 border-black shadow-[3px_3px_0_0_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Printer size={14} /> Cetak Kelulusan (PDF)
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Searched & Not Found Alert */}
      {searched && !applicant && errorMsg && (
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] text-center">
          <div className="w-16 h-16 bg-red-100 border-3 border-black text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} strokeWidth={2.5} />
          </div>
          <h3 className="font-black text-lg text-black uppercase leading-none mb-2">PENCARIAN TIDAK DITEMUKAN</h3>
          <p className="text-xs font-bold text-neutral-600 max-w-md mx-auto uppercase">
            Data calon siswa dengan kata kunci <span className="text-red-600 font-black">"{searchKey}"</span> tidak terdaftar dalam sistem penerimaan PPDB. Pastikan format nomor registrasi benar.
          </p>
        </div>
      )}
    </div>
  );
}
