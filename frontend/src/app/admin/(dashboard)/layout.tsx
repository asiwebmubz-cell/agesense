"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/services/auth.service";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [userRole, setUserRole] = useState<string | null>(null);

  // Read current user role on mount
  useState(() => {
    if (typeof window !== "undefined") {
      try {
        const u = localStorage.getItem("admin_user");
        if (u) {
          const parsed = JSON.parse(u);
          setUserRole(parsed.role || null);
        }
      } catch {}
    }
  });

  const navItems = [
    { name: "Content Management", path: "/admin/content", icon: "edit_note" },
    ...(userRole === "super_admin"
      ? [{ name: "Site Content (CMS)", path: "/admin/site-content", icon: "article" }]
      : []),
    { name: "Team Members", path: "/admin/team", icon: "badge" },
    ...(userRole === "super_admin"
      ? [
          { name: "Branches", path: "/admin/branches", icon: "location_city" },
          { name: "Annual Reports", path: "/admin/annual-reports", icon: "analytics" },
          { name: "Policies", path: "/admin/policies", icon: "policy" },
        ]
      : []),
    { name: "Volunteers", path: "/admin/volunteers", icon: "group" },
    { name: "Donors", path: "/admin/donors", icon: "volunteer_activism" },
    { name: "Partner With Us", path: "/admin/partnerships", icon: "handshake" },
    ...(userRole === "super_admin"
      ? [{ name: "User Management", path: "/admin/users", icon: "manage_accounts" }]
      : []),
  ];

  return (
    <div className="bg-background text-on-surface antialiased flex min-h-screen">
      {/* SideNavBar */}
      <aside className={`flex flex-col fixed left-0 top-0 h-screen w-64 bg-inverse-surface shadow-lg z-40 p-4 transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-6 px-2 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-on-primary">AgeSense Admin</h1>
            <p className="text-xs font-medium text-surface-variant opacity-70">
              {userRole ? `Role: ${userRole.replace('_', ' ').toUpperCase()}` : 'Non-Profit Portal'}
            </p>
          </div>
          <button className="md:hidden text-on-primary" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-primary-container text-on-primary-container font-bold' : 'text-surface-variant hover:bg-surface-variant/10'}`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto border-t border-outline-variant/10 pt-4 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full py-2.5 px-3 bg-surface-variant/10 text-on-primary font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-surface-variant/20 transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            <span>View Live Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* TopNavBar */}
        <header className="sticky top-0 z-30 flex justify-between items-center w-full px-4 md:px-8 h-16 bg-surface-container-lowest border-b border-outline-variant">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-primary" onClick={() => setIsMobileMenuOpen(true)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-xl font-bold text-primary capitalize">
              {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                logout();
                window.location.href = "/admin/login";
              }}
              className="flex items-center gap-2 text-primary hover:bg-surface-container-low p-2 rounded transition-colors group"
            >
              <span className="material-symbols-outlined group-active:opacity-80 transition-all duration-200">logout</span>
              <span className="text-sm font-medium hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>
        
        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
