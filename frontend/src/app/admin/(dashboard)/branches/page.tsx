"use client";

import { useState, useEffect, useCallback } from "react";
import type { Branch } from "@/types";
import {
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "@/services/branches.service";
import { uploadImage } from "@/services/programs.service";

export default function BranchesAdminPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [division, setDivision] = useState("Dhaka");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllBranches();
      setBranches(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load branches.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetForm = () => {
    setEditId(null);
    setName("");
    setDivision("Dhaka");
    setDescription("");
    setLocation("");
    setImageUrl("");
    setIsActive(true);
    setDisplayOrder(0);
    setError("");
  };

  const handleEdit = (b: Branch) => {
    setEditId(b.id);
    setName(b.name);
    setDivision(b.division);
    setDescription(b.description || "");
    setLocation(b.location || "");
    setImageUrl(b.image_url || "");
    setIsActive(b.is_active);
    setDisplayOrder(b.display_order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err: any) {
      setError(err?.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !division.trim()) {
      setError("Branch name and division are required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: name.trim(),
        division: division.trim(),
        description: description.trim() || null,
        location: location.trim() || null,
        image_url: imageUrl.trim() || null,
        is_active: isActive,
        display_order: Number(displayOrder) || 0,
      };

      if (editId) {
        await updateBranch(editId, payload);
        setSuccess("Branch updated successfully.");
      } else {
        await createBranch(payload);
        setSuccess("Branch created successfully.");
      }

      resetForm();
      loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to save branch.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteBranch(deleteTarget.id);
      setDeleteTarget(null);
      setSuccess(`Branch "${deleteTarget.name}" deleted.`);
      loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to delete branch.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-primary">Regional Chapters &amp; Branches</h1>
        <p className="text-sm text-surface-variant">
          Manage AgeSense branch locations and regional chapters across Bangladesh.
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

      {/* Creation / Editing Form */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-on-surface mb-4">
          {editId ? "Edit Branch" : "Add New Regional Chapter / Branch"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Branch Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajshahi Regional Chapter"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Division / Region *
              </label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Dhaka">Dhaka</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Khulna">Khulna</option>
                <option value="Barisal">Barisal</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Specific Location / Address
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Shaheb Bazar, Rajshahi"
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
              Description / Regional Scope
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of services, objectives, and community presence in this division..."
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Branch Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-surface-variant mb-1">
              Chapter Banner / Photo
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                disabled={uploadingImage}
                className="text-xs text-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-on-primary hover:file:bg-primary/90 cursor-pointer"
              />
              {uploadingImage && <span className="text-xs text-primary animate-pulse">Uploading to Cloudinary...</span>}
            </div>
            {imageUrl && (
              <div className="mt-2 flex items-center gap-2">
                <img src={imageUrl} alt="Branch preview" className="h-16 w-24 object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="text-xs text-error hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActiveBranch"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
            />
            <label htmlFor="isActiveBranch" className="text-sm font-medium text-on-surface cursor-pointer">
              Active branch (visible on public site)
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/30">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
            >
              {submitting ? "Saving..." : editId ? "Update Branch" : "Create Branch"}
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

      {/* Branches Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
          <h2 className="text-base font-bold text-on-surface">Existing Branches ({branches.length})</h2>
          <button
            onClick={loadData}
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">refresh</span> Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-surface-variant">Loading branches...</div>
        ) : branches.length === 0 ? (
          <div className="p-8 text-center text-sm text-surface-variant">No branches found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low text-xs uppercase font-bold text-surface-variant">
                <tr>
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Branch Name</th>
                  <th className="px-6 py-3">Division</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {branches.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-surface-variant">{b.display_order}</td>
                    <td className="px-6 py-4 font-bold text-on-surface">
                      <div className="flex items-center gap-3">
                        {b.image_url ? (
                          <img src={b.image_url} alt="" className="w-8 h-8 rounded-full object-cover border" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {b.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div>{b.name}</div>
                          {b.description && (
                            <div className="text-xs text-surface-variant truncate max-w-xs">{b.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-surface-variant">{b.division}</td>
                    <td className="px-6 py-4 text-xs text-surface-variant">{b.location || "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                          b.is_active
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-surface-variant/20 text-surface-variant"
                        }`}
                      >
                        {b.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(b)}
                          className="p-1.5 hover:bg-surface-container rounded text-primary transition-colors"
                          title="Edit branch"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(b)}
                          className="p-1.5 hover:bg-error/10 rounded text-error transition-colors"
                          title="Delete branch"
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
            <h3 className="text-lg font-bold text-on-surface mb-2">Delete Branch?</h3>
            <p className="text-sm text-surface-variant mb-6">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone. Branches with active team members cannot be deleted.
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
