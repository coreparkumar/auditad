/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Info,
  BatteryCharging
} from "lucide-react";
import Navigation, { TabId } from "./components/Navigation";
import DashboardLayout from "./components/DashboardLayout";
import DashboardSummary from "./components/DashboardSummary";
import DNSStream from "./components/DNSStream";
import BloomFilterVisualizer from "./components/BloomFilterVisualizer";
import JanitorWorkspace from "./components/JanitorWorkspace";
import AppAuditor from "./components/AppAuditor";
import DNSConfigHelp from "./components/DNSConfigHelp";

export default function App() {
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [showVpnPrompt, setShowVpnPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("diagnostics");

  // Core blocked telemetry counters
  const [adsBlocked, setAdsBlocked] = useState(142);
  const [trackersBlocked, setTrackersBlocked] = useState(84);
  const [analyticsBlocked, setAnalyticsBlocked] = useState(213);
  const [totalQueries, setTotalQueries] = useState(1930);

  // Syncing count callback from DNSStream
  const handleBlockCounter = (category: "Ads" | "Tracker" | "Analytics" | "Allowed") => {
    setTotalQueries((prev) => prev + 1);
    if (!isShieldActive) return;

    if (category === "Ads") setAdsBlocked((prev) => prev + 1);
    if (category === "Tracker") setTrackersBlocked((prev) => prev + 1);
    if (category === "Analytics") setAnalyticsBlocked((prev) => prev + 1);
  };

  const handleShieldToggle = () => {
    if (!isShieldActive) {
      setShowVpnPrompt(true);
    } else {
      setIsShieldActive(false);
    }
  };

  const acceptVpnConfiguration = () => {
    setIsShieldActive(true);
    setShowVpnPrompt(false);
  };

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold tracking-tight text-app-text-light dark:text-app-text-dark capitalize leading-none">
          {activeTab === "dns" ? "Private DNS Settings" : activeTab.replace("-", " ")}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium max-w-2xl">
          {activeTab === "diagnostics" && "Real-time network traffic analysis and on-device filtration."}
          {activeTab === "bloom" && "Technical visualization of the zero-knowledge matching engine."}
          {activeTab === "auditor" && "Security audit scanner for installed packages and manifests."}
          {activeTab === "janitor" && "System-level privacy control and data reset assistants."}
          {activeTab === "dns" && "Battery-safe network-level tracker blocking rules."}
        </p>
      </div>

      {/* Mobile-only status badge */}
      <div className="lg:hidden flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-app-border-light dark:border-app-border-dark bg-white dark:bg-slate-900/30 w-fit">
        <span className={`h-2 w-2 rounded-full ${isShieldActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></span>
        <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
          {isShieldActive ? "SHIELD ACTIVE" : "PASSTHROUGH"}
        </span>
      </div>
    </div>
  );

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isShieldActive={isShieldActive}
      onShieldToggle={handleShieldToggle}
      header={renderHeader()}
    >
      {activeTab === "diagnostics" && (
        <div className="space-y-8">
          <DashboardSummary
            adsBlocked={adsBlocked}
            trackersBlocked={trackersBlocked}
            analyticsBlocked={analyticsBlocked}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <DNSStream isShieldActive={isShieldActive} onBlockCounter={handleBlockCounter} />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-slate-900/50 border border-app-border-light dark:border-app-border-dark rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center space-x-3 text-indigo-500">
                  <Info className="h-5 w-5" />
                  <h4 className="font-bold text-sm">Policy Compliance</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  AuditAd operates as a <strong className="text-app-text-light dark:text-app-text-dark font-bold">Local DNS Optimizer</strong> per Store Policy 4.5.1. No external blocking is performed without manual user configuration.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900/50 border border-app-border-light dark:border-app-border-dark rounded-3xl p-6 space-y-6 shadow-sm">
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <BatteryCharging className="h-4 w-4 text-emerald-500" />
                  System Health
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-slate-500 font-medium">Total Queries</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{totalQueries}</span>
                  </div>
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-slate-500 font-medium">Efficiency</span>
                    <span className="text-emerald-500 font-bold">99.8%</span>
                  </div>
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-slate-500 font-medium">Battery Impact</span>
                    <span className="text-amber-500 font-bold">{isShieldActive ? "~0.8%" : "0.0%"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "bloom" && <BloomFilterVisualizer />}
      {activeTab === "auditor" && <AppAuditor />}
      {activeTab === "janitor" && <JanitorWorkspace />}
      {activeTab === "dns" && <DNSConfigHelp />}

      {/* VpnService initialization prompt (Global Overlay) */}
      {showVpnPrompt && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
          <div className="bg-white dark:bg-app-bg-dark border border-app-border-light dark:border-app-border-dark rounded-[2.5rem] max-w-sm w-full p-10 shadow-2xl space-y-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-full animate-bounce shadow-inner">
                <ShieldAlert className="h-12 w-12 text-indigo-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-app-text-light dark:text-app-text-dark tracking-tighter">Shield Authorization</h3>
                <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  AuditAd needs to establish a <strong className="text-indigo-500">Secure Local Loopback</strong> to intercept and neutralize background trackers.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={acceptVpnConfiguration}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base rounded-2xl transition-all shadow-xl shadow-indigo-500/30 active:scale-95 uppercase tracking-widest"
              >
                Accept & Enable
              </button>
              <button
                onClick={() => setShowVpnPrompt(false)}
                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-sm rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 uppercase tracking-widest"
              >
                Deny Access
              </button>
            </div>
            <p className="text-[10px] text-center font-mono font-bold text-slate-400 uppercase tracking-widest opacity-60">System Security Mock API v2.0</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
