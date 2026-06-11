/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Info, HelpCircle, Activity, Sparkles } from "lucide-react";

// Simple deterministic hash algorithms for demonstration
function computeFnv1a(str: string, maxBits: number): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash >>> 0) % maxBits;
}

function computeDjb2(str: string, maxBits: number): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash >>> 0) % maxBits;
}

function computeMurmurSimple(str: string, maxBits: number): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    const k = str.charCodeAt(i) * 0xcc9e2d51;
    hash ^= k;
    hash = (hash << 13) | (hash >>> 19);
    hash = hash * 5 + 0xe6546b64;
  }
  return Math.abs(hash >>> 0) % maxBits;
}

const PRESET_TRACKERS = [
  "admob.googleapis.com",
  "telemetry.unityads.io",
  "doubleclick.net",
  "applovin-collector.net",
  "pixel.facebook.com"
];

export default function BloomFilterVisualizer() {
  // Config parameters
  const [arraySizeM, setArraySizeM] = useState(64); // Bit Array size (m)
  const [entitiesN, setEntitiesN] = useState(15); // Tracked entities count (n)
  const [hashesK, setHashesK] = useState(3); // Hash functions count (k)

  const [testDomain, setTestDomain] = useState("admob.googleapis.com");
  const [activeFlippedBits, setActiveFlippedBits] = useState<number[]>([]);
  const [currentQueryIndices, setCurrentQueryIndices] = useState<number[]>([]);
  const [queryMatched, setQueryMatched] = useState<boolean | null>(null);

  // Compute preset tracker bits when presets or parameters change
  useEffect(() => {
    const bitsSet = new Set<number>();
    // For n items in preset
    const trackingList = [...PRESET_TRACKERS];
    // Pads trackers if n is high, truncates if low
    while (trackingList.length < entitiesN) {
      trackingList.push(`tracker-${trackingList.length}.adserver.com`);
    }
    const finalTrackers = trackingList.slice(0, entitiesN);

    finalTrackers.forEach((tracker) => {
      if (hashesK >= 1) bitsSet.add(computeFnv1a(tracker, arraySizeM));
      if (hashesK >= 2) bitsSet.add(computeDjb2(tracker, arraySizeM));
      if (hashesK >= 3) bitsSet.add(computeMurmurSimple(tracker, arraySizeM));
      if (hashesK >= 4) bitsSet.add(computeFnv1a(tracker + "-salt1", arraySizeM));
      if (hashesK >= 5) bitsSet.add(computeDjb2(tracker + "-salt2", arraySizeM));
    });

    setActiveFlippedBits(Array.from(bitsSet));
  }, [arraySizeM, entitiesN, hashesK]);

  // Run dynamic evaluation when query domain or parameters change
  const handleEvaluateQuery = (domainToTestStr: string) => {
    const indices: number[] = [];
    if (hashesK >= 1) indices.push(computeFnv1a(domainToTestStr, arraySizeM));
    if (hashesK >= 2) indices.push(computeDjb2(domainToTestStr, arraySizeM));
    if (hashesK >= 3) indices.push(computeMurmurSimple(domainToTestStr, arraySizeM));
    if (hashesK >= 4) indices.push(computeFnv1a(domainToTestStr + "-salt1", arraySizeM));
    if (hashesK >= 5) indices.push(computeDjb2(domainToTestStr + "-salt2", arraySizeM));

    setCurrentQueryIndices(indices);

    // Is match found? Yes if all indices are active in activeFlippedBits
    const isMatched = indices.every((idx) => activeFlippedBits.includes(idx));
    setQueryMatched(isMatched);
  };

  useEffect(() => {
    if (testDomain) {
      handleEvaluateQuery(testDomain);
    } else {
      setCurrentQueryIndices([]);
      setQueryMatched(null);
    }
  }, [testDomain, activeFlippedBits]);

  // Math probability calculation: p ≈ (1 - e^(-kn/m))^k
  const exponent = -1 * ((hashesK * entitiesN) / arraySizeM);
  const oneMinusExp = 1 - Math.exp(exponent);
  const falsePositiveRate = Math.pow(oneMinusExp, hashesK);
  const falsePositivePercentage = (falsePositiveRate * 100).toFixed(4);

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-6">
      {/* Visualizer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-900 pb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            Bloom-Filter Matcher (Zero-Knowledge Engine)
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-xl">
            Simulates how AuditAd queries incoming hostnames against 150,000 bad domains in sub-millisecond $O(k)$ time directly on-device without exposing network queries.
          </p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-2xl flex items-center space-x-4 self-start md:self-auto min-w-[240px] shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-mono text-indigo-500 uppercase tracking-widest font-bold">False Positive Rate</p>
            <p className="text-4xl font-mono font-black text-indigo-700 dark:text-indigo-400 tracking-tighter">
              {falsePositivePercentage}%
            </p>
          </div>
        </div>
      </div>

      {/* Main interactive columns: controls & bit visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left config slider controls (Math parameters) */}
        <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6 shadow-inner">
          <h4 className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center justify-between">
            <span>Filter Parameters</span>
            <span className="text-[10px] text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900">p ≈ (1 - e^-kn/m)^k</span>
          </h4>

          {/* Size (m) */}
          <div className="space-y-3">
            <div className="flex justify-between text-base font-sans font-bold">
              <span className="text-slate-500">Bit Array Size (m)</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{arraySizeM} bits</span>
            </div>
            <input
              type="range"
              min="16"
              max="128"
              step="16"
              value={arraySizeM}
              onChange={(e) => setArraySizeM(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-sm text-slate-450 italic font-medium">Bit storage space allocated in kernel memory.</p>
          </div>

          {/* Tracked Entities (n) */}
          <div className="space-y-3">
            <div className="flex justify-between text-base font-sans font-bold">
              <span className="text-slate-500">Tracked Domains (n)</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{entitiesN} systems</span>
            </div>
            <input
              type="range"
              min="2"
              max="40"
              step="1"
              value={entitiesN}
              onChange={(e) => setEntitiesN(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-sm text-slate-450 italic font-medium">Count of blacklisted domains currently loaded.</p>
          </div>

          {/* Hash Functions (k) */}
          <div className="space-y-3">
            <div className="flex justify-between text-base font-sans font-bold">
              <span className="text-slate-500">Hash Functions (k)</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{hashesK} hashes</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={hashesK}
              onChange={(e) => setHashesK(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-sm text-slate-450 italic font-medium">Hashing routines executed per lookup query.</p>
          </div>
        </div>

        {/* Right side: Interactive Query and Flipped bits diagram */}
        <div className="lg:col-span-8 space-y-8">
          {/* Lookup query input */}
          <div className="space-y-3">
            <label className="block text-base font-sans font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-tight">
              On-Device Tracker Lookup Test Console
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter domain name to test (e.g., ads.mopub.com)"
                value={testDomain}
                onChange={(e) => setTestDomain(e.target.value)}
                className="flex-1 px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-850 dark:text-slate-150 font-mono tracking-wide"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTestDomain("admob.googleapis.com")}
                  className="px-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 font-mono font-black rounded-xl text-slate-655 dark:text-slate-300 border border-slate-205 dark:border-slate-705 transition-all shadow-sm"
                >
                  ADMOB
                </button>
                <button
                  type="button"
                  onClick={() => setTestDomain("safe-server.noaa.gov")}
                  className="px-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 font-mono font-black rounded-xl text-slate-655 dark:text-slate-300 border border-slate-205 dark:border-slate-705 transition-all shadow-sm"
                >
                  SAFE
                </button>
              </div>
            </div>
          </div>

          {/* Hashed registers readout */}
          {testDomain && (
            <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-850 bg-slate-50/55 dark:bg-slate-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-inner">
              <div className="space-y-2">
                <p className="font-sans font-bold text-slate-500 dark:text-slate-400 text-sm leading-none">
                  Computing indices for <span className="font-mono bg-white dark:bg-slate-850 px-2 py-0.5 rounded-lg text-indigo-500 dark:text-indigo-400 font-black tracking-wide">{testDomain.toUpperCase()}</span>
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {currentQueryIndices.map((idx, index) => {
                    const isBitCorrect = activeFlippedBits.includes(idx);
                    return (
                      <span
                        key={index}
                        className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg font-mono text-xs border shadow-sm ${
                          isBitCorrect
                            ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-955/20 dark:border-rose-900/40 dark:text-rose-300"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-955/20 dark:border-emerald-900/40 dark:text-emerald-300"
                        }`}
                      >
                        <span className="font-black">k{index + 1}:</span>
                        <strong className="font-black">Index {idx}</strong>
                        <span className="text-[10px] font-black uppercase opacity-60">[{isBitCorrect ? "Hit" : "Miss"}]</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {queryMatched !== null && (
                <div className={`px-6 py-3 rounded-2xl border text-base font-mono font-black leading-none shadow-lg ${
                  queryMatched
                    ? "bg-rose-600 text-white border-rose-500 animate-pulse"
                    : "bg-emerald-600 text-white border-emerald-500"
                }`}>
                  {queryMatched ? "BLOCKED (0.0.0.0)" : "CLEARED (FORWARD)"}
                </div>
              )}
            </div>
          )}

          {/* Bit Array Visual Grid Map */}
          <div className="space-y-2">
            <h5 className="text-xs font-sans font-semibold text-slate-500 flex items-center justify-between">
              <span>Active 64-bit Memory Map Grid</span>
              <span className="text-[10px]">Active registers: {activeFlippedBits.length} / {arraySizeM}</span>
            </h5>
            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-950">
              {Array.from({ length: arraySizeM }).map((_, idx) => {
                const isActiveTracker = activeFlippedBits.includes(idx);
                const isQueryIndex = currentQueryIndices.includes(idx);

                let cellColor = "bg-slate-850 border-slate-800";
                let textTone = "text-slate-600";
                let borderPulse = "";

                if (isActiveTracker) {
                  cellColor = "bg-slate-800 text-rose-400 border-rose-900/50";
                  textTone = "text-rose-500/80";
                }

                if (isQueryIndex) {
                  if (isActiveTracker) {
                    cellColor = "bg-rose-600 text-white border-rose-400 font-bold";
                    textTone = "text-white";
                    borderPulse = "ring-2 ring-rose-500/80 ring-offset-1 ring-offset-slate-950 scale-105 z-10 animate-pulse";
                  } else {
                    cellColor = "bg-emerald-600 text-white border-emerald-400 font-bold";
                    textTone = "text-white";
                    borderPulse = "ring-2 ring-emerald-500/80 ring-offset-1 ring-offset-slate-950 scale-105 z-10";
                  }
                }

                return (
                  <div
                    key={idx}
                    title={`Memory Index ${idx}`}
                    className={`aspect-square rounded border flex flex-col items-center justify-center text-[8px] font-mono transition-all duration-300 ${cellColor} ${borderPulse}`}
                  >
                    <span className={textTone}>{idx}</span>
                    <span className={`text-[6px] opacity-70 ${isQueryIndex ? "text-white" : "text-slate-500"}`}>
                      {isActiveTracker ? "1" : "0"}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Grid legend */}
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-sans text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center space-x-1.5">
                <div className="h-3 w-3 rounded bg-slate-850 border border-slate-800"></div>
                <span>Available (0)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="h-3 w-3 rounded bg-slate-800 border border-rose-900/50"></div>
                <span>Tracker Hash Flipped (1)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="h-3 w-3 rounded bg-rose-600 border border-rose-400"></div>
                <span>Query Hit & Blocked</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="h-3 w-3 rounded bg-emerald-600 border border-emerald-400"></div>
                <span>Query Miss (Allowed)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
