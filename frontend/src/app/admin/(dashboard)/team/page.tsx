"use client";

import { useState, useEffect, useCallback } from "react";
import type { TeamMember, Branch, CommitteeType } from "@/types";
import {
  getAllTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/services/team.service";
import { getAllBranches } from "@/services/branches.service";
import { uploadImage } from "@/services/programs.service";

export default function TeamAdminPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Current logged in user info (for branch scoping context)
  const [userRole, setUserRole] = useState<string>("");
  const [userBranchId, setUserBranchId] = useState<string | null>(null);

  // Form states
  const [editId, setEditId] = useState<string | null>(null);
  const [branchId, setBranchId] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [committee, setCommittee] = useState<CommitteeType>("Executive Committee");
  const [photoUrl, setPhotoUrl] = useState("");
  const [biography, setBiography] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [hierarchyLevel, setHierarchyLevel] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter state
  const [filterBranch, setFilterBranch] = useState("");
  const [filterCommittee, setFilterCommittee] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [teamData, branchData] = await Promise.all([
        getAllTeam(),
        getAllBranches().catch(() => []),
      ]);
      setTeam(teamData);
      setBranches(branchData);

      // Check current user
      const userStr = localStorage.getItem("admin_user");
      if (userStr) {
        const u = JSON.parse(userStr);
        setUserRole(u.role || "");
        setUserBranchId(u.branch_id || null);
        if (u.role === "branch_manager" && u.branch_id) {
          setBranchId(u.branch_id);
        } else if (branchData.length > 0 && !branchId) {
          setBranchId(branchData[0].id);
        }
      } else if (branchData.length > 0 && !branchId) {
        setBranchId(branchData[0].id);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load team members.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetForm = () => {
    setEditId(null);
    if (userRole !== "branch_manager" && branches.length > 0) {
      setBranchId(branches[0].id);
    }
    setName("");
    setPosition("");
    setCommittee("Executive Committee");
    setPhotoUrl("");
    setBiography("");
    setDisplayOrder(0);
    setHierarchyLevel(1);
    setIsActive(true);
    setError("");
  };

  const handleEdit = (m: TeamMember) => {
    setEditId(m.id);
    setBranchId(m.branch_id);
    setName(m.name);
    setPosition(m.position);
    setCommittee(m.committee);
    setPhotoUrl(m.photo_url || "");
    setBiography(m.biography || "");
    setDisplayOrder(m.display_order);
    setHierarchyLevel(m.hierarchy_level);
    setIsActive(m.is_active);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      // Specify context=team query param if desired
      const url = await uploadImage(file);
      setPhotoUrl(url);
    } catch (err: any) {
      setError(err?.message || "Photo upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !position.trim() || !branchId) {
      setError("Name, position, and branch are required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        branch_id: branchId,
        name: name.trim(),
        position: position.trim(),
        committee,
        photo_url: photoUrl.trim() || null,
        biography: biography.trim() || null,
        display_order: Number(displayOrder) || 0,
        hierarchy_level: Number(hierarchyLevel) || 1,
        is_active: isActive,
      };

      if (editId) {
        await updateTeamMember(editId, payload);
        setSuccess("Team member updated successfully.");
      } else {
        await createTeamMember(payload);
        setSuccess("Team member added successfully.");
      }

      resetForm();
      loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to save team member.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteTeamMember(deleteTarget.id);
      setDeleteTarget(null);
      setSuccess(`Team member "${deleteTarget.name}" deleted.`);
      loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to delete team member.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTeam = team.filter((m) => {
    if (filterBranch && m.branch_id !== filterBranch) return false;
    if (filterCommittee && m.committee !== filterCommittee) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-primary">Team Members &amp; Governance</h1>
        <p className="text-sm text-surface-variant">
          Manage Executive Committee and Advisory Board members across all regional branches.
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
          {editId ? "Edit Team Member" : "Add Team Member"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Branch / Chapter *
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                disabled={userRole === "branch_manager"}
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-75"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.division})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Ayesha Rahman"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Position / Designation *
              </label>
              <input
                type="text"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. President / Senior Medical Advisor"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Committee *
              </label>
              <select
                value={committee}
                onChange={(e) => setCommittee(e.target.value as CommitteeType)}
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Executive Committee">Executive Committee</option>
                <option value="Advisory Board">Advisory Board</option>
              </select>
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

            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Hierarchy Level (1 = Highest)
              </label>
              <input
                type="number"
                min={1}
                value={hierarchyLevel}
                onChange={(e) => setHierarchyLevel(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-variant mb-1">
              Short Biography / Overview
            </label>
            <textarea
              rows={3}
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              placeholder="Background in healthcare, social welfare, or community service..."
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Photo Upload via Cloudinary */}
          <div>
            <label className="block text-xs font-semibold text-surface-variant mb-1">
              Portrait Photo
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploadingImage}
                className="text-xs text-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-on-primary hover:file:bg-primary/90 cursor-pointer"
              />
              {uploadingImage && <span className="text-xs text-primary animate-pulse">Uploading photo...</span>}
            </div>
            {photoUrl && (
              <div className="mt-2 flex items-center gap-3">
                <img src={photoUrl} alt="Preview" className="h-16 w-16 object-cover rounded-full border shadow-sm" />
                <button
                  type="button"
                  onClick={() => setPhotoUrl("")}
                  className="text-xs text-error hover:underline"
                >
                  Remove Photo
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActiveMember"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
            />
            <label htmlFor="isActiveMember" className="text-sm font-medium text-on-surface cursor-pointer">
              Active (show in public governance lists)
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/30">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
            >
              {submitting ? "Saving..." : editId ? "Update Member" : "Add Member"}
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

      {/* Filter and Table Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-outline-variant flex flex-wrap gap-4 justify-between items-center">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-base font-bold text-on-surface">
              Team Directory ({filteredTeam.length})
            </h2>
            {branches.length > 0 && userRole !== "branch_manager" && (
              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-outline-variant bg-background text-xs font-medium text-surface-variant"
              >
                <option value="">All Branches</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            )}
            <select
              value={filterCommittee}
              onChange={(e) => setFilterCommittee(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-outline-variant bg-background text-xs font-medium text-surface-variant"
            >
              <option value="">All Committees</option>
              <option value="Executive Committee">Executive Committee</option>
              <option value="Advisory Board">Advisory Board</option>
            </select>
          </div>

          <button
            onClick={loadData}
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">refresh</span> Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-surface-variant">Loading team members...</div>
        ) : filteredTeam.length === 0 ? (
          <div className="p-8 text-center text-sm text-surface-variant">No team members found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low text-xs uppercase font-bold text-surface-variant">
                <tr>
                  <th className="px-6 py-3">Member</th>
                  <th className="px-6 py-3">Branch</th>
                  <th className="px-6 py-3">Committee</th>
                  <th className="px-6 py-3">Order / Level</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filteredTeam.map((m) => (
                  <tr key={m.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-on-surface">
                      <div className="flex items-center gap-3">
                        {m.photo_url ? (
                          <img src={m.photo_url} alt="" className="w-9 h-9 rounded-full object-cover border" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {m.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div>{m.name}</div>
                          <div className="text-xs font-normal text-surface-variant">{m.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-surface-variant">
                      {m.branch_name || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-surface-container text-on-surface">
                        {m.committee}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-surface-variant">
                      Order: {m.display_order} | Lvl: {m.hierarchy_level}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                          m.is_active
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-surface-variant/20 text-surface-variant"
                        }`}
                      >
                        {m.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(m)}
                          className="p-1.5 hover:bg-surface-container rounded text-primary transition-colors"
                          title="Edit member"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(m)}
                          className="p-1.5 hover:bg-error/10 rounded text-error transition-colors"
                          title="Delete member"
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
            <h3 className="text-lg font-bold text-on-surface mb-2">Delete Team Member?</h3>
            <p className="text-sm text-surface-variant mb-6">
              Are you sure you want to remove <strong>{deleteTarget.name}</strong> from the team directory? This cannot be undone.
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
