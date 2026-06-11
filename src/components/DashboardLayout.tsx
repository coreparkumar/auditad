/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
import Navigation, { TabId } from "./Navigation";

interface DashboardLayoutProps {
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
  isShieldActive: boolean;
  onShieldToggle: () => void;
  children: React.ReactNode;
  header: React.ReactNode;
}

export default function DashboardLayout({
  activeTab,
  setActiveTab,
  isShieldActive,
  onShieldToggle,
  children,
  header
}: DashboardLayoutProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-app-bg-light dark:bg-app-bg-dark transition-colors duration-250 overflow-hidden text-app-text-light dark:text-app-text-dark">

      {/* Responsive Navigation Component */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isShieldActive={isShieldActive}
        onShieldToggle={onShieldToggle}
      />

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
        {/* Fixed Header per Page */}
        <header className="shrink-0 border-b border-app-border-light dark:border-app-border-dark bg-white/80 dark:bg-app-bg-dark/80 backdrop-blur-md z-30">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
            {header}
          </div>
        </header>

        {/* Content Container with Snap Mechanics for Mobile */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto lg:overflow-y-auto pb-24 lg:pb-8 snap-y snap-proximity scroll-smooth"
        >
          <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </div>

        {/* Global Footer (Desktop only) */}
        <footer className="hidden lg:block shrink-0 px-8 py-4 border-t border-app-border-light dark:border-app-border-dark bg-white dark:bg-app-bg-dark text-3xs font-mono text-slate-400">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span>AuditAd Privacy Dashboard — Zero-Knowledge Security Tool</span>
            <span>API 35+ Telemetry Isolation</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
