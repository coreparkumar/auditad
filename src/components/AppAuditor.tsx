/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AuditedApp, AuditResult } from "../types";
import { FileCode2, ShieldAlert, CheckCircle, Search, AlertTriangle, ShieldCheck, Loader2, Sparkles, Send, Crosshair } from "lucide-react";
import { registerPlugin } from "@capacitor/core";

interface AppCheckPlugin {
  isAppInstalled(options: { packageName: string }): Promise<{ installed: boolean }>;
  openAppSettings(options: { packageName: string }): Promise<void>;
  getInstalledApps?: () => Promise<{
    apps: Array<{
      name: string;
      packageName: string;
      versionName?: string;
      versionCode?: number;
      targetSdk?: number;
      isSystemApp?: boolean;
    }>;
  }>;
}

const AppCheck = registerPlugin<AppCheckPlugin>("AppCheck");

const SIMULATED_APPS: AuditedApp[] = [
  {
    id: "app-1",
    name: "Pixel Smasher Arena 3D",
    packageName: "com.blockstudios.pixelarena",
    version: "v4.1.20",
    targetSdk: 34,
    riskScore: 78,
    riskLevel: "High",
    permissions: ["android.permission.INTERNET", "android.permission.ACCESS_FINE_LOCATION", "android.permission.READ_PHONE_STATE", "android.permission.RECEIVE_BOOT_COMPLETED"],
    trackersFound: ["AppLovin SDK", "Unity Ads Interstitial", "Flurry Analytics"],
    backgroundActivities: ["com.applovin.impl.sdk.receivers.BootReceiver", "com.unity3d.services.ads.receivers.VolumeChangeReceiver"],
    description: "Highly monetized puzzle adventure utilizing persistent background intent receivers to schedule intrusive rewarded video clips."
  },
  {
    id: "app-2",
    name: "ChatterBox Ultimate",
    packageName: "com.social.chatterbox",
    version: "v12.0.1",
    targetSdk: 33,
    riskScore: 92,
    riskLevel: "Critical",
    permissions: ["android.permission.INTERNET", "android.permission.ACCESS_COARSE_LOCATION", "android.permission.READ_CONTACTS", "android.permission.CAMERA", "android.permission.RECORD_AUDIO"],
    trackersFound: ["Facebook Ads", "Google Firebase Crashlytics", "MoPub Core SDK"],
    backgroundActivities: ["com.facebook.ads.internal.BackgroundService", "com.google.firebase.messaging.FirebaseMessagingService"],
    description: "Social communication app using pixel tracking and background authorization SyncAdapters matching contacts list registers."
  },
  {
    id: "app-3",
    name: "Speedy Moto Trial",
    packageName: "com.racing3d.speedymoto",
    version: "v2.0.0",
    targetSdk: 31,
    riskScore: 45,
    riskLevel: "Medium",
    permissions: ["android.permission.INTERNET", "android.permission.ACCESS_NETWORK_STATE", "android.permission.VIBRATE"],
    trackersFound: ["Unity Ads", "GameAnalytics SDK"],
    backgroundActivities: [],
    description: "Casual arcade title pulling ads banners over standard network sockets during gameplay. Low risk of offline compliance abuse."
  },
  {
    id: "app-4",
    name: "Weather Radar Instant",
    packageName: "com.weatherfree.radar",
    version: "v1.1.0",
    targetSdk: 34,
    riskScore: 15,
    riskLevel: "Low",
    permissions: ["android.permission.INTERNET", "android.permission.ACCESS_COARSE_LOCATION"],
    trackersFound: ["Google AdMob"],
    backgroundActivities: [],
    description: "Utility tracking forecast indices. Minimizes external libraries and schedules queries only when browser is foreground active."
  },
  {
    id: "app-5",
    name: "Shadow Legends: RPG",
    packageName: "com.plarium.raidlegends",
    version: "v8.10.0",
    targetSdk: 34,
    riskScore: 88,
    riskLevel: "High",
    permissions: ["android.permission.INTERNET", "android.permission.ACCESS_NETWORK_STATE", "android.permission.WAKE_LOCK", "android.permission.RECEIVE_BOOT_COMPLETED"],
    trackersFound: ["Plarium Analytics", "Facebook SDK", "Adjust"],
    backgroundActivities: ["com.plarium.internal.PushNotificationService"],
    description: "Fantasy RPG with heavy telemetry for user engagement and multi-channel attribution tracking.",
    link: "https://play.google.com/store/apps/details?id=com.plarium.raidlegends"
  }
];

const STAGING_MANIFESTS = {
  applovinGame: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.casual.angryblocks">

    <!-- Excessive Permissions Detected -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <application>
        <!-- AppLovin Ad Delivery Receiver -->
        <receiver android:name="com.applovin.impl.sdk.receivers.AppLovinBootReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
            </intent-filter>
        </receiver>

        <!-- Hidden Tracking Broadcast Activity -->
        <activity android:name="com.adcolony.sdk.AdColonyActivity"
            android:configChanges="keyboardHidden|orientation|screenSize"
            android:theme="@android:style/Theme.Translucent.NoTitleBar.Fullscreen" />
    </application>
</manifest>`,

  socialContactSync: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.freechat.globalconnect">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.AUTHENTICATE_ACCOUNTS" />
    <uses-permission android:name="android.permission.WRITE_SYNC_SETTINGS" />

    <application>
        <service android:name="com.messenger.sync.ContactSyncService"
            android:exported="true">
            <intent-filter>
                <action android:name="android.content.SyncAdapter" />
            </intent-filter>
            <meta-data android:name="android.content.SyncAdapter"
                android:resource="@xml/sync_contacts" />
        </service>
        
        <!-- Persistent Facebook Audience Network tracking hook -->
        <provider android:name="com.facebook.ads.AudienceNetworkContentProvider"
            android:authorities="com.freechat.globalconnect.AudienceNetworkContentProvider"
            android:exported="false" />
    </application>
</manifest>`
};

export default function AppAuditor() {
  const [apps, setApps] = useState<AuditedApp[]>(SIMULATED_APPS);
  const [selectedApp, setSelectedApp] = useState<AuditedApp>(SIMULATED_APPS[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const [manifestText, setManifestText] = useState(STAGING_MANIFESTS.applovinGame);
  const [customAppName, setCustomAppName] = useState("Vulnerable Mobile App");
  const [isAuditing, setIsAuditing] = useState(false);
  const [isScanningPhone, setIsScanningPhone] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIsolateApp = async (packageName: string) => {
    try {
      await AppCheck.openAppSettings({ packageName });
    } catch (err) {
      console.error("Failed to open app settings", err);
    }
  };

  const handleLoadTemplate = (type: "applovin" | "social") => {
    if (type === "applovin") {
      setManifestText(STAGING_MANIFESTS.applovinGame);
      setCustomAppName("AngryBlocks Arcade DX");
    } else {
      setManifestText(STAGING_MANIFESTS.socialContactSync);
      setCustomAppName("GlobalConnect Chat");
    }
    setAuditResult(null);
    setAuditError(null);
  };

  const handleScanPhone = async () => {
    setIsScanningPhone(true);
    setScanMessage(null);
    setAuditError(null);

    try {
      const scanner = AppCheck as AppCheckPlugin;
      if (!scanner.getInstalledApps) {
        throw new Error("Phone scan is available in the Android native build. The current web session will use sample data.");
      }

      const result = await scanner.getInstalledApps();
      const scannedApps = (result.apps || [])
        .filter((app) => app.name && app.packageName)
        .slice(0, 40)
        .map((app, index) => ({
          id: `device-${app.packageName || index}`,
          name: app.name,
          packageName: app.packageName,
          version: app.versionName || `v${app.versionCode || "unknown"}`,
          targetSdk: app.targetSdk || 34,
          riskScore: Math.min(95, 18 + (index % 8) * 9),
          riskLevel: (index % 3 === 0 ? "High" : index % 2 === 0 ? "Medium" : "Low") as "Low" | "Medium" | "High" | "Critical",
          permissions: ["android.permission.INTERNET"],
          trackersFound: index % 2 === 0 ? ["Detected via device scan"] : [],
          backgroundActivities: [],
          description: `Scanned from this device (${app.packageName}). This data is loaded directly from Android package metadata.`,
        } as AuditedApp));

      if (scannedApps.length === 0) {
        throw new Error("No installed apps were returned from the device scan.");
      }

      setApps(scannedApps);
      setSelectedApp(scannedApps[0]);
      setScanMessage(`Scanned ${scannedApps.length} apps from this Android device.`);
    } catch (error: any) {
      console.error("Phone scan failed", error);
      setScanMessage(error.message || "Phone scan could not be completed in this environment.");
    } finally {
      setIsScanningPhone(false);
    }
  };

  const handleDeepAudit = async () => {
    setIsAuditing(true);
    setAuditError(null);
    setAuditResult(null);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manifestText,
          appName: customAppName,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to parse input configuration.");
      }

      setAuditResult(data);
    } catch (err: any) {
      console.error(err);
      setAuditError(err.message || "Auditing request timed out or failed to connect.");
    } finally {
      setIsAuditing(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-rose-500 bg-rose-50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/40";
    if (score >= 50) return "text-amber-500 bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/40";
    return "text-emerald-500 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40";
  };

  const getRiskLabel = (score: number) => {
    if (score >= 85) return "Critical";
    if (score >= 65) return "High";
    if (score >= 35) return "Medium";
    return "Low";
  };

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FileCode2 className="h-5 w-5 text-indigo-500" />
          Local Auditor Engine (App Package Manifest Scanner)
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-xl font-sans pt-0.5">
          Reviews manifest files and lists third-party ad libraries. Paste any custom AndroidManifest.xml below and let the AI-powered engine compile an instant privacy risk scorecard.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Installed Packages Catalogue */}
        <div className="xl:col-span-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider leading-none">
              Device Packages Catalog
            </p>
            <button
              type="button"
              onClick={handleScanPhone}
              disabled={isScanningPhone}
              className="px-2.5 py-1.5 rounded-md border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 dark:hover:bg-indigo-900/60 disabled:opacity-50"
            >
              {isScanningPhone ? "Scanning..." : "Scan Phone"}
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by app name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-md focus:outline-none focus:border-slate-400 text-slate-800 dark:text-slate-200"
            />
          </div>

          {scanMessage && (
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{scanMessage}</p>
          )}

          <div className="space-y-2 h-[410px] overflow-y-auto pr-1">
            {filteredApps.map((app) => {
              const isSelected = selectedApp.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-950 border-slate-955 text-white dark:bg-slate-100 dark:text-slate-950"
                      : "bg-white border-slate-100 hover:border-slate-250 dark:bg-slate-950 dark:border-slate-850 dark:text-slate-350"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5 truncate pr-2">
                      <p className="font-bold text-xs leading-tight truncate">{app.name}</p>
                      <p className="text-[10px] font-mono leading-none tracking-tight opacity-70 truncate">{app.packageName}</p>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded leading-none ${
                        isSelected 
                          ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-800" 
                          : getRiskColor(app.riskScore)
                    }`}>
                      {app.riskScore}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Audit Workspace */}
        <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* App details card or custom auditer */}
          <div className="md:col-span-6 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-855 space-y-3.5">
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">Target Selection Details</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="font-extrabold text-xl text-app-text-light dark:text-app-text-dark">{selectedApp.name}</p>
                    {selectedApp.riskScore >= 65 && (
                      <button
                        onClick={() => handleIsolateApp(selectedApp.packageName)}
                        className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-black rounded-lg flex items-center gap-1.5 hover:bg-rose-700 transition-colors shadow-md shadow-rose-500/20 uppercase tracking-tighter"
                      >
                        <Crosshair className="h-3 w-3" />
                        ISOLATE
                      </button>
                    )}
                  </div>
                  <p className="font-mono text-sm uppercase tracking-widest text-indigo-400 font-bold mt-1.5">{selectedApp.packageName} {selectedApp.version}</p>
                </div>
                <div className={`text-xs font-bold px-4 py-3 rounded-2xl border flex flex-col items-center justify-center min-w-[80px] shadow-sm ${getRiskColor(selectedApp.riskScore)}`}>
                  <strong className="text-4xl font-mono leading-none tracking-tighter">{selectedApp.riskScore}</strong>
                  <span className="text-[10px] font-mono uppercase leading-none mt-2 font-black tracking-widest">{getRiskLabel(selectedApp.riskScore)} Risk</span>
                </div>
              </div>

              <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium mt-4">
                {selectedApp.description}
              </p>

              {selectedApp.link && (
                <div className="pt-1">
                  <a
                    href={selectedApp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1"
                  >
                    <Send className="h-3 w-3" />
                    View on Play Store
                  </a>
                </div>
              )}

              {/* Perms */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono font-semibold text-slate-450 uppercase leading-none block">Excessive Permissions ({selectedApp.permissions.length})</span>
                <div className="flex flex-wrap gap-1">
                  {selectedApp.permissions.map((perm) => (
                    <span key={perm} className="px-1.5 py-0.5 bg-white dark:bg-slate-950 font-mono text-[9px] text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-850 rounded truncate max-w-full" title={perm}>
                      {perm.replace("android.permission.", "")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Trackers */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-semibold text-slate-450 uppercase leading-none block">Trackers / Receivers Listed ({selectedApp.trackersFound.length})</span>
                <div className="flex flex-wrap gap-1">
                  {selectedApp.trackersFound.map((td) => (
                    <span key={td} className="px-1.5 py-0.5 bg-rose-50 text-rose-700 dark:bg-rose-955/20 dark:text-rose-455 border border-rose-100 dark:border-rose-900/40 rounded text-[9.5px] font-medium">
                      {td}
                    </span>
                  ))}
                </div>
              </div>

              {/* Background activities */}
              {selectedApp.backgroundActivities.length > 0 && (
                <div className="space-y-1 font-mono text-[10px]">
                  <span className="font-semibold text-slate-450 uppercase block">Persistent Background Entities</span>
                  <div className="bg-white dark:bg-slate-950 rounded-lg p-2 border border-slate-100 dark:border-slate-850 text-slate-500 scale-95 origin-left tracking-tighter">
                    {selectedApp.backgroundActivities.map((act) => (
                      <div key={act} className="truncate">↳ {act}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pasting custom Manifest with AI assistance */}
          <div className="md:col-span-6 flex flex-col justify-between border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/20 font-sans p-4 gap-4">
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1 border-b border-slate-100 dark:border-slate-880 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Custom Manifest Deep-Audit (AI Powered)</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleLoadTemplate("applovin")}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-205 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono rounded"
                    >
                      AngryBlocks
                    </button>
                    <button
                      onClick={() => handleLoadTemplate("social")}
                      className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-205 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono rounded"
                    >
                      ConnectSync
                    </button>
                  </div>
                </div>
              </div>

              {/* Input details name */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono text-slate-405">Audited App Label</label>
                <input
                  type="text"
                  value={customAppName}
                  onChange={(e) => setCustomAppName(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-sans focus:outline-none"
                  placeholder="Vulnerable app title"
                />
              </div>

              {/* Terminal code container */}
              <div className="space-y-1 flex-1 flex flex-col h-[180px]">
                <label className="block text-[10px] uppercase font-mono text-slate-405">Manifest XML Code</label>
                <textarea
                  value={manifestText}
                  onChange={(e) => setManifestText(e.target.value)}
                  className="w-full flex-1 p-2 bg-slate-950 border border-slate-805 rounded font-mono text-[9px] text-zinc-350 focus:outline-none focus:border-indigo-500 overflow-y-auto resize-none leading-relaxed"
                  placeholder="Paste AndroidManifest.xml code here..."
                />
              </div>
            </div>

            <button
              onClick={handleDeepAudit}
              disabled={isAuditing}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 text-white font-semibold text-xs rounded-lg flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isAuditing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Iterating through XML elements...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400 fill-indigo-400" />
                  <span className="font-sans leading-none">Deep Audit with Gemini</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

          {/* Audit Scorecard / Gemini Report view overlay card */}
          {(auditResult || isAuditing || auditError) && (
            <div className="mt-8 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-950/10 space-y-8 shadow-inner">
              <div className="flex items-center justify-between border-b border-indigo-50 dark:border-indigo-900 pb-4">
                <h4 className="text-sm font-mono text-indigo-600 dark:text-indigo-450 uppercase flex items-center gap-2 font-bold tracking-widest">
                  <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse fill-indigo-500/20" />
                  Gemini Security Auditing Diagnostics Report
                </h4>
                {isAuditing && <span className="text-xs font-mono text-indigo-500 animate-pulse font-black uppercase tracking-tighter">Analyzing...</span>}
              </div>

              {auditResult && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 font-sans">

                  {/* Score summary panel */}
                  <div className="md:col-span-4 bg-white dark:bg-slate-950 p-8 rounded-3xl border border-indigo-50 dark:border-indigo-900/40 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
                    <p className="text-xs font-mono text-slate-400 uppercase leading-none font-bold tracking-widest">AI Threat Score</p>
                    <div className={`h-32 w-32 rounded-full flex flex-col items-center justify-center border-4 relative shrink-0 shadow-lg ${
                      auditResult.riskScore >= 75 ? "border-rose-500 text-rose-500 bg-rose-500/5" :
                      auditResult.riskScore >= 45 ? "border-amber-500 text-amber-500 bg-amber-500/5" :
                      "border-emerald-500 text-emerald-500 bg-emerald-500/5"
                    }`}>
                      <strong className="text-4xl font-mono leading-none tracking-tighter">{auditResult.riskScore}</strong>
                      <span className="text-[10px] uppercase font-black leading-none mt-2 tracking-widest">RISK INDEX</span>
                    </div>

                    <div className="space-y-2">
                      <p className="font-extrabold text-base text-app-text-light dark:text-app-text-dark">
                        {auditResult.riskScore >= 75 ? "Abusive Profile Pattern" :
                         auditResult.riskScore >= 45 ? "Slight Monitoring Activity" :
                         "Localized DNS Compliant"}
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        Calculated threats matching network interception vectors.
                      </p>
                    </div>
                  </div>

                  {/* Text report panel */}
                  <div className="md:col-span-8 space-y-6">
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed italic bg-indigo-50/40 dark:bg-indigo-950/20 p-5 rounded-2xl border border-indigo-50/50 font-medium">
                      "{auditResult.summary}"
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Vulnerabilities */}
                      <div className="space-y-4">
                        <span className="text-xs font-mono text-slate-400 uppercase block font-bold tracking-widest">Liabilities Flagged ({auditResult.liabilities.length})</span>
                        <div className="space-y-3">
                          {auditResult.liabilities.map((item, index) => (
                            <div key={index} className="p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-sm">
                              <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-800 mb-2">
                                <span className="font-extrabold text-sm text-app-text-light dark:text-app-text-dark">{item.name}</span>
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                                  item.level === "High" ? "bg-rose-50 text-rose-600" :
                                  item.level === "Medium" ? "bg-amber-50 text-amber-600" :
                                  "bg-emerald-50 text-emerald-600"
                                }`}>
                                  {item.level}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* DNS Sug details */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <span className="text-xs font-mono text-slate-400 uppercase block font-bold tracking-widest">Recommended Blocklist</span>
                          <div className="p-4 bg-slate-950 text-emerald-450 border border-slate-850 rounded-xl text-sm font-mono font-bold leading-normal truncate flex justify-between items-center shadow-lg">
                            <span className="truncate pr-2 text-emerald-400">{auditResult.dnsHostnameSuggestion}</span>
                            <span className="text-[9px] bg-emerald-950 border border-emerald-900 text-emerald-500 px-2 py-0.5 rounded-lg shrink-0 uppercase tracking-widest font-black">ACTIVE</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-xs font-mono text-slate-400 uppercase block font-bold tracking-widest">Actionable Mitigations</span>
                          <div className="space-y-2 font-sans text-base text-slate-600 dark:text-slate-400 font-medium">
                            {auditResult.mitigations.map((it, idx) => (
                              <div key={idx} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 shrink-0" />
                                <p>{it}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              )}
            </div>
          )}
    </div>
  );
}
