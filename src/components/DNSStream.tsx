/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { DNSLog } from "../types";
import { Play, Pause, Trash2, Search, Filter, ShieldCheck, ShieldAlert, Cpu } from "lucide-react";

interface DNSStreamProps {
  isShieldActive: boolean;
  onBlockCounter: (category: "Ads" | "Tracker" | "Analytics" | "Allowed") => void;
  id?: string;
}

const SIMULATED_APPS = [
  { name: "Super Pixel Arena DX", package: "com.blockstudios.pixelarena" },
  { name: "ChatterBox Social", package: "com.social.chatterbox" },
  { name: "Speedy Moto Trial", package: "com.racing3d.speedymoto" },
  { name: "Weather Radar Instant", package: "com.weatherfree.radar" },
  { name: "Puzzle Quest Legend", package: "com.casualgames.puzzlequest" },
  { name: "Chrome Browser", package: "com.android.chrome" },
  { name: "Spotify", package: "com.spotify.music" }
];

const TRACKER_DOMAINS = [
  { domain: "ads.mopub.com", category: "Ads" },
  { domain: "admob.googleapis.com", category: "Ads" },
  { domain: "telemetry.unityads.io", category: "Tracker" },
  { domain: "applovin-collector.net", category: "Analytics" },
  { domain: "pixel.facebook.com", category: "Tracker" },
  { domain: "analytics.google.com", category: "Analytics" },
  { domain: "doubleclick.net", category: "Ads" },
  { domain: "metrics.gameanalytics.com", category: "Tracker" },
  { domain: "partner.ads.ironsrc.com", category: "Ads" },
  { domain: "sdk.scorecardresearch.com", category: "Analytics" }
];

const SAFE_DOMAINS = [
  { domain: "api.github.com", category: "Allowed" },
  { domain: "play.google.com", category: "Allowed" },
  { domain: "weather-data.noaa.gov", category: "Allowed" },
  { domain: "content.spotify.com", category: "Allowed" },
  { domain: "static.hcaptcha.com", category: "Allowed" },
  { domain: "android.googleapis.com", category: "Allowed" }
];

export default function DNSStream({ isShieldActive, onBlockCounter, id }: DNSStreamProps) {
  const [logs, setLogs] = useState<DNSLog[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"All" | "Blocked" | "Allowed">("All");
  const [groupByApp, setGroupByApp] = useState(false);

  const isPlayingRef = useRef(isPlaying);
  const isShieldActiveRef = useRef(isShieldActive);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isShieldActiveRef.current = isShieldActive;
  }, [isShieldActive]);

  // Generate logs periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlayingRef.current) return;

      const isTracker = Math.random() < 0.55;
      const app = SIMULATED_APPS[Math.floor(Math.random() * SIMULATED_APPS.length)];
      const record = isTracker
        ? TRACKER_DOMAINS[Math.floor(Math.random() * TRACKER_DOMAINS.length)]
        : SAFE_DOMAINS[Math.floor(Math.random() * SAFE_DOMAINS.length)];

      const isBlocked = isTracker && isShieldActiveRef.current;
      const category = record.category as "Ads" | "Tracker" | "Analytics" | "Allowed";

      if (isBlocked) {
        onBlockCounter(category);
      } else if (!isTracker) {
        onBlockCounter("Allowed");
      }

      const newLog: DNSLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }) + "." + String(Math.floor(Math.random() * 1000)).padStart(3, "0"),
        domain: record.domain,
        app: app.name,
        appPackage: app.package,
        category,
        status: isBlocked ? "Blocked" : "Allowed",
        protocol: "UDP",
        port: 53,
        latencyMs: isBlocked ? 0.3 : Math.floor(Math.random() * 45) + 5
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 99)]); // Increased buffer for better grouping
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleClear = () => {
    setLogs([]);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.app.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.appPackage.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === "Blocked") return matchesSearch && log.status === "Blocked";
    if (selectedFilter === "Allowed") return matchesSearch && log.status === "Allowed";
    return matchesSearch;
  });

  // Aggregation logic for groupByApp
  const aggregatedLogs = groupByApp
    ? Object.values(
        filteredLogs.reduce((acc, log) => {
          if (!acc[log.appPackage]) {
            acc[log.appPackage] = {
              app: log.app,
              appPackage: log.appPackage,
              logs: [],
              stats: { Ads: 0, Tracker: 0, Analytics: 0, Allowed: 0 }
            };
          }
          acc[log.appPackage].logs.push(log);
          acc[log.appPackage].stats[log.category]++;
          return acc;
        }, {} as Record<string, { app: string; appPackage: string; logs: DNSLog[]; stats: Record<string, number> }>)
      )
    : [];

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      Ads: "border-rose-900 text-rose-400 bg-rose-955/20",
      Tracker: "border-amber-700 text-amber-500 bg-amber-955/20",
      Analytics: "border-purple-900 text-purple-400 bg-purple-955/20",
      Allowed: "border-emerald-900 text-emerald-450 bg-emerald-955/20"
    };
    return colors[category] || "border-slate-800 text-slate-400";
  };

  return (
    <div id={id} className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-[520px]">
      {/* Stream Controls */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Cpu className="h-5 w-5 text-slate-500 animate-pulse" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm font-sans">
            On-Device DNS Tunnel Loopback (Port 53 Interceptor)
          </h3>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          {/* Group By Toggle */}
          <button
            onClick={() => setGroupByApp(!groupByApp)}
            className={`px-2 py-1 rounded border text-[10px] font-bold font-mono transition-colors ${
              groupByApp ? "bg-indigo-600 text-white border-indigo-500" : "bg-white text-slate-500 border-slate-200"
            }`}
          >
            GROUP BY APP
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1.5 rounded-md border text-xs flex items-center space-x-1.5 transition-colors ${
              isPlaying
                ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            }`}
            title={isPlaying ? "Pause stream" : "Resume stream"}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 border-b border-slate-50 dark:border-slate-850 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search package, host..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:border-slate-400 text-slate-850 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center space-x-1 self-start sm:self-auto">
          {(["All", "Blocked", "Allowed"] as const).map((filterOpt) => (
            <button
              key={filterOpt}
              onClick={() => setSelectedFilter(filterOpt)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                selectedFilter === filterOpt
                  ? "bg-slate-900 text-white border-slate-900 font-medium"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {filterOpt}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto font-mono text-base divide-y divide-slate-50 dark:divide-slate-900 bg-slate-950 text-slate-350 p-4">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 text-center">
            <Cpu className="h-10 w-10 text-slate-600 mb-4 stroke-1" />
            <p className="font-sans text-base font-medium">Awaiting connections...</p>
          </div>
        ) : groupByApp ? (
          <div className="space-y-6">
            {aggregatedLogs.map((group) => (
              <div key={group.appPackage} className="border border-slate-800 rounded-xl bg-slate-900/40 p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-sans font-bold text-slate-100 text-lg">{group.app}</h4>
                    <p className="font-mono text-sm uppercase tracking-widest text-indigo-400 font-bold mt-1">{group.appPackage}</p>
                  </div>
                  <div className="flex gap-2">
                    {Object.entries(group.stats).map(([cat, count]) => count > 0 && (
                      <span key={cat} className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getCategoryBadge(cat)}`}>
                        {cat}: {count}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {group.logs.slice(0, 3).map((log) => (
                    <div key={log.id} className="flex justify-between text-sm opacity-80 font-mono tracking-tight">
                      <span className="truncate flex-1">{log.domain}</span>
                      <span className={`font-bold ${log.status === "Blocked" ? "text-rose-500" : "text-emerald-500"}`}>{log.status}</span>
                    </div>
                  ))}
                  {group.logs.length > 3 && (
                    <p className="text-sm text-slate-600 italic font-sans font-medium">+{group.logs.length - 3} more connections</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 text-slate-500 font-bold px-4 py-2 text-xs border-b border-slate-900 uppercase tracking-widest">
              <span className="col-span-2">TIME</span>
              <span className="col-span-3">PACKAGE</span>
              <span className="col-span-4">HOST</span>
              <span className="col-span-1 text-center">PORT</span>
              <span className="col-span-2 text-right">ACTION</span>
            </div>

            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`grid grid-cols-12 gap-2 px-4 py-2.5 items-center rounded-lg transition-colors hover:bg-slate-900/60 ${
                  log.status === "Blocked" ? "bg-rose-950/20 text-rose-300" : "text-slate-350"
                }`}
              >
                <span className="col-span-2 text-sm text-slate-500 font-mono">{log.timestamp}</span>
                <div className="col-span-3 truncate pr-2">
                  <span className="font-mono text-sm uppercase tracking-wide font-bold text-indigo-400">{log.appPackage.split('.').slice(-1)}</span>
                </div>
                <div className="col-span-4 flex items-center space-x-2 min-w-0">
                  <span className="truncate font-bold text-slate-100 text-sm">{log.domain}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] leading-none border font-black tracking-tighter ${getCategoryBadge(log.category)}`}>
                    {log.category.toUpperCase()}
                  </span>
                </div>
                <span className="col-span-1 text-center text-slate-600 text-sm">:{log.port}</span>
                <div className="col-span-2 flex items-center justify-end font-black space-x-1">
                  {log.status === "Blocked" ? (
                    <span className="text-rose-500 text-sm tracking-tighter">0.0.0.0</span>
                  ) : (
                    <span className="text-emerald-500 text-sm tracking-tighter">+{log.latencyMs}ms</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Latency Indicator Footnote */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-880 bg-slate-50 dark:bg-slate-900/40 text-sm text-slate-500 dark:text-slate-400 flex justify-between font-sans font-medium">
        <span>UDP 4-packet resolution limit</span>
        <span className="font-mono text-sm font-bold text-indigo-500 tracking-tight">Δt Avg: ~1.4ms</span>
      </div>
    </div>
  );
}
