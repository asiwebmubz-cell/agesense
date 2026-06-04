"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { getAllDonorsAdmin, updateDonorStatusAdmin } from "@/services/donors.service";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";
import type { Donor } from "@/types";

export default function DonorsAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [modalCopied, setModalCopied] = useState(false);

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

  const handleDownloadExcel = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donors/admin/export`, {
        headers: {
          ...getAuthHeaders(),
        }
      });
      if (!response.ok) throw new Error("Excel export failed.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "donors.csv"; // Serving updated CSV format
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download donors CSV/Excel file.");
    }
  };

  const handleOpenDetails = (donor: Donor) => {
    setSelectedDonor(donor);
    setAdminNotes(donor.admin_notes || "");
  };

  const handleStatusChange = async (newStatus: 'Verified' | 'Rejected') => {
    if (!selectedDonor) return;
    setIsUpdating(true);
    try {
      await updateDonorStatusAdmin(selectedDonor.id, {
        status: newStatus,
        admin_notes: adminNotes
      });
      refetch();
      setSelectedDonor(prev => prev ? { 
        ...prev, 
        payment_status: newStatus, 
        admin_notes: adminNotes,
        last_status_change_at: new Date().toISOString()
      } : null);
      alert(`Donation status successfully marked as ${newStatus}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update status.";
      alert(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  // Metrics Calculations (Database aggregate mirrors calculated on array payload)
  const totalDonationsCount = donors?.length || 0;
  const verifiedDonors = donors?.filter(d => d.payment_status === 'Verified') || [];
  const verifiedDonationAmount = verifiedDonors.reduce((sum, d) => sum + Number(d.amount), 0);
  const avgDonation = verifiedDonors.length > 0 ? (verifiedDonationAmount / verifiedDonors.length) : 0;
  
  const pendingCount = donors?.filter(d => d.payment_status === 'Pending').length || 0;
  const verifiedCount = verifiedDonors.length;
  const rejectedCount = donors?.filter(d => d.payment_status === 'Rejected').length || 0;

  const filteredDonors = (donors || []).filter(donor => {
    const matchesSearch = 
      (donor.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
      (donor.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donor.transaction_id || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || donor.payment_status === statusFilter;
    const matchesMethod = methodFilter === "all" || donor.payment_method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleModalCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setModalCopied(true);
    setTimeout(() => setModalCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-on-surface">Donor Records</h1>
          <p className="text-base text-on-surface-variant mt-1">Manage and track contributions from our community partners.</p>
        </div>
        {/* Search & Actions Bar */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-60 group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-base group-focus-within:shadow-sm" 
              placeholder="Search by name, email..." 
              type="text" 
            />
          </div>
          <button 
            onClick={() => setIsHistoryOpen(true)}
            aria-label="See donor contribution history"
            className="px-4 h-12 border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors flex items-center gap-2 text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            Logs
          </button>
          <button 
            onClick={handleDownloadExcel}
            aria-label="Download CSV report of donors"
            className="px-4 h-12 bg-primary text-on-primary rounded-lg text-sm font-bold hover:shadow-md transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 items-center bg-surface-container-low p-4 rounded-xl border border-outline-variant/40">
        <span className="text-sm font-bold text-on-surface flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px]">filter_list</span> Filters:
        </span>
        
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="status_filter" className="text-xs font-semibold text-on-surface-variant">Status</label>
          <select
            id="status_filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm outline-none text-on-surface"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Method Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="method_filter" className="text-xs font-semibold text-on-surface-variant">Payment Method</label>
          <select
            id="method_filter"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm outline-none text-on-surface"
          >
            <option value="all">All Methods</option>
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
            <option value="Rocket">Rocket</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between h-28">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Total Donations</span>
          <span className="text-xl font-bold text-on-surface">{totalDonationsCount}</span>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between h-28">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Verified Amount</span>
          <span className="text-xl font-bold text-on-surface">
            {verifiedDonationAmount.toLocaleString("en-US")} BDT
          </span>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between h-28">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Average Donation</span>
          <span className="text-xl font-bold text-on-surface">
            {Math.round(avgDonation).toLocaleString("en-US")} BDT
          </span>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between h-28">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Pending Tasks</span>
          <span className="text-xl font-bold text-yellow-600">{pendingCount}</span>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between h-28">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Verified Counts</span>
          <span className="text-xl font-bold text-green-600">{verifiedCount}</span>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between h-28">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Rejected Counts</span>
          <span className="text-xl font-bold text-red-600">{rejectedCount}</span>
        </div>
      </div>

      {/* Transactions Table Card */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
          <h3 className="text-xl font-semibold text-on-surface">Donation Submissions</h3>
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
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-surface-container-low/30 border-b border-outline-variant">
                  <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider">Donor Name</th>
                  <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider">Email Address</th>
                  <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider text-right">Amount</th>
                  <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {filteredDonors.map((donor) => {
                  const initials = getInitials(donor.name);
                  return (
                    <tr 
                      key={donor.id} 
                      onClick={() => handleOpenDetails(donor)}
                      className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getBgColor(initials)}`}>
                            {initials}
                          </div>
                          <span className="text-base font-semibold text-on-surface group-hover:text-primary transition-colors">{donor.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-base text-on-surface-variant">{donor.email}</td>
                      <td className="px-6 py-4 text-base font-bold text-on-surface text-right">
                        {Number(donor.amount).toLocaleString()} BDT
                      </td>
                      <td className="px-6 py-4 text-base text-on-surface-variant">{donor.payment_method || "—"}</td>
                      <td className="px-6 py-4 text-base font-mono text-outline">{donor.transaction_id || "—"}</td>
                      <td className="px-6 py-4 text-base text-on-surface-variant">
                        {donor.created_at ? new Date(donor.created_at).toLocaleDateString() : ""}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase ${
                          donor.payment_status === 'Verified' 
                            ? 'bg-green-100 text-green-700' 
                            : donor.payment_status === 'Rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {donor.payment_status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filteredDonors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-on-surface-variant">
                      No donors found matching the current search parameters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="p-6 border-t border-outline-variant flex items-center justify-between bg-surface-container-low/30">
          <p className="text-sm font-medium text-on-surface-variant">Showing {filteredDonors.length} entries</p>
        </div>
      </section>

      {/* Details Audit Modal */}
      {selectedDonor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <header className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                  Audit Donation Details
                </h3>
                <p className="text-xs text-on-surface-variant">Verify matching data before selecting action statuses.</p>
              </div>
              <button 
                onClick={() => setSelectedDonor(null)}
                className="p-2 hover:bg-surface-variant/20 rounded-full transition-colors text-on-surface-variant"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Profile Block */}
              <div className="flex items-center gap-4 border-b border-outline-variant pb-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ${getBgColor(getInitials(selectedDonor.name))}`}>
                  {getInitials(selectedDonor.name)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-on-surface">{selectedDonor.name}</h4>
                  <p className="text-sm text-on-surface-variant">{selectedDonor.email}</p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs font-semibold text-on-surface-variant uppercase block">Phone Number</span>
                  <span className="font-medium text-on-surface">{selectedDonor.phone || "—"}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-on-surface-variant uppercase block">Payment Method</span>
                  <span className="font-medium text-on-surface">{selectedDonor.payment_method || "—"}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-on-surface-variant uppercase block">Amount</span>
                  <span className="font-bold text-primary">{Number(selectedDonor.amount).toLocaleString()} BDT</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-on-surface-variant uppercase block">Submission Date</span>
                  <span className="font-medium text-on-surface">
                    {selectedDonor.created_at ? new Date(selectedDonor.created_at).toLocaleString() : ""}
                  </span>
                </div>
                <div className="col-span-2 border-t border-outline-variant/40 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-on-surface-variant uppercase block">Transaction ID</span>
                    <span className="font-mono font-bold text-on-surface">{selectedDonor.transaction_id || "—"}</span>
                  </div>
                  {selectedDonor.transaction_id && (
                    <button
                      onClick={() => handleModalCopy(selectedDonor.transaction_id!)}
                      className="px-3 py-1.5 bg-surface-container-highest border border-outline-variant rounded-lg text-xs font-bold text-on-surface-variant flex items-center gap-1.5 hover:bg-outline-variant/20 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      {modalCopied ? "Copied ✓" : "Copy ID"}
                    </button>
                  )}
                </div>
              </div>

              {/* Status & Auditing Meta */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-on-surface-variant uppercase">Verification Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    selectedDonor.payment_status === 'Verified' 
                      ? 'bg-green-100 text-green-700' 
                      : selectedDonor.payment_status === 'Rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedDonor.payment_status}
                  </span>
                </div>
                
                {selectedDonor.payment_status !== 'Pending' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Verified By</span>
                      <span className="font-semibold text-on-surface">{selectedDonor.verified_by || "System"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Verified At</span>
                      <span className="font-semibold text-on-surface">
                        {selectedDonor.verified_at ? new Date(selectedDonor.verified_at).toLocaleString() : ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Last Status Change At</span>
                      <span className="font-semibold text-on-surface">
                        {selectedDonor.last_status_change_at ? new Date(selectedDonor.last_status_change_at).toLocaleString() : ""}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Admin Notes Section */}
              <div className="space-y-2">
                <label htmlFor="modal_notes" className="text-sm font-bold text-on-surface">Admin Internal Notes</label>
                <textarea
                  id="modal_notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  disabled={selectedDonor.payment_status !== 'Pending'}
                  placeholder="e.g. Verified transaction matching BRAC bank logs..."
                  className="w-full p-3 border border-outline-variant rounded-xl bg-surface-container-lowest text-sm text-on-surface outline-none focus:border-primary disabled:bg-surface-container-low transition-all h-24"
                />
              </div>
            </div>

            {/* Action Bar */}
            <footer className="p-6 border-t border-outline-variant flex justify-between bg-surface-container-low">
              <button 
                onClick={() => setSelectedDonor(null)}
                className="px-5 py-2.5 border border-outline-variant font-bold rounded-lg text-sm hover:bg-surface-variant/20 transition-all text-on-surface"
              >
                Close Audit
              </button>
              
              {selectedDonor.payment_status === 'Pending' && (
                <div className="flex gap-2">
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange("Rejected")}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm hover:shadow transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span> Reject
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange("Verified")}
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm hover:shadow transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span> Verify
                  </button>
                </div>
              )}
            </footer>
          </div>
        </div>
      )}

      {/* See History Logs Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <header className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span>
                  Donor Transactions History Logs
                </h3>
                <p className="text-sm text-on-surface-variant font-medium">All logged transactions including failed and pending attempts.</p>
              </div>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="p-2 hover:bg-surface-variant/20 rounded-full transition-colors text-on-surface-variant"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            
            <div className="p-6 overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant text-sm font-bold text-outline">
                    <th className="pb-3">Donor Name</th>
                    <th className="pb-3">Email Address</th>
                    <th className="pb-3 text-right">Amount</th>
                    <th className="pb-3">Method</th>
                    <th className="pb-3">Transaction ID</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {donors?.map((d) => (
                    <tr key={d.id} className="text-sm">
                      <td className="py-3 font-semibold text-on-surface">{d.name}</td>
                      <td className="py-3 text-on-surface-variant">{d.email}</td>
                      <td className="py-3 font-bold text-on-surface text-right">{Number(d.amount).toLocaleString()} BDT</td>
                      <td className="py-3 text-on-surface-variant">{d.payment_method || '—'}</td>
                      <td className="py-3 text-outline font-mono">{d.transaction_id || '—'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          d.payment_status === 'Verified' 
                            ? 'bg-green-100 text-green-700' 
                            : d.payment_status === 'Rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {d.payment_status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-outline">
                        {d.created_at ? new Date(d.created_at).toLocaleString() : ''}
                      </td>
                    </tr>
                  ))}
                  {(!donors || donors.length === 0) && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-on-surface-variant italic">
                        No transactions logged in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <footer className="p-6 border-t border-outline-variant flex justify-end bg-surface-container-low">
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:shadow-md transition-all"
              >
                Close Logs
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
