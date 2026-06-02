import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-inverse-surface text-surface-bright pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="space-y-6">
          <div className="text-3xl font-semibold text-surface-bright">AgeSense Initiative</div>
          <p className="text-base text-surface-variant">Bridging generations with professional care and community focus since 2024.</p>
          <div className="flex gap-4">
            <a 
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-all" 
              href="https://www.facebook.com/asi.initiative" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.85z"/>
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-6">Mission</h4>
          <ul className="space-y-3">
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="#">Our Story</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="#">Annual Report</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="#">Values</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="#">Team</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-6">Get Involved</h4>
          <ul className="space-y-3">
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="/volunteer">Volunteer</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="/donate">Donate</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="#">Corporate Partners</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="#">Ambassadors</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-6">Resources</h4>
          <ul className="space-y-3">
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="#">Family Toolkit</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="#">Tech Guides</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="#">Safety Tips</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="#">Newsletter</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-surface-variant">
        <span>© 2024 AgeSense Initiative. All rights reserved.</span>
        <div className="flex gap-8">
          <Link className="hover:text-surface-bright" href="#">Privacy Policy</Link>
          <Link className="hover:text-surface-bright" href="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
