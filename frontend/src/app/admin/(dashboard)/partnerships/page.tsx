"use client";

import { useState, useMemo } from "react";
import { useApi } from "@/hooks/useApi";
import {
  getAllPartnershipsAdmin,
  getPartnershipStatsAdmin,
  updatePartnershipStatus,
  PARTNERSHIP_TYPES,
  PARTNERSHIP_STATUSES,
} from "@/services/partnerships.service";
import type { PartnershipInquiry, PartnershipStatus } from "@/services/partnerships.service";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<PartnershipStatus, string> = {
  New:           "bg-blue-100 text-blue-700",
  Contacted:     "bg-yellow-100 text-yellow-700",
  "In Discussion": "bg-purple-100 text-purple-700",
  Approved:      "bg-green-100 text-green-700",
  Rejected:      "bg-red-100 text-red-700",
  Closed:        "bg-surface-container-highest text-outline",
};

const STAT_CARDS = [
  { key: "total",         label: "Total Inquiries",    icon: "inbox",         color: "bg-primary-container text-on-primary-container" },
  { key: "new",           label: "New",                icon: "fiber_new",     color: "bg-blue-100 text-blue-700" },
  { key: "in_discussion", label: "In Discussion",      icon: "forum",         color: "bg-purple-100 text-purple-700" },
  { key: "approved",      label: "Approved",           icon: "verified",      color: "bg-green-100 text-green-700" },
  { key: "closed",        label: "Closed",             icon: "check_circle",  color: "bg-surface-container-highest text-outline" },
] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── Detail Modal ──────────────────────────────────────────────────────────────

function DetailModal({
  inquiry,
  onClose,
  onUpdate,
}: {
  inquiry: PartnershipInquiry;
  onClose: () => void;
  onUpdate: (updated: PartnershipInquiry) => void;
}) {
  const [status, setStatus] = useState<PartnershipStatus>(inquiry.status);
  const [notes, setNotes] = useState(inquiry.internal_notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const updated = await updatePartnershipStatus(inquiry.id, {
        status,
        internal_notes: notes,
      });
      setSaveSuccess(true);
      onUpdate(updated);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="p-6 border-b border-outline-variant flex justify-between items-start bg-surface-container-low">
          <div className="space-y-1 flex-1 min-w-0 pr-4">
            <h3 className="text-xl font-bold text-on-surface truncate">{inquiry.organization_name}</h3>
            <p className="text-sm text-on-surface-variant">Submitted {formatDateTime(inquiry.created_at)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-variant/20 rounded-full transition-colors text-on-surface-variant flex-shrink-0"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Core Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Contact Person",  value: inquiry.contact_person, icon: "person" },
              { label: "Email",           value: inquiry.email,           icon: "mail" },
              { label: "Phone",           value: inquiry.phone || "—",    icon: "phone" },
              { label: "Partnership Type",value: inquiry.partnership_type,icon: "handshake" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">{icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-outline uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-base font-semibold text-on-surface break-words">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message */}
          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant">
            <p className="text-xs font-medium text-outline uppercase tracking-wide mb-2">Message</p>
            <p className="text-base text-on-surface leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
          </div>

          {/* Status Change */}
          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant space-y-3">
            <p className="text-xs font-medium text-outline uppercase tracking-wide">Status</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PARTNERSHIP_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                    status === s
                      ? "border-primary bg-primary text-white"
                      : "border-outline-variant hover:border-primary text-on-surface-variant"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-outline uppercase tracking-wide flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              Internal Notes (admin only)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              placeholder="Follow-up email sent, meeting scheduled, proposal received…"
              className="w-full p-4 rounded-xl border border-outline bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-sm"
            />
          </div>

          {/* Activity Timeline */}
          {inquiry.activity && inquiry.activity.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-outline uppercase tracking-wide">Activity Timeline</p>
              <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-outline-variant"></div>
                {inquiry.activity.map((event, idx) => (
                  <div key={event.id || idx} className="relative mb-4 last:mb-0">
                    <div className="absolute -left-[18px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-white"></div>
                    <p className="text-sm font-semibold text-on-surface">{event.action}</p>
                    <p className="text-xs text-outline mt-0.5">{formatDateTime(event.created_at)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error / Success */}
          {saveError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <p className="text-sm font-medium">{saveError}</p>
            </div>
          )}
          {saveSuccess && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <p className="text-sm font-medium">Changes saved successfully.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <footer className="p-6 border-t border-outline-variant flex justify-end gap-3 bg-surface-container-low">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-outline-variant rounded-lg font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:shadow-md transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                Saving…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save Changes
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function PartnershipsAdminPage() {
  const { data: inquiries, loading, error, refetch } = useApi(getAllPartnershipsAdmin);
  const { data: stats, refetch: refetchStats } = useApi(getPartnershipStatsAdmin);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedInquiry, setSelectedInquiry] = useState<PartnershipInquiry | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filtered list
  const filtered = useMemo(() => {
    return (inquiries ?? []).filter(i => {
      const matchSearch =
        !search ||
        i.organization_name.toLowerCase().includes(search.toLowerCase()) ||
        i.contact_person.toLowerCase().includes(search.toLowerCase()) ||
        i.email.toLowerCase().includes(search.toLowerCase());
      const matchType   = filterType   === "All" || i.partnership_type === filterType;
      const matchStatus = filterStatus === "All" || i.status           === filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  }, [inquiries, search, filterType, filterStatus]);

  const handleQuickStatus = async (inquiry: PartnershipInquiry, newStatus: PartnershipStatus) => {
    setUpdatingId(inquiry.id);
    try {
      await updatePartnershipStatus(inquiry.id, { status: newStatus });
      await Promise.all([refetch(), refetchStats()]);
    } catch {
      // silent — user can use modal for detailed error handling
    } finally {
      setUpdatingId(null);
    }
  };

  const handleModalUpdate = async (updated: PartnershipInquiry) => {
    await Promise.all([refetch(), refetchStats()]);
    // Refresh selected inquiry with latest data
    setSelectedInquiry(updated);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-on-surface">Partner With Us</h1>
          <p className="text-base text-on-surface-variant mt-1">
            Manage partnership inquiries and track the collaboration lifecycle.
          </p>
        </div>
        <button
          onClick={() => { refetch(); refetchStats(); }}
          className="px-4 h-10 border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors flex items-center gap-2 text-on-surface self-start"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {STAT_CARDS.map(card => (
          <div key={card.key} className="bg-surface-container-low p-5 rounded-xl border border-outline-variant hover:border-primary/30 transition-colors">
            <div className={`inline-flex p-2 rounded-lg mb-3 ${card.color}`}>
              <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
            </div>
            <div className="text-2xl font-bold text-on-surface">
              {stats ? stats[card.key] ?? 0 : "—"}
            </div>
            <div className="text-xs font-medium text-on-surface-variant mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search org, contact, email…"
            className="w-full h-10 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">All Types</option>
          {PARTNERSHIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">All Statuses</option>
          {PARTNERSHIP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {(search || filterType !== "All" || filterStatus !== "All") && (
          <button
            onClick={() => { setSearch(""); setFilterType("All"); setFilterStatus("All"); }}
            className="h-10 px-3 text-sm text-primary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-5 border-b border-outline-variant bg-surface-container-low/50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-on-surface">
            Inquiries
            {filtered.length !== (inquiries?.length ?? 0) && (
              <span className="ml-2 text-sm font-normal text-outline">({filtered.length} of {inquiries?.length})</span>
            )}
          </h3>
        </div>

        {loading ? (
          <div className="p-8">
            <LoadingSpinner count={3} message="Loading partnership inquiries…" />
          </div>
        ) : error ? (
          <div className="p-8">
            <ErrorMessage message={error} onRetry={refetch} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-surface-container-low/30 border-b border-outline-variant">
                  {["Organization", "Contact Person", "Email", "Phone", "Partnership Type", "Status", "Submitted", "Actions"].map(col => (
                    <th key={col} className="px-5 py-3.5 text-xs font-semibold text-outline uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {filtered.map(inquiry => (
                  <tr key={inquiry.id} className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-on-surface">{inquiry.organization_name}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant">{inquiry.contact_person}</td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant">{inquiry.email}</td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant">{inquiry.phone || "—"}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium bg-secondary-container/40 text-on-surface px-2 py-1 rounded-full whitespace-nowrap">
                        {inquiry.partnership_type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap ${STATUS_STYLES[inquiry.status]}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-outline whitespace-nowrap">{formatDate(inquiry.created_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* View */}
                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
                          title="View full inquiry"
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">open_in_full</span>
                        </button>

                        {/* Quick status actions */}
                        {inquiry.status !== "Contacted" && inquiry.status !== "Approved" && inquiry.status !== "Rejected" && inquiry.status !== "Closed" && (
                          <button
                            onClick={() => handleQuickStatus(inquiry, "Contacted")}
                            disabled={updatingId === inquiry.id}
                            title="Mark Contacted"
                            className="p-1.5 rounded-lg hover:bg-yellow-100 text-yellow-700 transition-colors disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[18px]">call_made</span>
                          </button>
                        )}
                        {inquiry.status !== "Approved" && inquiry.status !== "Closed" && (
                          <button
                            onClick={() => handleQuickStatus(inquiry, "Approved")}
                            disabled={updatingId === inquiry.id}
                            title="Mark Approved"
                            className="p-1.5 rounded-lg hover:bg-green-100 text-green-700 transition-colors disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[18px]">verified</span>
                          </button>
                        )}
                        {inquiry.status !== "Rejected" && inquiry.status !== "Closed" && (
                          <button
                            onClick={() => handleQuickStatus(inquiry, "Rejected")}
                            disabled={updatingId === inquiry.id}
                            title="Mark Rejected"
                            className="p-1.5 rounded-lg hover:bg-red-100 text-red-700 transition-colors disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[18px]">cancel</span>
                          </button>
                        )}
                        {inquiry.status !== "Closed" && (
                          <button
                            onClick={() => handleQuickStatus(inquiry, "Closed")}
                            disabled={updatingId === inquiry.id}
                            title="Mark Closed"
                            className="p-1.5 rounded-lg hover:bg-surface-container-highest text-outline transition-colors disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[18px]">lock</span>
                          </button>
                        )}

                        {updatingId === inquiry.id && (
                          <span className="material-symbols-outlined animate-spin text-primary text-[18px]">progress_activity</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl block mb-3 opacity-30">inbox</span>
                      <p className="text-base italic">
                        {(inquiries?.length ?? 0) === 0
                          ? "No partnership inquiries yet."
                          : "No results match your current filters."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-5 border-t border-outline-variant bg-surface-container-low/30 flex justify-between items-center">
          <p className="text-sm font-medium text-on-surface-variant">
            Showing {filtered.length} of {inquiries?.length ?? 0} inquiries
          </p>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedInquiry && (
        <DetailModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onUpdate={handleModalUpdate}
        />
      )}
    </div>
  );
}
