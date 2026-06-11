/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Activity,
  Cpu,
  FileCode2,
  Smartphone,
  Network,
  ShieldCheck,
  ShieldAlert,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

export type TabId = "diagnostics" | "bloom" | "auditor" | "janitor" | "dns";

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: "diagnostics", label: "Diagnostics", icon: <Activity className="h-5 w-5" /> },
  { id: "bloom", label: "Bloom Filter", icon: <Cpu className="h-5 w-5" /> },
  { id: "auditor", label: "App Auditor", icon: <FileCode2 className="h-5 w-5" /> },
  { id: "janitor", label: "Account Janitor", icon: <Smartphone className="h-5 w-5" /> },
  { id: "dns", label: "Private DNS", icon: <Network className="h-5 w-5" /> }
];

interface NavigationProps {
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
  isShieldActive: boolean;
  onShieldToggle: () => void;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  isShieldActive,
  onShieldToggle
}: NavigationProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-app-bg-dark border-r border-app-border-light dark:border-app-border-dark overflow-y-auto z-40">
        <div className="p-6 flex items-center space-x-3">
          <div className={`p-2 rounded-xl transition-all ${
            isShieldActive
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 ring-2 ring-emerald-500/30"
              : "bg-slate-100 dark:bg-slate-900 text-slate-500"
          }`}>
            {isShieldActive ? <ShieldCheck className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">AuditAd</p>
            <h1 className="font-bold text-lg dark:text-white leading-tight">Privacy Hub</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all font-bold text-base cursor-pointer ${
                activeTab === item.id
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 dark:text-slate-400"
              }`}
            >
              {item.icon}
              <span className="tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-6">
          <div className="p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-app-border-light dark:border-app-border-dark shadow-inner">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shield Core</span>
              <span className={`h-2.5 w-2.5 rounded-full ${isShieldActive ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-slate-400"}`}></span>
            </div>
            <button
              onClick={onShieldToggle}
              className={`w-full py-4 rounded-xl font-black text-xs transition-all cursor-pointer uppercase tracking-widest active:scale-95 ${
                isShieldActive
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {isShieldActive ? "SHIELD LIVE" : "OFFLINE"}
            </button>
          </div>

          <div className="flex items-center justify-between px-3">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <span className="text-[10px] font-mono text-slate-400 opacity-60 font-black tracking-widest">VER 1.0.0</span>
          </div>
        </div>
      </aside>

      {/* Mobile Slider-Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-app-bg-dark/95 backdrop-blur-lg border-t border-app-border-light dark:border-app-border-dark px-2 pb-safe-offset-2 pt-2 shadow-2xl overflow-x-auto no-scrollbar snap-x snap-mandatory">
        <div className="flex justify-between items-center min-w-full px-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center min-w-[72px] p-2 rounded-2xl transition-all cursor-pointer snap-center ${
                activeTab === item.id
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/10"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              <div className={`p-1 rounded-lg transition-transform ${activeTab === item.id ? "scale-110" : "scale-100"}`}>
                {item.icon}
              </div>
              <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter">{item.label.split(" ")[0]}</span>
              {activeTab === item.id && (
                <div className="h-1 w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-0.5 animate-in zoom-in duration-300"></div>
              )}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
