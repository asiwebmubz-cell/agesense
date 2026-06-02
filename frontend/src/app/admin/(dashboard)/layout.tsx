"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/services/auth.service";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Volunteers", path: "/admin/volunteers", icon: "group" },
    { name: "Donors", path: "/admin/donors", icon: "volunteer_activism" },
    { name: "Content Management", path: "/admin/content", icon: "edit_note" },
  ];

  return (
    <div className="bg-background text-on-surface antialiased flex min-h-screen">
      {/* SideNavBar */}
      <aside className={`flex flex-col fixed left-0 top-0 h-screen w-64 bg-inverse-surface shadow-lg z-40 p-4 transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8 px-2 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-on-primary">AgeSense Admin</h1>
            <p className="text-sm font-medium text-surface-variant opacity-70">Non-Profit Portal</p>
          </div>
          <button className="md:hidden text-on-primary" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-primary-container text-on-primary-container font-bold' : 'text-surface-variant hover:bg-surface-variant/10'}`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto border-t border-outline-variant/10 pt-4 space-y-2">
          <button className="w-full mb-4 py-3 bg-primary text-on-primary font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined">add</span>
            <span>New Report</span>
          </button>
          <Link href="#" className="flex items-center gap-3 px-4 py-2 text-surface-variant hover:bg-surface-variant/10 rounded-lg transition-all">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2 text-surface-variant hover:bg-surface-variant/10 rounded-lg transition-all">
            <span className="material-symbols-outlined">help</span>
            <span className="text-sm font-medium">Support</span>
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
            <div className="hidden lg:flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              <span className="text-sm font-medium">October 24, 2023</span>
            </div>
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
