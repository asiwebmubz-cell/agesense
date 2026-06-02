"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { getAllDonorsAdmin } from "@/services/donors.service";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function DonorsAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: donors, loading, error, refetch } = useApi(getAllDonorsAdmin);

  const getInitials = (name: string) => {
    if (!name) return "D";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getBgColor = (initials: string) => {
    const charCode = initials.charCodeAt(0) || 0;
    if (charCode % 3 === 0) return "bg-secondary-container text-on-secondary-container";
    if (charCode % 3 === 1) return "bg-primary-container text-on-primary-container";
    return "bg-tertiary-fixed text-on-tertiary-fixed";
  };

  const completedDonors = donors?.filter(d => d.payment_status === 'Completed') || [];
  const totalRevenue = completedDonors.reduce((sum, d) => sum + Number(d.amount), 0);
  const activeDonorsCount = donors?.length || 0;
  const avgDonation = activeDonorsCount > 0 ? (totalRevenue / activeDonorsCount) : 0;

  const filteredDonors = (donors || []).filter(donor => 
    (donor.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (donor.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (donor.transaction_id || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-on-surface">Donor Records</h1>
          <p className="text-base text-on-surface-variant mt-1">Manage and track contributions from our community partners.</p>
        </div>
        {/* Search Bar */}
        <div className="relative w-full md:w-96 group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-base group-focus-within:shadow-sm" 
            placeholder="Search by name, email or TXN ID..." 
            type="text" 
          />
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-between h-32 hover:border-primary/30 transition-colors">
          <span className="text-sm font-medium text-secondary uppercase tracking-wider">Total Revenue</span>
          <span className="text-xl font-semibold text-on-surface">
            ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-between h-32 hover:border-primary/30 transition-colors">
          <span className="text-sm font-medium text-secondary uppercase tracking-wider">Total Records</span>
          <span className="text-xl font-semibold text-on-surface">{activeDonorsCount}</span>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-between h-32 hover:border-primary/30 transition-colors">
          <span className="text-sm font-medium text-secondary uppercase tracking-wider">Avg Donation</span>
          <span className="text-xl font-semibold text-on-surface">
            ${avgDonation.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Transactions Table Card */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
          <h3 className="text-xl font-semibold text-on-surface">Recent Donations</h3>
          <div className="flex gap-2">
            <button onClick={() => refetch()} className="p-2 hover:bg-surface-variant/20 rounded-lg transition-colors border border-outline-variant" title="Refresh">
              <span className="material-symbols-outlined text-on-surface-variant">refresh</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8">
            <LoadingSpinner count={3} message="Loading donor entries..." />
          </div>
        ) : error ? (
          <div className="p-8">
            <ErrorMessage message={error} onRetry={refetch} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-low/30 border-b border-outline-variant">
                  <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider">Donor Name</th>
                  <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider">Email Address</th>
                  <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider text-right">Amount</th>
                  <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {filteredDonors.map((donor) => {
                  const initials = getInitials(donor.name);
                  return (
                    <tr key={donor.id} className="hover:bg-surface-container-low transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getBgColor(initials)}`}>
                            {initials}
                          </div>
                          <span className="text-base font-semibold text-on-surface">{donor.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-base text-on-surface-variant">{donor.email}</td>
                      <td className="px-6 py-4 text-base font-bold text-on-surface text-right">
                        ${Number(donor.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-base font-mono text-outline">{donor.transaction_id || "—"}</td>
                      <td className="px-6 py-4 text-base text-on-surface-variant">
                        {donor.created_at ? new Date(donor.created_at).toLocaleDateString() : ""}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase ${
                          donor.payment_status === 'Completed' 
                            ? 'bg-green-100 text-green-700' 
                            : donor.payment_status === 'Failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-surface-container-highest text-outline'
                        }`}>
                          {donor.payment_status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filteredDonors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">
                      No donors found matching &quot;{searchTerm}&quot;.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination details */}
        <div className="p-6 border-t border-outline-variant flex items-center justify-between bg-surface-container-low/30">
          <p className="text-sm font-medium text-on-surface-variant">Showing {filteredDonors.length} entries</p>
        </div>
      </section>
    </div>
  );
}
