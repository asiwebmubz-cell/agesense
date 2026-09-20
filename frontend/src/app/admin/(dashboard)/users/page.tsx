"use client";

import { useState, useEffect, useCallback } from "react";
import type { AppUser, Branch } from "@/types";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/users.service";
import { getAllBranches } from "@/services/branches.service";
import { getRoles, type RoleWithPermissions } from "@/services/roles.service";
import RolesSection from "./roles-section";

export default function UsersAdminPage() {
  const [tab, setTab] = useState<"users" | "roles">("users");
  const [users, setUsers] = useState<AppUser[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roleOptions, setRoleOptions] = useState<RoleWithPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("marketing");
  const [branchId, setBranchId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, branchData, rolesData] = await Promise.all([
        getAllUsers(),
        getAllBranches().catch(() => []),
        getRoles().catch(() => []),
      ]);
      setUsers(usersData);
      setBranches(branchData);
      setRoleOptions(rolesData.filter((r) => r.assignable));
    } catch (err: any) {
      setError(err?.message || "Failed to load user accounts.");
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
    setEmail("");
    setPassword("");
    setRole("marketing");
    setBranchId("");
    setIsActive(true);
    setError("");
  };

  const handleEdit = (u: AppUser) => {
    setEditId(u.id);
    setName(u.name || "");
    setEmail(u.email);
    setPassword(""); // Leave blank unless changing
    setRole(u.role);
    setBranchId(u.branch_id || "");
    setIsActive(u.is_active);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    if (!editId && (!password || password.length < 8)) {
      setError("Password must be at least 8 characters for a new account.");
      return;
    }

    if (role === "branch_manager" && !branchId) {
      setError("Please select an assigned branch for the Branch Manager.");
      return;
    }

    try {
      setSubmitting(true);
      if (editId) {
        const payload: any = {
          name: name.trim(),
          email: email.trim(),
          role,
          branch_id: role === "branch_manager" ? branchId : null,
          is_active: isActive,
        };
        if (password.trim()) {
          payload.password = password.trim();
        }
        await updateUser(editId, payload);
        setSuccess("User account updated successfully.");
      } else {
        await createUser({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          role,
          branch_id: role === "branch_manager" ? branchId : null,
          is_active: isActive,
        });
        setSuccess("New user account created successfully.");
      }

      resetForm();
      loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to save user account.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      setSuccess(`User ${deleteTarget.email} deleted.`);
      loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to delete user account.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-primary">User Accounts &amp; Access Control</h1>
        <p className="text-sm text-surface-variant">
          Super Admin portal for managing staff credentials, roles, and branch boundaries.
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-outline-variant">
        {([
          { key: "users", label: "Users", icon: "group" },
          { key: "roles", label: "Roles & Permissions", icon: "admin_panel_settings" },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "users" && (
      <>
      {/* Form Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-on-surface mb-4">
          {editId ? "Edit User Account" : "Create New Staff Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Zarif Rahman or Marketing Lead"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@agesense.org"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                {editId ? "New Password (leave blank to keep current)" : "Password (min 8 chars) *"}
              </label>
              <input
                type="password"
                required={!editId}
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Role Assignment *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {roleOptions.length === 0 && (
                  <>
                    <option value="super_admin">Super Admin (Full System Control)</option>
                    <option value="marketing">Marketing (Org-Wide Content Management)</option>
                    <option value="branch_manager">Branch Manager (Branch-Scoped Only)</option>
                  </>
                )}
                {roleOptions.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    {r.name === "super_admin" ? " (Full System Control)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Assigned Branch {role === "branch_manager" && "*"}
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                disabled={role !== "branch_manager"}
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-40"
              >
                <option value="">None / All Branches</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.division})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActiveUser"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
            />
            <label htmlFor="isActiveUser" className="text-sm font-medium text-on-surface cursor-pointer">
              Account is active (can log in to admin dashboard)
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/30">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
            >
              {submitting ? "Saving..." : editId ? "Update Account" : "Create Account"}
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

      {/* Users Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
          <h2 className="text-base font-bold text-on-surface">Registered Users ({users.length})</h2>
          <button
            onClick={loadData}
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">refresh</span> Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-surface-variant">Loading user accounts...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-sm text-surface-variant">No user accounts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low text-xs uppercase font-bold text-surface-variant">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Branch Scope</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-on-surface">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {(u.name || u.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div>{u.name || "Unnamed User"}</div>
                          <div className="text-xs font-normal text-surface-variant font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded ${
                          u.role === "super_admin"
                            ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                            : u.role === "marketing"
                            ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}
                      >
                        {u.role.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-surface-variant">
                      {u.branch_name || (u.role === "branch_manager" ? "Unassigned Branch" : "All Branches (Org-wide)")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                          u.is_active
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-error/10 text-error border border-error/20"
                        }`}
                      >
                        {u.is_active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(u)}
                          className="p-1.5 hover:bg-surface-container rounded text-primary transition-colors"
                          title="Edit user"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="p-1.5 hover:bg-error/10 rounded text-error transition-colors"
                          title="Delete user"
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
            <h3 className="text-lg font-bold text-on-surface mb-2">Delete User Account?</h3>
            <p className="text-sm text-surface-variant mb-6">
              Are you sure you want to delete <strong>{deleteTarget.email}</strong>? They will immediately lose dashboard access and active sessions will be terminated.
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
      </>
      )}

      {tab === "roles" && <RolesSection />}
    </div>
  );
}
