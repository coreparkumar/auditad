/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { JanitorTask } from "../types";
import { ShieldCheck, ArrowRight, ExternalLink, Smartphone, MessageSquare, Info, Star, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";

const JANITOR_TASKS: JanitorTask[] = [
  {
    id: "g-ads",
    title: "Google Ad Personalization Controls",
    category: "Google",
    description: "Google's central profile manager records search parameters, location tags, and watch history to compute ads portfolios.",
    canonicalUrl: "https://myadcenter.google.com/controls",
    actionVector: "Toggle personalized tracking OFF.",
    steps: [
      "Access Google MyAdCenter Controls inside the viewport.",
      "Look for the 'Personalized Ads' master switch.",
      "Toggle Personalized Ads to 'Turn Off' to neutralize tracking.",
      "Confirm on the dialog prompts."
    ]
  },
  {
    id: "g-adid",
    title: "Wipe Device Advertising ID",
    category: "Google",
    description: "Hardcoded advertiser IDs associate diagnostic data from unrelated games directly back to your Android hardware framework.",
    canonicalUrl: "https://myadcenter.google.com/controls", // Fallback for safety inside context
    intentUri: "intent:#Intent;action=com.google.android.gms.settings.ads.PRIVACY_SETTINGS;package=com.google.android.gms;end",
    actionVector: "Generate hardware-bound reset payload.",
    steps: [
      "Launch Google Play Services Ads Settings on-device.",
      "Click 'Reset Advertising ID' or 'Delete Advertising ID'.",
      "Confirm the Android system confirmation dialog.",
      "This voids existing analytics cookies matching your game habits."
    ]
  },
  {
    id: "m-center",
    title: "Meta Corporate Tracking Rights",
    category: "Meta",
    description: "Facebook cross-app profiles track devices using embedded Software Development Kits (SDKs) in random utility and gaming apps.",
    canonicalUrl: "https://accountscenter.facebook.com/ads/preferences",
    actionVector: "Revoke corporate profiling tags.",
    steps: [
      "Wait for Meta Accounts Center to load inside browser.",
      "Go to 'Ad Settings' -> 'Ad topics' or 'Data about your activity'.",
      "Choose to 'Revoke tracking licenses' for third-party domains."
    ]
  },
  {
    id: "m-offsite",
    title: "Off-Meta Historical Indexes",
    category: "Meta",
    description: "Third-party sites send 'Pixel activity events' mapping your page visits directly to Meta's servers.",
    canonicalUrl: "https://www.facebook.com/off_facebook_activity",
    actionVector: "Clear tracking indexes.",
    steps: [
      "Open Off-Facebook Activity page in custom browser view.",
      "Click 'Clear Previous Activity' under managing options.",
      "Deactivate 'Future Off-Facebook Activity' to block subsequent tracking."
    ]
  }
];

export default function JanitorWorkspace() {
  const [selectedTask, setSelectedTask] = useState<JanitorTask>(JANITOR_TASKS[0]);
  const [isOverlaySimulated, setIsOverlaySimulated] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [lastAdReset, setLastAdReset] = useState<number | null>(null);
  const [showResetReminder, setShowResetReminder] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("auditad_last_ad_reset");
    if (stored) {
      const timestamp = parseInt(stored, 10);
      setLastAdReset(timestamp);

      // Check if 90 days (90 * 24 * 60 * 60 * 1000 ms) have passed
      const ninetyDays = 90 * 24 * 60 * 60 * 1000;
      if (Date.now() - timestamp > ninetyDays) {
        setShowResetReminder(true);
      }
    } else {
      // First time user, show reminder as a suggestion
      setShowResetReminder(true);
    }
  }, []);

  const handleRecordReset = () => {
    const now = Date.now();
    localStorage.setItem("auditad_last_ad_reset", now.toString());
    setLastAdReset(now);
    setShowResetReminder(false);
    setIsOverlaySimulated(false);
  };

  const handleLaunchTask = (task: JanitorTask) => {
    setSelectedTask(task);
    setIsOverlaySimulated(true);
    setCurrentStepIndex(0);
  };

  const handleNextStep = () => {
    if (selectedTask.id === "g-adid" && currentStepIndex === selectedTask.steps.length - 1) {
      handleRecordReset();
    } else if (currentStepIndex < selectedTask.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setCurrentStepIndex(0);
    }
  };

  // Simulated browser content mockup based on target
  const renderBrowserMockupContent = () => {
    if (selectedTask.id === "g-ads") {
      return (
        <div className="bg-slate-50 dark:bg-slate-900 h-full p-4 flex flex-col justify-between font-sans text-xs">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-850">
              <div className="h-5 w-5 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold font-mono text-[10px]">G</div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-150">My Ad Center</p>
                <p className="text-[9px] text-slate-450 uppercase tracking-wide">myadcenter.google.com</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-880 shadow-3xs space-y-2">
              <p className="font-bold text-slate-705 dark:text-slate-200">Personalized Ads on Google</p>
              <p className="text-[10px] text-slate-500">Personalized ads help you discover items. If disabled, ads are randomized and tracking is frozen.</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-900">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Status</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  isOverlaySimulated && currentStepIndex >= 2 ? "bg-rose-50 text-rose-600 dark:bg-rose-955/20 dark:text-rose-400" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-955/20 dark:text-emerald-400"
                }`}>
                  {isOverlaySimulated && currentStepIndex >= 2 ? "OFF (SUSPENDED)" : "ON (TRACKING)"}
                </span>
              </div>
            </div>

            <p className="text-[9.5px] text-slate-450 leading-relaxed">
              *Your setting applies across Google Search, YouTube, and Discovery feeds bound to this profile.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentStepIndex(2)}
              className="flex-1 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold rounded text-center text-3xs border border-slate-200"
            >
              Toggle Ads Switch
            </button>
          </div>
        </div>
      );
    }

    if (selectedTask.id === "g-adid") {
      return (
        <div className="bg-slate-100 dark:bg-slate-900 h-full p-4 flex flex-col justify-between font-sans text-xs">
          <div className="space-y-3">
            <div className="flex items-center space-x-1.5 pb-2 border-b border-slate-200 dark:border-slate-850">
              <Smartphone className="h-4 w-4 text-slate-500" />
              <p className="font-bold text-slate-805 dark:text-slate-150 text-2xs uppercase tracking-wider font-mono">System Settings &gt; Ads</p>
            </div>

            <div className="space-y-1.5 pt-1">
              <p className="text-[9px] text-slate-450 uppercase font-mono">Device Identifiers</p>
              <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-250 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-900 text-3xs">
                <div className="p-2.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer" onClick={() => setCurrentStepIndex(1)}>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Reset advertising ID</p>
                    <p className="text-[8px] text-slate-450">Replaces current ID register with a randomized identifier.</p>
                  </div>
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                </div>
                <div className="p-2.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer" onClick={() => setCurrentStepIndex(1)}>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Delete advertising ID</p>
                    <p className="text-[8px] text-slate-500">Neutralizes device mapping completely across all games.</p>
                  </div>
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="p-2 bg-slate-200/50 dark:bg-slate-850 rounded text-[9px] text-slate-500 font-mono">
              Current ID: {isOverlaySimulated && currentStepIndex >= 1 ? "4df1-a02b-000000000000 (CLEARED)" : "90ba-fcd9-e2a1-ccba-88cf1"}
            </div>
          </div>
          <p className="text-[9px] text-center text-slate-450 italic leading-none">Simulation matches native Google API 34</p>
        </div>
      );
    }

    // Facebook / Meta options
    return (
      <div className="bg-slate-200/40 dark:bg-slate-900 h-full p-4 flex flex-col justify-between font-sans text-xs">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-300 dark:border-slate-800">
            <div className="h-5 w-5 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-xs">f</div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-150">Accounts Center</p>
              <p className="text-[9px] text-slate-500 font-mono">accountscenter.facebook.com</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200/80 dark:border-slate-880 space-y-2">
            <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-black tracking-widest">Off-Facebook Log Activity</span>
            <p className="font-extrabold text-slate-700 dark:text-slate-200 text-xs pt-1 uppercase">Tracking Integrations Found</p>
            <div className="space-y-1.5 text-[10px] font-mono font-bold tracking-tight">
              <div className="flex justify-between bg-slate-50 dark:bg-slate-900 text-slate-500 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="truncate mr-2">PIXELARENA</span>
                <span className="text-rose-500 shrink-0">14 EVENTS</span>
              </div>
              <div className="flex justify-between bg-slate-50 dark:bg-slate-900 text-slate-500 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="truncate mr-2">PUZZLEQUEST</span>
                <span className="text-rose-500 shrink-0">30 EVENTS</span>
              </div>
            </div>
          </div>
        </div>

        <button className="w-full py-2 bg-blue-600 text-white font-black rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 uppercase tracking-tighter">
          Purge Event Log Records
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-8 shadow-sm space-y-8">
      {/* 90-Day Reset Reminder Banner */}
      {showResetReminder && (
        <div className="p-6 bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-2xl shadow-inner">
              <AlertCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-none">Advertising ID Reset Overdue</p>
              <p className="text-base text-slate-500 dark:text-slate-400 mt-1.5 font-medium">It has been over 90 days. Resetting your ID breaks tracker profiles linked to this device.</p>
            </div>
          </div>
          <button
            onClick={() => handleLaunchTask(JANITOR_TASKS[1])}
            className="px-6 py-3 bg-indigo-600 text-white text-sm font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 shrink-0 active:scale-95 uppercase tracking-tighter"
          >
            Start Reset Guide
          </button>
        </div>
      )}

      {/* Title */}
      <div>
        <h3 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 flex items-center gap-3">
          <Smartphone className="h-6 w-6 text-indigo-500" />
          Account Janitor Module
        </h3>
        <p className="text-base text-slate-500 leading-relaxed max-w-2xl font-medium mt-2">
          Provides explicit routing URIs directly to Android frameworks. Since server-side account blocks require active user login vectors to confirm, we project an transparent Floating System Overlay over the host browser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Task Choice List */}
        <div className="lg:col-span-4 space-y-4">
          <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest leading-none px-1">
            Compliance Targets
          </p>

          <div className="space-y-3">
            {JANITOR_TASKS.map((task) => {
              const isSelected = selectedTask.id === task.id;
              return (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setIsOverlaySimulated(false);
                  }}
                  className={`p-5 rounded-[2rem] border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-xl scale-[1.02]"
                      : "bg-white border-slate-150 text-slate-700 hover:border-slate-350 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest ${
                      isSelected
                        ? "bg-slate-800 text-indigo-400"
                        : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                    }`}>
                      {task.category} SECURITY
                    </span>
                    {isSelected && <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />}
                  </div>
                  <p className="font-extrabold text-sm truncate leading-snug">{task.title}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected target task workspace */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Diagnostic overview card */}
          <div className="md:col-span-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-850 flex flex-col justify-between gap-6 shadow-inner">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">Compliance Priority</p>
                <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight">{selectedTask.title}</h4>
              </div>

              <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {selectedTask.description}
              </p>

              <div className="space-y-4 bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-855 shadow-sm">
                <p className="font-black font-mono text-indigo-600 dark:text-indigo-400 text-xs uppercase tracking-widest border-b border-slate-50 dark:border-slate-900 pb-3 mb-4">Checklist Action Plan:</p>
                <div className="space-y-3 font-sans text-base text-slate-600 dark:text-slate-400 font-medium">
                  {selectedTask.steps.map((step, sIdx) => (
                    <div key={sIdx} className="flex space-x-3 items-start">
                      {isOverlaySimulated && currentStepIndex > sIdx ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-500 mt-0.5 shrink-0" />
                      ) : (
                        <span className={`font-mono text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 shrink-0 ${isOverlaySimulated && currentStepIndex === sIdx ? "bg-indigo-600 border-indigo-600 text-white font-black" : "border-slate-200 text-slate-400 font-bold"}`}>{sIdx + 1}</span>
                      )}
                      <p className={isOverlaySimulated && currentStepIndex === sIdx ? "text-slate-900 dark:text-white font-black" : ""}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => handleLaunchTask(selectedTask)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-500/20 cursor-pointer flex items-center justify-center space-x-2 transition-all active:scale-95 uppercase tracking-tighter"
              >
                <span>Launch Tutorial</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <a
                href={selectedTask.canonicalUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 dark:bg-slate-950 dark:text-slate-400 dark:hover:text-slate-200 dark:border-slate-800 font-bold text-sm rounded-2xl text-center flex items-center justify-center space-x-2 transition-all active:scale-95 uppercase tracking-tighter"
              >
                <span>Launch Settings</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Interactive Screen Mockup representing the Device and Overlay Guide */}
          <div className="md:col-span-6 border-4 border-slate-300 dark:border-slate-800 rounded-[28px] overflow-hidden bg-slate-950 w-full max-w-[270px] mx-auto min-h-[440px] flex flex-col relative shadow-md">
            {/* Phone Top Speaker and Camera pill */}
            <div className="h-6 bg-slate-950 flex items-center justify-center relative">
              <div className="h-3.5 w-16 bg-slate-900 rounded-full flex items-center justify-around px-2 border border-slate-850">
                <div className="h-1 w-1 bg-indigo-500 rounded-full"></div>
                <div className="h-1 w-6 bg-slate-700 rounded-full"></div>
              </div>
            </div>

            {/* Simulated Android Screen Viewport */}
            <div className="flex-1 bg-white relative">
              {renderBrowserMockupContent()}

              {/* Secure application-overlay layer representation (TYPE_APPLICATION_OVERLAY) */}
              {isOverlaySimulated && (
                <div className="absolute inset-x-2 bottom-4 bg-slate-900/95 text-white p-3 rounded-lg border border-indigo-500 shadow-xl z-20 font-sans text-[10px] space-y-2 animate-fade-in pr-2 transform transition-transform scale-100">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-700">
                    <div className="flex items-center space-x-1 leading-none text-[8.5px] uppercase font-mono tracking-widest text-indigo-400">
                      <Star className="h-3 w-3 text-indigo-400 fill-indigo-400" />
                      <span>AuditAd Overlay Helper</span>
                    </div>
                    <span className="text-2xs font-mono font-semibold px-1 rounded bg-indigo-900 text-indigo-200 uppercase scale-90">LIVE VIEW</span>
                  </div>

                  <p className="leading-relaxed font-bold text-slate-100">
                     Step {currentStepIndex + 1} of {selectedTask.steps.length}:
                  </p>
                  
                  <p className="text-slate-200 font-mono text-[9px] leading-snug bg-slate-950 p-1 rounded border border-slate-800">
                    {selectedTask.steps[currentStepIndex]}
                  </p>

                  <div className="flex justify-between items-center pt-1.5">
                    <button
                      onClick={() => setIsOverlaySimulated(false)}
                      className="text-[9px] font-bold text-rose-450 hover:text-rose-400"
                    >
                      Close Assist
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 rounded font-bold text-[9px] text-white flex items-center space-x-0.5 transition-colors"
                    >
                      <span>{currentStepIndex === selectedTask.steps.length - 1 ? (selectedTask.id === "g-adid" ? "Complete Reset" : "Start Over") : "Advance Step"}</span>
                      <ArrowRight className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Android Navigation bar representing physical phone footprint */}
            <div className="h-5 bg-slate-950 flex justify-center items-center">
              <div className="h-1 w-24 bg-slate-750 rounded-full"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  );
}

