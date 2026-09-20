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
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="/our-story">Our Story</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="/values">Values</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="/team">Team &amp; Governance</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="/founders-statement">Founder&apos;s Statement</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="/regional-chapters">Regional Chapters</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="/annual-report">Annual Report</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-6">Get Involved</h4>
          <ul className="space-y-3">
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="/volunteer">Volunteer</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="/donate">Donate</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="/partner">Partner With Us</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="/programs">Our Programs</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-6">Governance &amp; Trust</h4>
          <ul className="space-y-3">
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="/policies">Organizational Policies</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="/annual-report">Financial &amp; Audit Disclosures</Link></li>
            <li><Link className="text-base text-surface-variant hover:text-surface-bright hover:underline decoration-primary-fixed-dim transition-all" href="/impact">Impact Metrics</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-surface-variant">
        <div>
          <span>© 2026 AgeSense Initiative. All rights reserved.</span>
          <span className="mx-2 hidden md:inline">|</span>
          <span className="block md:inline mt-1 md:mt-0 text-xs">
            Developed by{" "}
            <a
              href="https://www.linkedin.com/in/kmmubin/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-surface-bright font-semibold hover:underline"
            >
              K M MUBIN
            </a>
          </span>
        </div>
        <div className="flex gap-6 text-xs">
          <Link className="hover:text-surface-bright" href="/policies">Policies</Link>
          <Link className="hover:text-surface-bright" href="/regional-chapters">Chapters</Link>
          <Link className="hover:text-surface-bright" href="/admin/login">Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
}
