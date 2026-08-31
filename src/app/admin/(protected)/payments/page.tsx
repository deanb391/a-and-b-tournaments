"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, CheckCircle2, XCircle, Clock, ChevronDown } from "lucide-react";

interface Payment {
  id: string;
  registration_id: string;
  reference: string;
  amount: number;
  status: string;
  created_at: string;
  registrations: {
    team_name: string;
    email: string;
    competitions: { title: string };
  };
}

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "success", label: "Successful" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const fetchPayments = async (searchQuery = search) => {
    setIsLoading(true);
    try {
      let url = `/api/payments?limit=50`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (statusFilter !== "all") url += `&status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.payments) setPayments(data.payments);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full">
            <CheckCircle2 size={10} /> Success
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 bg-red/8 text-red px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full">
            <XCircle size={10} /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-600 px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full">
            <Clock size={10} /> Pending
          </span>
        );
    }
  };

  const totalSuccessful = payments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-up" style={{ marginBottom: 70 }}>
      <div>
        <h1 className="text-3xl font-black uppercase text-navy tracking-tight">Payments</h1>
        <p className="text-navy/45 font-medium text-sm mt-1">View and manage tournament entry fees.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex bg-white border border-navy/12 rounded-sm shadow-sm overflow-hidden flex-1">
          <div className="px-4 flex items-center justify-center text-navy/30 border-r border-navy/10">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search ref, team, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchPayments()}
            className="flex-1 px-4 py-3 bg-transparent text-navy font-medium text-sm focus:outline-none placeholder:text-navy/25"
          />
          <button
            onClick={() => fetchPayments()}
            className="px-4 font-bold text-xs uppercase tracking-wider text-navy/50 hover:text-red transition-colors border-l border-navy/10"
          >
            Search
          </button>
        </div>

        {/* Custom status select */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-navy/12 rounded-sm px-4 py-3 pr-10 font-bold text-sm text-navy focus:outline-none focus:border-red cursor-pointer w-full sm:w-44 shadow-sm"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-navy/10 rounded-sm shadow-[0_4px_16px_rgba(10,25,47,0.07)] overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-navy/35">
            <Loader2 className="animate-spin mb-3" size={36} />
            <p className="font-bold text-sm uppercase tracking-wider">Loading Payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-navy/30 font-bold text-base">No payments found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-navy/8 bg-navy/[0.02]">
                    <th className="px-5 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em]">Reference</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em]">Team / Email</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em] hidden md:table-cell">Tournament</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em]">Amount</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em]">Status</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-navy/40 uppercase tracking-[0.15em] hidden sm:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, idx) => (
                    <tr
                      key={payment.id}
                      className={`border-b border-navy/[0.05] hover:bg-navy/[0.02] transition-colors ${idx % 2 === 0 ? "" : "bg-navy/[0.01]"
                        }`}
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-bold text-navy bg-navy/5 px-2 py-1 rounded-sm">
                          {payment.reference}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-navy text-sm">{payment.registrations?.team_name}</div>
                        <div className="text-xs text-navy/40">{payment.registrations?.email}</div>
                      </td>
                      <td className="px-5 py-4 font-medium text-navy/70 text-sm hidden md:table-cell">
                        {payment.registrations?.competitions?.title}
                      </td>
                      <td className="px-5 py-4 font-black text-navy text-sm">
                        ₦{(payment.amount || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-4">{getStatusBadge(payment.status)}</td>
                      <td className="px-5 py-4 text-xs font-medium text-navy/40 hidden sm:table-cell">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary footer */}
            <div className="px-5 py-3 border-t border-navy/8 bg-navy/[0.02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-navy/40 uppercase tracking-wider">
                {payments.length} transaction{payments.length !== 1 ? "s" : ""}
              </span>
              <span className="text-sm font-black text-navy">
                Total Successful:{" "}
                <span className="text-red">₦{totalSuccessful.toLocaleString()}</span>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
