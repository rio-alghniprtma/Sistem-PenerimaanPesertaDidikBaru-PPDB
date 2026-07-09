import React, { useState, useRef } from "react";
import { Upload, CheckCircle2, AlertTriangle, FileText, User, Hash, School, Mail, Phone, Users, ShieldCheck, ArrowRight, Loader } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { customFetch } from "../lib/apiInterceptor.js";

interface DocumentUpload {
  name: "Ijazah" | "Kartu Keluarga" | "Akta Kelahiran";
  file: File | null;
  fileName: string;
  fileSize: number;
}

interface RegistrationFormProps {
  onSuccess: (newApplicant: any) => void;
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  // Form values state
  const [nisn, setNisn] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"Laki-laki" | "Perempuan" | "">("");
  const [previousSchool, setPreviousSchool] = useState("");
  const [parentName, setParentName] = useState("");
  const [majorPreference, setMajorPreference] = useState<"IPA" | "IPS" | "Bahasa" | "Kejuruan" | "">("");

  // Document uploads state
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { name: "Ijazah", file: null, fileName: "", fileSize: 0 },
    { name: "Kartu Keluarga", file: null, fileName: "", fileSize: 0 },
    { name: "Akta Kelahiran", file: null, fileName: "", fileSize: 0 }
  ]);

  // UI state
  const [step, setStep] = useState(1); // 1: Personal info, 2: Documents upload, 3: Success
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActiveDoc, setDragActiveDoc] = useState<string | null>(null);
  const [registeredApplicant, setRegisteredApplicant] = useState<any>(null);

  const fileInputRefs = {
    Ijazah: useRef<HTMLInputElement>(null),
    "Kartu Keluarga": useRef<HTMLInputElement>(null),
    "Akta Kelahiran": useRef<HTMLInputElement>(null)
  };

  // Validations
  const validateStep1 = () => {
    if (!nisn || nisn.length < 10 || !/^\d+$/.test(nisn)) {
      setErrorMsg("NISN harus terdiri dari 10 digit angka saja.");
      return false;
    }
    if (!fullName || fullName.trim().length < 3) {
      setErrorMsg("Nama Lengkap harus diisi minimal 3 karakter.");
      return false;
    }
    if (!phone || phone.length < 10 || !/^\d+$/.test(phone)) {
      setErrorMsg("Nomor HP/WhatsApp aktif harus diisi minimal 10 digit angka.");
      return false;
    }
    if (!gender) {
      setErrorMsg("Pilih jenis kelamin Anda.");
      return false;
    }
    if (!previousSchool || previousSchool.trim().length < 3) {
      setErrorMsg("Sekolah Asal wajib diisi dengan benar.");
      return false;
    }
    if (!parentName || parentName.trim().length < 3) {
      setErrorMsg("Nama Orang Tua / Wali wajib diisi.");
      return false;
    }
    if (!majorPreference) {
      setErrorMsg("Pilih Peminatan / Jurusan pilihan Anda.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    }
  };

  const handlePrev = () => {
    setStep(1);
    setErrorMsg("");
  };

  // File Upload Handlers
  const handleFileChange = (docName: "Ijazah" | "Kartu Keluarga" | "Akta Kelahiran", file: File | null) => {
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(`File ${docName} melebihi batas maksimum 5MB.`);
      return;
    }

    // Validate type (PDF or images)
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg(`Format file ${docName} tidak valid. Gunakan PDF, JPG, atau PNG.`);
      return;
    }

    setDocuments(prev => prev.map(doc => {
      if (doc.name === docName) {
        return {
          ...doc,
          file: file,
          fileName: file.name,
          fileSize: file.size
        };
      }
      return doc;
    }));
    setErrorMsg("");
  };

  // Drag-and-Drop Handlers
  const handleDrag = (e: React.DragEvent, docName: string, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (active) {
      setDragActiveDoc(docName);
    } else {
      setDragActiveDoc(null);
    }
  };

  const handleDrop = (e: React.DragEvent, docName: "Ijazah" | "Kartu Keluarga" | "Akta Kelahiran") => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveDoc(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(docName, e.dataTransfer.files[0]);
    }
  };

  const removeFile = (docName: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.name === docName) {
        return { ...doc, file: null, fileName: "", fileSize: 0 };
      }
      return doc;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Check if files uploaded
    const missingDocs = documents.filter(doc => !doc.file);
    if (missingDocs.length > 0) {
      setErrorMsg(`Silakan unggah semua dokumen wajib (${missingDocs.map(d => d.name).join(", ")}).`);
      return;
    }

    setIsSubmitting(true);

    // Prepare virtual documents info to save
    const virtualDocs = documents.map((doc, idx) => ({
      id: `doc-u${idx + 10}`,
      name: doc.name,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      uploadedAt: new Date().toISOString(),
      status: "pending" as const
    }));

    const payload = {
      nisn,
      fullName,
      email,
      phone,
      gender,
      previousSchool,
      parentName,
      majorPreference,
      documents: virtualDocs
    };

    try {
      const res = await customFetch("/api/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        setRegisteredApplicant(data.applicant);
        setStep(3);
        if (onSuccess) {
          onSuccess(data.applicant);
        }
      } else {
        setErrorMsg(data.message || "Gagal melakukan pendaftaran.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Koneksi ke server gagal. Pastikan server aktif.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div id="ppdb-form-container" className="max-w-3xl mx-auto my-8 px-4">
      {/* Progress Bar / Steps Header */}
      <div className="mb-8 flex justify-between items-center bg-black text-white p-4 border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <span className={`w-8 h-8 flex items-center justify-center font-black border-2 border-white rounded-none ${step >= 1 ? "bg-amber-400 text-black border-black" : "bg-black text-white"}`}>1</span>
          <span className="font-black text-xs sm:text-sm uppercase tracking-wider hidden xs:inline">Biodata Siswa</span>
        </div>
        <div className="flex-grow h-1 bg-neutral-700 mx-4">
          <div className={`h-full bg-amber-400 transition-all duration-300 ${step === 2 ? "w-full" : step === 3 ? "w-full" : "w-0"}`}></div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`w-8 h-8 flex items-center justify-center font-black border-2 border-white rounded-none ${step >= 2 ? "bg-amber-400 text-black border-black" : "bg-black text-white"}`}>2</span>
          <span className="font-black text-xs sm:text-sm uppercase tracking-wider hidden xs:inline">Seleksi Berkas</span>
        </div>
        <div className="flex-grow h-1 bg-neutral-700 mx-4">
          <div className={`h-full bg-amber-400 transition-all duration-300 ${step === 3 ? "w-full" : "w-0"}`}></div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`w-8 h-8 flex items-center justify-center font-black border-2 border-white rounded-none ${step === 3 ? "bg-amber-400 text-black border-black" : "bg-black text-white"}`}>3</span>
          <span className="font-black text-xs sm:text-sm uppercase tracking-wider hidden xs:inline">Konfirmasi</span>
        </div>
      </div>

      {/* Error Message Box */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-100 text-red-900 border-4 border-red-500 font-bold flex items-center gap-3 shadow-[4px_4px_0_0_rgba(239,68,68,0.2)]">
          <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Personal Info & Biodata */}
      {step === 1 && (
        <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase text-black mb-6 tracking-tight border-b-4 border-black pb-3">
            BIODATA & DATA AKADEMIK CALON SISWA
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NISN */}
            <div>
              <label className="block text-sm font-black uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
                <Hash size={16} /> NISN (Nomor Induk Siswa Nasional) *
              </label>
              <input
                type="text"
                maxLength={10}
                value={nisn}
                onChange={(e) => setNisn(e.target.value.replace(/\D/g, ""))}
                placeholder="Contoh: 0087654321"
                className="w-full bg-white border-3 border-black p-3 font-bold text-black focus:bg-amber-50 focus:outline-none transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-black uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
                <User size={16} /> Nama Lengkap Sesuai Ijazah *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Siti Aminah"
                className="w-full bg-white border-3 border-black p-3 font-bold text-black focus:bg-amber-50 focus:outline-none transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
              />
            </div>

            {/* Phone Number (WhatsApp) */}
            <div>
              <label className="block text-sm font-black uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
                <Phone size={16} /> No. HP / WhatsApp Aktif *
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="Contoh: 08123456789"
                className="w-full bg-white border-3 border-black p-3 font-bold text-black focus:bg-amber-50 focus:outline-none transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
              />
              <span className="text-xs font-bold text-neutral-600 mt-1 block">
                * Digunakan untuk pengiriman notifikasi otomatis progres status PPDB.
              </span>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-black uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
                <Mail size={16} /> Alamat Email Aktif
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contoh: siswabaru@gmail.com"
                className="w-full bg-white border-3 border-black p-3 font-bold text-black focus:bg-amber-50 focus:outline-none transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-black uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
                <Users size={16} /> Jenis Kelamin *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setGender("Laki-laki")}
                  className={`p-3 border-3 font-black text-center cursor-pointer uppercase transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${
                    gender === "Laki-laki"
                      ? "bg-black text-amber-400 border-black"
                      : "bg-white text-black border-black hover:bg-neutral-50"
                  }`}
                >
                  Laki-laki
                </button>
                <button
                  type="button"
                  onClick={() => setGender("Perempuan")}
                  className={`p-3 border-3 font-black text-center cursor-pointer uppercase transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${
                    gender === "Perempuan"
                      ? "bg-black text-amber-400 border-black"
                      : "bg-white text-black border-black hover:bg-neutral-50"
                  }`}
                >
                  Perempuan
                </button>
              </div>
            </div>

            {/* Major Preference */}
            <div>
              <label className="block text-sm font-black uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
                <ShieldCheck size={16} /> Pilihan Jurusan / Peminatan *
              </label>
              <select
                value={majorPreference}
                onChange={(e) => setMajorPreference(e.target.value as any)}
                className="w-full bg-white border-3 border-black p-3 font-bold text-black focus:bg-amber-50 focus:outline-none transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
              >
                <option value="">-- Pilih Jurusan --</option>
                <option value="IPA">MIPA (Matematika & Ilmu Pengetahuan Alam)</option>
                <option value="IPS">IPS (Ilmu Pengetahuan Sosial)</option>
                <option value="Bahasa">IBB (Ilmu Bahasa & Budaya)</option>
                <option value="Kejuruan">Kejuruan / Teknik Grafika</option>
              </select>
            </div>

            {/* Previous School */}
            <div>
              <label className="block text-sm font-black uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
                <School size={16} /> Sekolah Asal (SMP / MTs) *
              </label>
              <input
                type="text"
                value={previousSchool}
                onChange={(e) => setPreviousSchool(e.target.value)}
                placeholder="Contoh: SMP Negeri 1 Jakarta"
                className="w-full bg-white border-3 border-black p-3 font-bold text-black focus:bg-amber-50 focus:outline-none transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
              />
            </div>

            {/* Parent's Name */}
            <div>
              <label className="block text-sm font-black uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
                <User size={16} /> Nama Lengkap Orang Tua / Wali *
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Contoh: Joko Susanto"
                className="w-full bg-white border-3 border-black p-3 font-bold text-black focus:bg-amber-50 focus:outline-none transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-4 border-t-4 border-black flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="bg-black text-amber-400 hover:bg-neutral-800 font-black uppercase tracking-wider px-6 py-3.5 border-3 border-black shadow-[4px_4px_0_0_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer flex items-center gap-2"
            >
              Lanjutkan Ke Unggah Berkas
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Document Uploads */}
      {step === 2 && (
        <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] animate-fade-in">
          <h2 className="text-2xl font-black uppercase text-black mb-3 tracking-tight border-b-4 border-black pb-3">
            PERSYARATAN SELEKSI BERKAS ADMINISTRASI
          </h2>
          <p className="text-sm font-bold text-neutral-600 mb-6 uppercase">
            Unggah dokumen fisik asli berupa scan / foto berwarna yang jelas (Format PDF, PNG, atau JPG. Maksimal 5MB per dokumen):
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {documents.map((doc) => {
              const fileInputId = `file-input-${doc.name}`;
              const isDragActive = dragActiveDoc === doc.name;
              return (
                <div 
                  key={doc.name}
                  className="border-3 border-black p-4 bg-neutral-50 shadow-[3px_3px_0_0_rgba(0,0,0,1)]"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-black text-white p-2 border border-black flex-shrink-0">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-md text-black uppercase leading-tight">
                          Dokumen {doc.name} *
                        </h3>
                        <p className="text-xs font-bold text-neutral-500 uppercase mt-0.5">
                          {doc.name === "Ijazah" 
                            ? "Scan Surat Keterangan Lulus (SKL) / Ijazah SMP Asli" 
                            : doc.name === "Kartu Keluarga" 
                            ? "Scan Kartu Keluarga Asli (Barcode Aktif)" 
                            : "Scan Akta Kelahiran Resmi dari Catpil"}
                        </p>
                      </div>
                    </div>

                    {/* File info or upload box */}
                    <div className="w-full md:w-80">
                      {doc.file ? (
                        <div className="bg-amber-100 border-2 border-black p-3 flex items-center justify-between gap-2">
                          <div className="overflow-hidden">
                            <p className="font-black text-xs text-black truncate">{doc.fileName}</p>
                            <p className="text-[10px] font-bold text-neutral-600">{formatSize(doc.fileSize)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(doc.name)}
                            className="bg-black text-white hover:bg-red-500 font-bold text-xs p-1.5 border border-black transition-colors uppercase flex-shrink-0 cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <div
                          onDragOver={(e) => handleDrag(e, doc.name, true)}
                          onDragLeave={(e) => handleDrag(e, doc.name, false)}
                          onDrop={(e) => handleDrop(e, doc.name)}
                          onClick={() => fileInputRefs[doc.name].current?.click()}
                          className={`border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
                            isDragActive 
                              ? "border-amber-500 bg-amber-50 scale-[0.98]" 
                              : "border-neutral-400 hover:border-black hover:bg-amber-50/30"
                          }`}
                        >
                          <input
                            type="file"
                            id={fileInputId}
                            ref={fileInputRefs[doc.name]}
                            onChange={(e) => handleFileChange(doc.name, e.target.files?.[0] || null)}
                            className="hidden"
                            accept=".pdf, .jpg, .jpeg, .png"
                          />
                          <Upload size={20} className="mx-auto text-neutral-500 mb-1" />
                          <p className="text-xs font-black uppercase text-black leading-none">Seret File / Klik Unggah</p>
                          <p className="text-[9px] font-bold text-neutral-400 uppercase mt-1">PDF, PNG, JPG maks 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t-4 border-black flex justify-between gap-4">
              <button
                type="button"
                onClick={handlePrev}
                disabled={isSubmitting}
                className="bg-white hover:bg-neutral-50 text-black font-black uppercase tracking-wider px-6 py-3 border-3 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-50"
              >
                Sebelumnya
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-amber-400 hover:bg-neutral-800 font-black uppercase tracking-wider px-8 py-3.5 border-3 border-black shadow-[4px_4px_0_0_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Memproses...
                  </>
                ) : (
                  <>
                    Kirim Form Pendaftaran
                    <CheckCircle2 size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: Success Screen */}
      {step === 3 && registeredApplicant && (
        <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] animate-fade-in text-center">
          <div className="w-20 h-20 bg-green-500 border-4 border-black text-white flex items-center justify-center mx-auto mb-6 shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
            <CheckCircle2 size={44} strokeWidth={2.5} />
          </div>

          <h2 className="text-3xl font-black uppercase text-black mb-2 tracking-tight">
            PENDAFTARAN BERHASIL DISIMPAN!
          </h2>
          <p className="font-bold text-neutral-600 uppercase text-xs tracking-wider mb-6">
            Selamat, berkas Anda sukses didaftarkan dalam sistem PPDB Sekolah Menengah
          </p>

          {/* Registration Card Representation */}
          <div className="max-w-md mx-auto bg-amber-400 border-4 border-black p-5 text-left mb-8 shadow-[6px_6px_0_0_rgba(0,0,0,1)] relative overflow-hidden">
            {/* Stamp decoration */}
            <div className="absolute right-[-20px] top-[-20px] bg-black text-white py-1.5 px-10 text-[10px] font-black uppercase tracking-widest rotate-45 border-b border-white">
              PPDB 2026
            </div>

            <div className="border-b-2 border-black pb-3 mb-4">
              <h3 className="font-black text-sm text-black uppercase tracking-wider">KARTU REGISTRASI PENDAFTARAN</h3>
              <p className="text-[10px] font-bold text-black uppercase tracking-widest mt-0.5">SEKOLAH MENENGAH ATAS NEGERI 1</p>
            </div>

            <div className="space-y-2 text-sm text-black">
              <div className="flex">
                <span className="w-28 font-black uppercase text-xs">NO. REGISTRASI</span>
                <span className="font-black text-md text-white bg-black px-2 py-0.5 border border-black select-all">
                  {registeredApplicant.id}
                </span>
              </div>
              <div className="flex">
                <span className="w-28 font-black uppercase text-xs">NISN SISWA</span>
                <span className="font-bold">{registeredApplicant.nisn}</span>
              </div>
              <div className="flex">
                <span className="w-28 font-black uppercase text-xs">NAMA LENGKAP</span>
                <span className="font-black uppercase">{registeredApplicant.fullName}</span>
              </div>
              <div className="flex">
                <span className="w-28 font-black uppercase text-xs">PEMINATAN</span>
                <span className="font-black text-xs bg-white text-black border border-black px-1.5 py-0.5 uppercase leading-none">
                  {registeredApplicant.majorPreference}
                </span>
              </div>
              <div className="flex">
                <span className="w-28 font-black uppercase text-xs">SEKOLAH ASAL</span>
                <span className="font-bold">{registeredApplicant.previousSchool}</span>
              </div>
            </div>
          </div>

          {/* Automatic Notification Notice */}
          <div className="max-w-lg mx-auto bg-green-50 border-3 border-green-500 p-4 text-left rounded-none mb-8 flex items-start gap-3">
            <div className="bg-green-500 text-white p-1.5 border border-black flex-shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-green-900 leading-none mb-1">
                NOTIFIKASI WHATSAPP OTOMATIS DIKIRIM!
              </p>
              <p className="text-xs font-bold text-green-800">
                Sistem kami telah mengirimkan pesan verifikasi WhatsApp otomatis ke nomor <span className="font-black">{registeredApplicant.phone}</span>. Silakan periksa kotak masuk WhatsApp Anda.
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                // reset form and register another
                setNisn("");
                setFullName("");
                setEmail("");
                setPhone("");
                setGender("");
                setPreviousSchool("");
                setParentName("");
                setMajorPreference("");
                setDocuments([
                  { name: "Ijazah", file: null, fileName: "", fileSize: 0 },
                  { name: "Kartu Keluarga", file: null, fileName: "", fileSize: 0 },
                  { name: "Akta Kelahiran", file: null, fileName: "", fileSize: 0 }
                ]);
                setStep(1);
                setRegisteredApplicant(null);
              }}
              className="bg-white hover:bg-neutral-50 text-black font-black uppercase tracking-wider px-6 py-3 border-3 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              Daftar Siswa Lain
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
