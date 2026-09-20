"use client";

import { useState, useEffect, useCallback } from "react";
import type { Policy } from "@/types";
import {
  getAllPolicies,
  createPolicy,
  updatePolicy,
  deletePolicy,
} from "@/services/policies.service";

export default function PoliciesAdminPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Governance");
  const [description, setDescription] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Policy | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllPolicies();
      setPolicies(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load policies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setCategory("Governance");
    setDescription("");
    setDocumentUrl("");
    setIsPublished(true);
    setDisplayOrder(0);
    setError("");
  };

  const handleEdit = (p: Policy) => {
    setEditId(p.id);
    setTitle(p.title);
    setCategory(p.category || "Governance");
    setDescription(p.description || "");
    setDocumentUrl(p.document_url || "");
    setIsPublished(p.is_published);
    setDisplayOrder(p.display_order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: title.trim(),
        category: category.trim() || null,
        description: description.trim() || null,
        document_url: documentUrl.trim() || null,
        is_published: isPublished,
        display_order: Number(displayOrder) || 0,
      };

      if (editId) {
        await updatePolicy(editId, payload);
        setSuccess("Policy updated successfully.");
      } else {
        await createPolicy(payload);
        setSuccess("Policy added successfully.");
      }

      resetForm();
      loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to save policy.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deletePolicy(deleteTarget.id);
      setDeleteTarget(null);
      setSuccess(`Policy "${deleteTarget.title}" deleted.`);
      loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to delete policy.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-primary">Organizational Policies</h1>
        <p className="text-sm text-surface-variant">
          Manage governance policies, safeguarding protocols, volunteer codes of conduct, and public disclosures.
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
          {editId ? "Edit Policy" : "Add Policy Document"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Policy Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Elderly Safeguarding & Protection Policy"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Governance">Governance</option>
                <option value="Safeguarding">Safeguarding &amp; Care</option>
                <option value="Finance & Ethics">Finance &amp; Ethics</option>
                <option value="Volunteer & Staff">Volunteer &amp; Staff</option>
                <option value="Privacy & Data">Privacy &amp; Data Protection</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                External Document Download Link
              </label>
              <input
                type="url"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                placeholder="https://drive.google.com/... or official hosted document URL"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
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
              Policy Summary / Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of principles, applicability, and compliance standards..."
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPublishedPolicy"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
            />
            <label htmlFor="isPublishedPolicy" className="text-sm font-medium text-on-surface cursor-pointer">
              Publish policy publicly on /policies
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/30">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
            >
              {submitting ? "Saving..." : editId ? "Update Policy" : "Save Policy"}
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

      {/* Policies Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
          <h2 className="text-base font-bold text-on-surface">Policies Library ({policies.length})</h2>
          <button
            onClick={loadData}
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">refresh</span> Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-surface-variant">Loading policies...</div>
        ) : policies.length === 0 ? (
          <div className="p-8 text-center text-sm text-surface-variant">No policies configured.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low text-xs uppercase font-bold text-surface-variant">
                <tr>
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Policy Title</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Document</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {policies.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-surface-variant">{p.display_order}</td>
                    <td className="px-6 py-4 font-bold text-on-surface">
                      <div>{p.title}</div>
                      {p.description && (
                        <div className="text-xs text-surface-variant truncate max-w-sm font-normal">
                          {p.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="inline-block px-2.5 py-1 rounded bg-surface-container text-on-surface font-medium">
                        {p.category || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {p.document_url ? (
                        <a
                          href={p.document_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary font-medium hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span> Document Link
                        </a>
                      ) : (
                        <span className="text-surface-variant">No URL</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                          p.is_published
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-surface-variant/20 text-surface-variant"
                        }`}
                      >
                        {p.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1.5 hover:bg-surface-container rounded text-primary transition-colors"
                          title="Edit policy"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 hover:bg-error/10 rounded text-error transition-colors"
                          title="Delete policy"
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
            <h3 className="text-lg font-bold text-on-surface mb-2">Delete Policy?</h3>
            <p className="text-sm text-surface-variant mb-6">
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>?
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
