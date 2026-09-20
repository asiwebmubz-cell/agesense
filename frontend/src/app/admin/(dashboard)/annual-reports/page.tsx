"use client";

import { useState, useEffect, useCallback } from "react";
import type { AnnualReport } from "@/types";
import {
  getAllAnnualReports,
  createAnnualReport,
  updateAnnualReport,
  deleteAnnualReport,
} from "@/services/annual-reports.service";

export default function AnnualReportsAdminPage() {
  const [reports, setReports] = useState<AnnualReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [editId, setEditId] = useState<string | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<AnnualReport | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllAnnualReports();
      setReports(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load annual reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetForm = () => {
    setEditId(null);
    setYear(new Date().getFullYear());
    setTitle("");
    setDescription("");
    setPdfUrl("");
    setIsPublished(true);
    setDisplayOrder(0);
    setError("");
  };

  const handleEdit = (r: AnnualReport) => {
    setEditId(r.id);
    setYear(r.year);
    setTitle(r.title);
    setDescription(r.description || "");
    setPdfUrl(r.pdf_url || "");
    setIsPublished(r.is_published);
    setDisplayOrder(r.display_order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !year) {
      setError("Title and year are required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        year: Number(year),
        title: title.trim(),
        description: description.trim() || null,
        pdf_url: pdfUrl.trim() || null,
        is_published: isPublished,
        display_order: Number(displayOrder) || 0,
      };

      if (editId) {
        await updateAnnualReport(editId, payload);
        setSuccess("Annual report updated successfully.");
      } else {
        await createAnnualReport(payload);
        setSuccess("Annual report created successfully.");
      }

      resetForm();
      loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to save annual report.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteAnnualReport(deleteTarget.id);
      setDeleteTarget(null);
      setSuccess(`Report for ${deleteTarget.year} deleted.`);
      loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to delete annual report.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-primary">Annual Reports</h1>
        <p className="text-sm text-surface-variant">
          Publish annual progress, financial auditing disclosures, and downloadable report links.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{success}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-on-surface mb-4">
          {editId ? "Edit Annual Report" : "Add Annual Report Entry"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Report Year *
              </label>
              <input
                type="number"
                required
                min={2000}
                max={2100}
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Report Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Annual Impact & Financial Report 2025"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                External PDF Download URL
              </label>
              <input
                type="url"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="https://drive.google.com/... or https://dropbox.com/..."
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-surface-variant mt-1">
                Provide a direct downloadable link (Google Drive public share, Dropbox, etc.).
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-variant mb-1">
              Description / Executive Summary
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight key achievements, total elders served, donor transparency remarks..."
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPublishedReport"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
            />
            <label htmlFor="isPublishedReport" className="text-sm font-medium text-on-surface cursor-pointer">
              Publish report publicly on /annual-report
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/30">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
            >
              {submitting ? "Saving..." : editId ? "Update Report" : "Save Report"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 bg-surface-container text-on-surface font-medium rounded-lg hover:bg-surface-container-high transition-colors text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Reports Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
          <h2 className="text-base font-bold text-on-surface">Published Reports Archive ({reports.length})</h2>
          <button
            onClick={loadData}
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">refresh</span> Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-surface-variant">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-sm text-surface-variant">No annual reports configured.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low text-xs uppercase font-bold text-surface-variant">
                <tr>
                  <th className="px-6 py-3">Year</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Download Link</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-primary text-base font-mono">{r.year}</td>
                    <td className="px-6 py-4 font-bold text-on-surface">
                      <div>{r.title}</div>
                      {r.description && (
                        <div className="text-xs text-surface-variant truncate max-w-sm font-normal">
                          {r.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {r.pdf_url ? (
                        <a
                          href={r.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary font-medium hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">download</span> PDF Link
                        </a>
                      ) : (
                        <span className="text-surface-variant">No link provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                          r.is_published
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-surface-variant/20 text-surface-variant"
                        }`}
                      >
                        {r.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(r)}
                          className="p-1.5 hover:bg-surface-container rounded text-primary transition-colors"
                          title="Edit report"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(r)}
                          className="p-1.5 hover:bg-error/10 rounded text-error transition-colors"
                          title="Delete report"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-on-surface mb-2">Delete Annual Report?</h3>
            <p className="text-sm text-surface-variant mb-6">
              Are you sure you want to delete the report for <strong>{deleteTarget.year} ({deleteTarget.title})</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-surface-container text-on-surface font-medium rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-error text-on-error font-bold rounded-lg text-sm hover:bg-error/90"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
