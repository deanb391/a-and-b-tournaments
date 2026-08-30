"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

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
    competitions: {
      title: string;
    };
  };
}

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
      if (data.payments) {
        setPayments(data.payments);
      }
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments();
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'success': return <CheckCircle2 size={16} className="text-[#25D366]" />;
      case 'failed': return <XCircle size={16} className="text-red" />;
      default: return <Clock size={16} className="text-yellow-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-navy">Payments</h1>
          <p className="text-navy/60 font-medium">View and manage tournament entry fees.</p>
        </div>
      </div>

      <div className="bg-white border-4 border-navy shadow-[8px_8px_0px_#0A192F] p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <input 
              type="text" 
              placeholder="Search ref, team, or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-offwhite border-2 border-navy/20 px-4 py-2 font-medium text-navy focus:outline-none focus:border-red"
            />
            <button type="submit" className="bg-navy text-offwhite px-4 py-2 font-bold flex items-center gap-2 hover:bg-navy/90">
              <Search size={18} />
              <span className="hidden md:inline">Search</span>
            </button>
          </form>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-navy" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-offwhite border-2 border-navy/20 px-4 py-2 font-bold text-navy focus:outline-none focus:border-red"
            >
              <option value="all">All Statuses</option>
              <option value="success">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-navy">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p className="font-bold tracking-widest uppercase">Loading Payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-20 bg-offwhite border-2 border-dashed border-navy/20">
            <p className="text-navy/50 font-bold text-lg">No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="p-4 font-pixel text-xs">Reference</th>
                  <th className="p-4 font-pixel text-xs">Team / Email</th>
                  <th className="p-4 font-pixel text-xs">Tournament</th>
                  <th className="p-4 font-pixel text-xs">Amount</th>
                  <th className="p-4 font-pixel text-xs">Status</th>
                  <th className="p-4 font-pixel text-xs">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, idx) => (
                  <tr key={payment.id} className={idx % 2 === 0 ? 'bg-offwhite/50' : 'bg-white'}>
                    <td className="p-4 border-b border-navy/10">
                      <span className="font-mono text-xs font-bold text-navy bg-navy/5 px-2 py-1 rounded">
                        {payment.reference}
                      </span>
                    </td>
                    <td className="p-4 border-b border-navy/10">
                      <div className="font-bold text-navy">{payment.registrations.team_name}</div>
                      <div className="text-sm text-navy/60">{payment.registrations.email}</div>
                    </td>
                    <td className="p-4 border-b border-navy/10 font-bold text-navy">
                      {payment.registrations.competitions.title}
                    </td>
                    <td className="p-4 border-b border-navy/10 font-bold text-red">
                      ₦{payment.amount.toLocaleString()}
                    </td>
                    <td className="p-4 border-b border-navy/10">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <span className="font-bold uppercase tracking-wider text-xs">
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 border-b border-navy/10 text-sm font-medium text-navy/70">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
