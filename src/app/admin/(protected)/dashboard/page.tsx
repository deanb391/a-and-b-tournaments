"use client";

import { useEffect, useState } from "react";
import { Users, Trophy, Activity } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalRegistrations: 0, activeCompetitions: 0 });
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardStats, recentRegs] = await Promise.all([
          apiClient.dashboard.getStats(),
          apiClient.registrations.get(5, 0)
        ]);
        setStats(dashboardStats);
        setRecentRegistrations(recentRegs);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: "Total Registrations", value: stats.totalRegistrations, icon: <Users size={20} />, sub: "All-time sign-ups" },
    { label: "Active Competitions", value: stats.activeCompetitions,  icon: <Trophy size={20} />, sub: "Currently active or upcoming" },
    { label: "Analytics",           value: "—",                       icon: <Activity size={20} />, sub: "Coming soon" },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-black uppercase text-navy tracking-tight">Dashboard</h1>
        <p className="text-navy/45 font-medium text-sm mt-1">Welcome back, Admin.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className={`bg-white border border-navy/10 p-6 rounded-sm shadow-[0_4px_16px_rgba(10,25,47,0.07)] hover:shadow-[0_8px_24px_rgba(10,25,47,0.12)] transition-shadow animate-fade-up-${i + 1}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-navy/30">{stat.icon}</div>
            </div>
            <div className="text-4xl font-black text-navy mb-1">
              {isLoading ? <div className="skeleton h-10 w-20 rounded-sm" /> : stat.value}
            </div>
            <p className="font-bold text-navy/55 text-xs uppercase tracking-wider">{stat.label}</p>
            <p className="text-navy/30 font-medium text-xs mt-1.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Registrations */}
      <div className="bg-white border border-navy/10 rounded-sm shadow-[0_4px_16px_rgba(10,25,47,0.07)] overflow-hidden">
        <div className="px-6 py-4 border-b border-navy/8 flex justify-between items-center">
          <h2 className="text-base font-black uppercase text-navy tracking-wider">Recent Registrations</h2>
          <Link href="/admin/registrations" className="text-xs font-bold text-red uppercase tracking-wider hover:underline">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="border-b border-navy/8 bg-navy/[0.02]">
                <th className="px-6 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em]">Applicant</th>
                <th className="px-6 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em]">Tournament</th>
                <th className="px-6 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em]">Time</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-navy/35 font-bold text-sm">Loading...</td>
                </tr>
              ) : recentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-navy/30 font-bold text-sm">No recent registrations.</td>
                </tr>
              ) : (
                recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-navy/[0.05] hover:bg-navy/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/registrations/${reg.id}`} className="font-bold text-navy hover:text-red transition-colors text-sm block">
                        {reg.team_name}
                      </Link>
                      <span className="text-xs text-navy/40">{reg.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-red/8 text-red px-2.5 py-1 font-bold text-xs uppercase tracking-wider rounded-sm">
                        {reg.competitions?.title || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-navy/40 font-medium text-xs">
                      {formatDistanceToNow(new Date(reg.created_at), { addSuffix: true })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
