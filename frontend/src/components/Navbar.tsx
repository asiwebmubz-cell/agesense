"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`bg-surface-container-lowest sticky top-0 z-50 w-full border-b border-outline-variant transition-all duration-300 ${isScrolled ? 'py-2 shadow-md' : 'py-4 shadow-sm'}`}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image 
            alt="AgeSense Initiative Logo" 
            src="/asi-logo.jpg" 
            width={120} 
            height={48} 
            className="h-12 w-auto object-contain" 
            style={{ width: "auto", height: "auto" }}
          />
        </Link>
        <nav className={`lg:flex items-center gap-6 ${mobileMenuOpen ? 'flex flex-col absolute top-full left-0 w-full bg-surface-container-lowest p-6 shadow-lg border-b border-outline-variant space-y-3 lg:space-y-0' : 'hidden'}`}>
          {/* Who We Are with Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-sm font-medium py-1">
              <span>Who We Are</span>
              <span className="material-symbols-outlined text-[16px] transition-transform group-hover:rotate-180">expand_more</span>
            </button>
            <div className="lg:absolute lg:top-full lg:left-0 hidden group-hover:flex lg:group-hover:flex flex-col bg-surface-container-lowest lg:shadow-xl lg:rounded-2xl lg:border lg:border-outline-variant py-2 min-w-[200px] z-50">
              <Link href="/who-we-are" className="px-4 py-2 text-xs font-semibold text-primary hover:bg-surface-container transition-colors">
                Overview
              </Link>
              <Link href="/our-story" className="px-4 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors">
                Our Story
              </Link>
              <Link href="/values" className="px-4 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors">
                Our Values
              </Link>
              <Link href="/team" className="px-4 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors">
                Our Team &amp; Governance
              </Link>
              <Link href="/founders-statement" className="px-4 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors">
                Founder&apos;s Statement
              </Link>
            </div>
          </div>

          <Link href="/programs" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">Programs</Link>
          <Link href="/impact" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">Impact</Link>
          <Link href="/regional-chapters" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">Regional Chapters</Link>
          <Link href="/annual-report" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">Annual Report</Link>
          <Link href="/volunteer" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">Get Involved</Link>

          <Link href="/admin/login" className="text-on-surface-variant hover:text-primary transition-colors text-xs font-medium border-t lg:border-t-0 lg:border-l border-outline-variant pt-2 lg:pt-0 lg:pl-4 opacity-75">
            Admin
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/donate" className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 active:scale-95 transition-all shadow-md">
            Donate
          </Link>
          <button
            className="lg:hidden text-on-surface-variant p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
