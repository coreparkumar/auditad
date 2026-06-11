/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { DivideIcon as LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  isActive?: boolean;
  onClick?: () => void;
  id?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  isActive,
  onClick,
  id
}: MetricCardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative p-5 rounded-xl border transition-all duration-300 ${
        onClick ? "cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-sm" : ""
      } ${
        isActive
          ? "bg-slate-50 border-slate-900 dark:bg-slate-900/50 dark:border-slate-100"
          : "bg-white border-slate-100 dark:bg-slate-950 dark:border-slate-800"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-mono text-slate-400 uppercase tracking-widest leading-none font-bold">
            {title}
          </p>
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-extrabold tracking-tighter text-app-text-light dark:text-app-text-dark">
              {value}
            </span>
            {trend && (
              <span
                className={`text-sm font-mono font-bold tracking-tight ${
                  trend.isPositive
                    ? "text-emerald-500"
                    : "text-rose-500"
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-500 dark:text-slate-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
