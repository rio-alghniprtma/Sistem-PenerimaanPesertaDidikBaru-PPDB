import React, { useState, useEffect } from "react";
import { 
  Send, Server, ShieldCheck, HelpCircle, RefreshCw, 
  Settings2, Smartphone, Save, AlertCircle, MessageSquareCode,
  FileCheck2, CheckCheck, Play 
} from "lucide-react";
import { WhatsAppGatewayConfig, WhatsAppNotificationLog, RegistrationStatus } from "../types.js";

export default function WhatsAppConfig() {
  const [config, setConfig] = useState<WhatsAppGatewayConfig | null>(null);
  const [logs, setLogs] = useState<WhatsAppNotificationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);

  // Mobile phone simulator active chat view state
  const [selectedLog, setSelectedLog] = useState<WhatsAppNotificationLog | null>(null);

  // Fetch configs and logs
  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/whatsapp/config");
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("/api/whatsapp/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
        if (data.length > 0 && !selectedLog) {
          setSelectedLog(data[0]); // Default to first log in simulator
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchLogs();
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setSaving(true);
    try {
      const res = await fetch("/api/whatsapp/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        alert("Konfigurasi WhatsApp Gateway & Template pesan berhasil diperbarui!");
      } else {
        alert("Gagal menyimpan konfigurasi.");
      }
    } catch (err) {
      console.error(err);
      alert("Koneksi gagal.");
    } finally {
      setSaving(false);
    }
  };

  // Update specific template message
  const handleTemplateChange = (status: string, message: string) => {
    if (!config) return;
    const updatedTemplates = config.templates.map(t => {
      if (t.status === status) {
        return { ...t, message };
      }
      return t;
    });
    setConfig({ ...config, templates: updatedTemplates });
  };

  // Helper to format WhatsApp markdown (*bold*, _italic_, ~strike~) into HTML for phone simulator
  const formatWhatsAppMarkdown = (text: string) => {
    if (!text) return "";
    let formatted = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Replace *bold* with <strong>
    formatted = formatted.replace(/\*([^*]+)\*/g, "<strong>$1</strong>");
    // Replace _italic_ with <em>
    formatted = formatted.replace(/_([^_]+)_/g, "<em>$1</em>");
    // Replace ~strike~ with <del>
    formatted = formatted.replace(/~([^~]+)~/g, "<del>$1</del>");
    // Support line breaks
    formatted = formatted.replace(/\n/g, "<br />");

    return formatted;
  };

  if (!config) {
    return (
      <div className="h-64 flex items-center justify-center">
        <RefreshCw className="animate-spin text-black" size={32} />
      </div>
    );
  }

  return (
    <div id="whatsapp-tab-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. GATEWAY CONFIGURATION & TEMPLATES (SPAN 2) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Gateway Connection Details */}
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <h3 className="font-black text-sm uppercase text-black tracking-widest border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
            <Server size={16} /> KONFIGURASI WHATSAPP API GATEWAY
          </h3>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Provider WhatsApp Gateway *
                </label>
                <select
                  value={config.provider}
                  onChange={(e) => setConfig({ ...config, provider: e.target.value as any })}
                  className="w-full bg-white border-2 border-black p-2 text-xs font-black text-black focus:outline-none"
                >
                  <option value="simulation">Simulasi Lokal (Tanpa API Key)</option>
                  <option value="fonnte">Fonnte API (Saran Indonesia)</option>
                  <option value="wablas">Wablas API Gateway</option>
                  <option value="twilio">Twilio WhatsApp API</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Nomor Pengirim (Sender Number)
                </label>
                <input
                  type="text"
                  value={config.senderNumber}
                  onChange={(e) => setConfig({ ...config, senderNumber: e.target.value })}
                  placeholder="Contoh: 081199887766"
                  className="w-full bg-white border-2 border-black p-2 text-xs font-bold text-black focus:outline-none"
                />
              </div>

              {config.provider !== "simulation" && (
                <>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                      API Gateway Endpoint URL
                    </label>
                    <input
                      type="text"
                      value={config.apiUrl}
                      onChange={(e) => setConfig({ ...config, apiUrl: e.target.value })}
                      placeholder="Contoh: https://api.fonnte.com/send"
                      className="w-full bg-white border-2 border-black p-2 text-xs font-bold text-black focus:outline-none"
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                      API Authentication Token / Key
                    </label>
                    <input
                      type="password"
                      value={config.token}
                      onChange={(e) => setConfig({ ...config, token: e.target.value })}
                      placeholder="Token autentikasi dari dashboard provider..."
                      className="w-full bg-white border-2 border-black p-2 text-xs font-bold text-black focus:outline-none"
                    />
                    <span className="text-[10px] font-bold text-neutral-500 mt-1 block uppercase">
                      * Token ini aman karena disembunyikan di server-side dan tidak terkirim ke browser client.
                    </span>
                  </div>
                </>
              )}

            </div>

            {config.provider === "simulation" && (
              <div className="bg-green-50 border-2 border-green-500 p-3.5 text-xs text-green-900 font-bold flex items-start gap-2">
                <ShieldCheck className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="uppercase font-black text-[10px]">MODE SIMULASI AKTIF</p>
                  <p className="mt-0.5">Sistem akan mensimulasikan pengiriman notifikasi instan secara offline. Anda dapat menguji seluruh alur PPDB, mengubah status, dan melihat log pengiriman WhatsApp secara langsung di simulator hp sebelah kanan.</p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-neutral-200">
              <button
                type="submit"
                disabled={saving}
                className="bg-black text-amber-400 hover:bg-neutral-800 font-black uppercase text-xs tracking-wider px-5 py-2.5 border-2 border-black flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save size={14} /> {saving ? "Menyimpan..." : "Simpan Gateway"}
              </button>
            </div>
          </form>
        </div>

        {/* Templates message configurations */}
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <h3 className="font-black text-sm uppercase text-black tracking-widest border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
            <MessageSquareCode size={16} /> EDIT TEMPLATE NOTIFIKASI OTOMATIS
          </h3>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-6">
            Gunakan variabel tag dinamis untuk mengganti data otomatis: <code className="bg-neutral-100 text-black border border-black px-1 py-0.5 font-mono text-[9px] select-all">{"{{nama}}"}</code>, <code className="bg-neutral-100 text-black border border-black px-1 py-0.5 font-mono text-[9px] select-all">{"{{no_reg}}"}</code>, <code className="bg-neutral-100 text-black border border-black px-1 py-0.5 font-mono text-[9px] select-all">{"{{nisn}}"}</code>, <code className="bg-neutral-100 text-black border border-black px-1 py-0.5 font-mono text-[9px] select-all">{"{{catatan}}"}</code>, <code className="bg-neutral-100 text-black border border-black px-1 py-0.5 font-mono text-[9px] select-all">{"{{status}}"}</code>.
          </p>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            
            {config.templates.map((tpl) => (
              <div key={tpl.status} className="border-2 border-black p-3.5 bg-neutral-50">
                <div className="flex justify-between items-center mb-2">
                  <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase border border-black ${
                    tpl.status === "PENDAFTARAN" ? "bg-black text-white" :
                    tpl.status === RegistrationStatus.PENDING ? "bg-amber-400 text-black" :
                    tpl.status === RegistrationStatus.VERIFIED ? "bg-blue-500 text-white" :
                    tpl.status === RegistrationStatus.ACCEPTED ? "bg-green-500 text-white" :
                    tpl.status === RegistrationStatus.REJECTED ? "bg-red-500 text-white" : "bg-neutral-600 text-white"
                  }`}>
                    {tpl.status === "PENDAFTARAN" ? "BARU DAFTAR (SUCCESS)" : `STATUS: ${tpl.status}`}
                  </span>
                  <span className="text-[9px] font-bold text-neutral-400 uppercase">Notifikasi WhatsApp</span>
                </div>
                
                <textarea
                  rows={3}
                  value={tpl.message}
                  onChange={(e) => handleTemplateChange(tpl.status, e.target.value)}
                  className="w-full bg-white border border-black p-2 font-mono text-xs text-black focus:outline-none"
                ></textarea>
              </div>
            ))}

            <div className="flex justify-end pt-2 border-t border-neutral-200">
              <button
                type="submit"
                disabled={saving}
                className="bg-black text-amber-400 hover:bg-neutral-800 font-black uppercase text-xs tracking-wider px-5 py-2.5 border-2 border-black flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save size={14} /> {saving ? "Menyimpan..." : "Simpan Semua Template"}
              </button>
            </div>
          </form>
        </div>

        {/* LOGS LISTING */}
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-4">
            <h3 className="font-black text-sm uppercase text-black tracking-widest flex items-center gap-2">
              <FileCheck2 size={16} /> LOG HISTORI PENGIRIMAN NOTIFIKASI
            </h3>
            <button
              onClick={fetchLogs}
              disabled={logsLoading}
              className="p-1 border border-black hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Refresh Logs"
            >
              <RefreshCw size={12} className={logsLoading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div 
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-3 border-2 border-black cursor-pointer transition-colors text-left flex justify-between items-start gap-4 ${
                    selectedLog?.id === log.id ? "bg-amber-100/50 border-amber-500" : "bg-neutral-50 hover:bg-neutral-100"
                  }`}
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-[10px] text-black uppercase leading-none">{log.applicantName}</span>
                      <span className="text-[9px] font-mono text-neutral-400 font-bold">({log.applicantId})</span>
                    </div>
                    <p className="text-[10px] text-neutral-600 truncate uppercase font-bold">Ke: {log.recipientPhone} • Status: {log.status}</p>
                    <p className="text-[10px] font-mono text-neutral-500 italic truncate font-semibold">"{log.message}"</p>
                  </div>

                  <div className="flex flex-col items-end flex-shrink-0 gap-1.5">
                    <span className="text-[9px] font-bold text-neutral-400 font-sans uppercase">
                      {new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase border ${
                      log.deliveryStatus === "delivered" ? "bg-green-500 text-white border-green-500" :
                      log.deliveryStatus === "failed" ? "bg-red-500 text-white border-red-500" : "bg-amber-400 text-black border-black"
                    }`}>
                      {log.deliveryStatus === "delivered" ? "Delivered" : log.deliveryStatus === "failed" ? "Failed" : "Sent"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs font-bold text-neutral-500 text-center uppercase p-6">
                Belum ada log pengiriman WhatsApp dalam sistem.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* 2. LIVE WHATSAPP PHONE SIMULATOR (SPAN 1) */}
      <div className="space-y-4">
        <h3 className="font-black text-xs uppercase text-neutral-500 tracking-widest text-center flex items-center justify-center gap-1">
          <Smartphone size={14} /> LIVE MOBILE SIMULATOR
        </h3>

        {/* Device frame wrapper */}
        <div className="mx-auto w-full max-w-[320px] bg-neutral-900 border-[8px] border-black rounded-[40px] overflow-hidden shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative aspect-[9/18]">
          {/* Ear Speaker */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 h-4 w-20 bg-black rounded-b-xl z-20 flex justify-center items-center">
            <div className="h-1 w-8 bg-neutral-800 rounded-full"></div>
          </div>

          {/* Internal Screen Area */}
          <div className="h-full bg-[#efeae2] flex flex-col pt-6 font-sans relative">
            
            {/* Phone WhatsApp Header */}
            <div className="bg-[#005e54] text-white p-3.5 pt-4 pb-2.5 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neutral-300 border border-white flex items-center justify-center font-black text-xs text-[#005e54] uppercase select-none">
                  PP
                </div>
                <div>
                  <h4 className="font-bold text-xs leading-none">Panitia PPDB SMAN 1</h4>
                  <p className="text-[8px] font-semibold text-green-200 mt-0.5 uppercase tracking-wider">Online • Official Gateway</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 opacity-90">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
              </div>
            </div>

            {/* Chat message area */}
            <div className="flex-grow p-3.5 space-y-4 overflow-y-auto flex flex-col justify-end bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-contain">
              
              {selectedLog ? (
                <>
                  {/* System Date Indicator */}
                  <div className="mx-auto bg-[#d4f2fe] text-[#004e75] text-[9px] font-black py-0.5 px-3 border border-[#b2dff4] shadow-sm uppercase tracking-wide leading-none">
                    {new Date(selectedLog.sentAt).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>

                  {/* WhatsApp Message Bubble */}
                  <div className="bg-white text-black p-3 border border-neutral-300 rounded-lg max-w-[85%] self-start relative shadow-sm text-xs font-sans">
                    {/* Small triangle left */}
                    <div className="absolute left-[-6px] top-3 w-0 h-0 border-t-[6px] border-t-white border-l-[6px] border-l-transparent"></div>
                    
                    {/* Rendered HTML with custom WhatsApp markdown support */}
                    <div 
                      className="whatsapp-message-bubble leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatWhatsAppMarkdown(selectedLog.message) }}
                    ></div>
                    
                    {/* Time indicator inside bubble */}
                    <div className="flex justify-end items-center gap-1 mt-1 text-[8px] font-bold text-neutral-400 uppercase">
                      <span>{new Date(selectedLog.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <CheckCheck size={10} className="text-blue-500 stroke-[3]" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-center p-4">
                  <p className="text-[10px] font-black text-neutral-400 uppercase leading-normal">
                    Pilih salah satu log histori pendaftaran di sebelah kiri untuk melihat visualisasi pesan WhatsApp.
                  </p>
                </div>
              )}

            </div>

            {/* WhatsApp Type Bar Simulator */}
            <div className="bg-[#f0f0f0] p-2 flex items-center gap-2 border-t border-neutral-300">
              <div className="bg-white rounded-full flex-grow p-1.5 px-3.5 text-[10px] text-neutral-400 border border-neutral-300 truncate select-none">
                Ketik pesan verifikasi...
              </div>
              <div className="w-8 h-8 rounded-full bg-[#00897b] text-white flex items-center justify-center flex-shrink-0 cursor-not-allowed">
                <Send size={12} />
              </div>
            </div>

          </div>
        </div>

        {/* Instruction Tips */}
        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-xs">
          <p className="font-black uppercase text-black mb-1 flex items-center gap-1">
            <CheckCheck size={12} className="text-green-600" /> TANDA MARKDOWN WHATSAPP
          </p>
          <ul className="text-[10px] font-bold text-neutral-600 space-y-1 mt-1.5 list-disc list-inside uppercase">
            <li>Gunakan tanda bintang <code className="bg-neutral-100 px-1 py-0.5 border border-black font-mono font-black text-black">*teks*</code> untuk huruf <strong>tebal (bold)</strong>.</li>
            <li>Gunakan garis bawah <code className="bg-neutral-100 px-1 py-0.5 border border-black font-mono font-black text-black">_teks_</code> untuk huruf <em>miring (italic)</em>.</li>
            <li>Gunakan gelombang <code className="bg-neutral-100 px-1 py-0.5 border border-black font-mono font-black text-black">~teks~</code> untuk mencoret kata.</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
