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
        <nav className={`lg:flex items-center gap-8 ${mobileMenuOpen ? 'flex flex-col absolute top-full left-0 w-full bg-surface-container-lowest p-4 shadow-lg' : 'hidden'}`}>
          <Link href="/#about" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">About Us</Link>
          <Link href="/programs" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">Programs</Link>
          <Link href="/impact" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">Impact</Link>
          <Link href="/volunteer" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">Get Involved</Link>

          <Link href="/admin" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium border-l border-outline-variant pl-4">Admin</Link>
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
