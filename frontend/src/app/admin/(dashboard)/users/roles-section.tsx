"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  type RoleWithPermissions,
} from "@/services/roles.service";

const CATEGORY_LABELS: Record<string, string> = {
  users: "User Management",
  content: "Content (Programs / Work / Impact Stories)",
  team: "Team",
  branches: "Branches",
  reports: "Annual Reports",
  policies: "Policies",
  site_content: "Site Content (CMS)",
  volunteers: "Volunteers",
  donors: "Donors",
  partnerships: "Partnerships",
  uploads: "Uploads",
  general: "General",
};

const KNOWN_GROUPS = [
  "users",
  "content",
  "team",
  "branches",
  "reports",
  "policies",
  "site_content",
  "volunteers",
  "donors",
  "partnerships",
  "uploads",
];

export default function RolesSection() {
  const [roles, setRoles] = useState<RoleWithPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selected, setSelected] = useState<RoleWithPermissions | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const loadData = useCallback(async (keepSelectedId?: string) => {
    try {
      setLoading(true);
      const data = await getRoles();
      setRoles(data);
      if (keepSelectedId) {
        const fresh = data.find((r) => r.id === keepSelectedId) || null;
        setSelected(fresh);
        if (fresh) setSelectedPerms(new Set(fresh.permissions));
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const allPermissions = roles.find((r) => r.name === "super_admin")?.permissions ?? [];
  const grouped = allPermissions.reduce<Record<string, string[]>>((acc, key) => {
    const group = KNOWN_GROUPS.find((k) => key.startsWith(k)) || "general";
    if (!acc[group]) acc[group] = [];
    acc[group].push(key);
    return acc;
  }, {});

  const togglePerm = (key: string) => {
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSelectRole = (role: RoleWithPermissions) => {
    setError("");
    setSuccess("");
    setSelected(role);
    setSelectedPerms(new Set(role.permissions));
  };

  const handleSavePermissions = async () => {
    if (!selected) return;
    try {
      setSaving(true);
      setError("");
      await updateRole(selected.id, { permissions: Array.from(selectedPerms) });
      setSuccess(`Permissions updated for role "${selected.name}". Changes apply on the next API request.`);
      await loadData(selected.id);
    } catch (err: any) {
      setError(err?.message || "Failed to update permissions.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setError("Role name is required.");
      return;
    }
    try {
      setCreating(true);
      setError("");
      const created = await createRole({
        name: newName.trim(),
        description: newDescription.trim() || undefined,
      });
      setSuccess(`Role "${created.name}" created. Assign permissions below.`);
      setNewName("");
      setNewDescription("");
      await loadData(created.id);
    } catch (err: any) {
      setError(err?.message || "Failed to create role.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteRole = async (role: RoleWithPermissions) => {
    if (!confirm(`Delete role "${role.name}"? This cannot be undone.`)) return;
    try {
      setError("");
      await deleteRole(role.id);
      setSuccess(`Role "${role.name}" deleted.`);
      if (selected?.id === role.id) {
        setSelected(null);
        setSelectedPerms(new Set());
      }
      await loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to delete role.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-surface-variant">
        Loading roles &amp; permissions...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Create Role */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-on-surface mb-4">Create Custom Role</h2>
        <form onSubmit={handleCreateRole} className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-surface-variant mb-1">
              Role Name (lowercase, e.g. fundraiser)
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. fundraiser"
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-surface-variant mb-1">
              Description (optional)
            </label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What can this role do?"
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="px-5 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 text-sm disabled:opacity-50 whitespace-nowrap"
          >
            {creating ? "Creating..." : "Create Role"}
          </button>
        </form>
      </div>

      {/* Roles List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`bg-surface-container-lowest border rounded-2xl p-5 shadow-sm transition-colors ${
              selected?.id === role.id ? "border-primary" : "border-outline-variant"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-base font-bold text-on-surface font-mono">{role.name}</h3>
                <p className="text-xs text-surface-variant">{role.description || "No description"}</p>
              </div>
              <div className="flex gap-1.5">
                {role.name === "super_admin" && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20">
                    LOCKED
                  </span>
                )}
                {role.is_system && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-sky-500/10 text-sky-600 border border-sky-500/20">
                    SYSTEM
                  </span>
                )}
                {!role.assignable && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    LEGACY
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-surface-variant mb-3">
              {role.user_count} user(s) · {role.permissions.length} permission(s)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleSelectRole(role)}
                className="px-3 py-1.5 bg-surface-container text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container-high"
              >
                {role.name === "super_admin" ? "View Permissions" : "Edit Permissions"}
              </button>
              {!role.is_system && (
                <button
                  onClick={() => handleDeleteRole(role)}
                  className="px-3 py-1.5 text-error text-xs font-semibold rounded-lg hover:bg-error/10"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Permission Editor */}
      {selected && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-on-surface mb-1">
            Permissions — <span className="font-mono">{selected.name}</span>
          </h2>
          {selected.name === "super_admin" ? (
            <p className="text-sm text-surface-variant py-4">
              The Super Admin role always has full access. This is enforced in backend code and cannot be changed.
            </p>
          ) : (
            <>
              <p className="text-xs text-surface-variant mb-4">
                Toggle permissions, then save. Changes take effect on the next API request (no re-login needed).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                {Object.entries(grouped).map(([group, keys]) => (
                  <div key={group} className="border border-outline-variant rounded-xl p-4">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wide mb-2">
                      {CATEGORY_LABELS[group] || group}
                    </h4>
                    <div className="space-y-1.5">
                      {keys.map((key) => (
                        <label key={key} className="flex items-center gap-2 text-xs text-on-surface cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPerms.has(key)}
                            onChange={() => togglePerm(key)}
                          />
                          <span className="font-mono">{key}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSavePermissions}
                disabled={saving}
                className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 text-sm disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Permissions"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}