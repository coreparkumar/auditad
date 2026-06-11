/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DNSLog {
  id: string;
  timestamp: string; // HH:MM:ss.SSS
  domain: string;
  app: string;
  appPackage: string;
  category: "Ads" | "Analytics" | "Tracker" | "Allowed";
  status: "Blocked" | "Allowed";
  protocol: "UDP" | "TCP";
  port: number;
  latencyMs: number;
}

export interface AuditedApp {
  id: string;
  name: string;
  packageName: string;
  version: string;
  targetSdk: number;
  riskScore: number; // 0 to 100
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  permissions: string[];
  trackersFound: string[];
  backgroundActivities: string[];
  description: string;
  link?: string;
}

export interface JanitorTask {
  id: string;
  title: string;
  description: string;
  canonicalUrl: string;
  intentUri?: string;
  actionVector: string;
  steps: string[];
  category: "Google" | "Meta";
}

export interface AuditResult {
  riskScore: number;
  summary: string;
  liabilities: Array<{
    name: string;
    level: "Low" | "Medium" | "High";
    explanation: string;
  }>;
  mitigations: string[];
  dnsHostnameSuggestion: string;
}
