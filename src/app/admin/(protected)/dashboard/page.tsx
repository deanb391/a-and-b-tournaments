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
    { label: "Total Registrations", value: stats.totalRegistrations.toString(), icon: <Users size={24} />, change: "All time sign-ups" },
    { label: "Active Competitions", value: stats.activeCompetitions.toString(), icon: <Trophy size={24} />, change: "Currently active or upcoming" },
    { label: "Platform Visits", value: "12.4K", icon: <Activity size={24} />, change: "Peak traffic yesterday (Static)" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase text-navy">Dashboard Overview</h1>
        <p className="text-navy/60 font-bold">Welcome back, Admin.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white border-4 border-navy p-6 shadow-[6px_6px_0px_#0A192F]">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red/10 text-red rounded-sm">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-4xl font-black text-navy mb-1">{isLoading ? "..." : stat.value}</h3>
            <p className="font-bold text-navy/70 uppercase text-sm tracking-wider">{stat.label}</p>
            <p className="text-red font-bold text-xs mt-4">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white border-4 border-navy shadow-[6px_6px_0px_#0A192F]">
        <div className="p-6 border-b-4 border-navy bg-navy/5 flex justify-between items-center">
          <h2 className="text-xl font-black uppercase text-navy">Recent Registrations</h2>
          <Link href="/admin/registrations" className="text-sm font-bold text-red hover:underline">View All</Link>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-4 border-navy bg-white">
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Applicant</th>
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Tournament</th>
                <th className="p-4 font-bold text-navy uppercase tracking-wider text-sm">Time</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-navy font-bold">Loading...</td>
                </tr>
              ) : recentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-navy/50 font-bold">No recent registrations.</td>
                </tr>
              ) : (
                recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="border-b-2 border-navy/10 hover:bg-navy/5 transition-colors">
                    <td className="p-4">
                      <Link href={`/admin/registrations/${reg.id}`} className="font-bold text-navy hover:text-red transition-colors block">
                        {reg.team_name}
                      </Link>
                      <p className="text-sm text-navy/60">{reg.email}</p>
                    </td>
                    <td className="p-4">
                      <span className="bg-red/10 text-red px-3 py-1 font-bold text-sm uppercase tracking-wider">
                        {reg.competitions?.title || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-4 text-navy/60 font-bold text-sm">
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
