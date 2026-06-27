import React from "react";
import { GraduationCap, LayoutDashboard, Send, UserCheck, UserPlus } from "lucide-react";

interface NavbarProps {
  currentTab: "register" | "announcement" | "admin";
  setCurrentTab: (tab: "register" | "announcement" | "admin") => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

export default function Navbar({ currentTab, setCurrentTab, isAdmin, setIsAdmin }: NavbarProps) {
  return (
    <header id="ppdb-navbar" className="border-b-4 border-black bg-[#FFDD00] p-4 sticky top-0 z-50 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab("register")} 
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="bg-black text-[#FFDD00] p-2.5 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(255,221,0,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-100">
            <GraduationCap size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-black uppercase leading-none">
              PPDB <span className="text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">SMAN 1</span>
            </h1>
            <p className="text-xs font-bold text-black tracking-widest uppercase mt-0.5 opacity-90">
              Penerimaan Siswa Baru • 2026/2027
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center flex-wrap gap-2 sm:gap-3">
          <button
            id="nav-tab-register"
            onClick={() => setCurrentTab("register")}
            className={`px-4 py-2 text-sm font-black uppercase tracking-wider border-3 border-black transition-all duration-100 cursor-pointer ${
              currentTab === "register"
                ? "bg-black text-[#FFDD00] shadow-none translate-x-1 translate-y-1"
                : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
            }`}
          >
            <span className="flex items-center gap-1.5 justify-center">
              <UserPlus size={16} strokeWidth={2.5} />
              Form PPDB
            </span>
          </button>

          <button
            id="nav-tab-announcement"
            onClick={() => setCurrentTab("announcement")}
            className={`px-4 py-2 text-sm font-black uppercase tracking-wider border-3 border-black transition-all duration-100 cursor-pointer ${
              currentTab === "announcement"
                ? "bg-black text-[#FFDD00] shadow-none translate-x-1 translate-y-1"
                : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
            }`}
          >
            <span className="flex items-center gap-1.5 justify-center">
              <UserCheck size={16} strokeWidth={2.5} />
              Cek Kelulusan
            </span>
          </button>

          <div className="h-6 w-1 border-r-2 border-black mx-1 hidden sm:block"></div>

          <button
            id="nav-tab-admin"
            onClick={() => {
              setIsAdmin(!isAdmin);
              setCurrentTab(isAdmin ? "register" : "admin");
            }}
            className={`px-4 py-2 text-sm font-black uppercase tracking-wider border-3 border-black transition-all duration-100 cursor-pointer ${
              isAdmin && currentTab === "admin"
                ? "bg-red-500 text-white shadow-none translate-x-1 translate-y-1"
                : "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-neutral-800"
            }`}
          >
            <span className="flex items-center gap-1.5 justify-center">
              <LayoutDashboard size={16} strokeWidth={2.5} />
              {isAdmin ? "Mode Siswa" : "Portal Admin"}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
