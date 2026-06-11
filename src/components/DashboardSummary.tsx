/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldCheck, Cpu, Activity, CpuIcon } from "lucide-react";
import MetricCard from "./MetricCard";

interface DashboardSummaryProps {
  adsBlocked: number;
  trackersBlocked: number;
  analyticsBlocked: number;
}

export default function DashboardSummary({
  adsBlocked,
  trackersBlocked,
  analyticsBlocked
}: DashboardSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Ad Telemetry Drops"
        value={adsBlocked}
        subtitle="Commercial frames drops"
        trend={{ value: `+${Math.floor(adsBlocked / 6)} total`, isPositive: true }}
        icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
      />
      <MetricCard
        title="Trackers Intercepted"
        value={trackersBlocked}
        subtitle="Cross-app profiling hooks"
        trend={{ value: `+${Math.floor(trackersBlocked / 4)} block`, isPositive: true }}
        icon={<Cpu className="h-5 w-5 text-purple-500" />}
      />
      <MetricCard
        title="Metrics Syncs"
        value={analyticsBlocked}
        subtitle="Silent background uploads"
        trend={{ value: "Safe filtering", isPositive: true }}
        icon={<Activity className="h-5 w-5 text-cyan-500" />}
      />
      <MetricCard
        title="Lookup Speed"
        value="< 1.8ms"
        subtitle="Average pipeline throughput"
        trend={{ value: "Stable Latency", isPositive: true }}
        icon={<CpuIcon className="h-5 w-5 text-indigo-500 animate-pulse" />}
      />
    </div>
  );
}
