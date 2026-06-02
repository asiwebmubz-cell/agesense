import Link from "next/link";

export default function HowWeOperatePage() {
  return (
    <div className="bg-surface min-h-screen py-16 md:py-24">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 space-y-16">
        
        {/* Navigation & Header */}
        <div className="space-y-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Back to Home
          </Link>
          <div className="space-y-4">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold uppercase tracking-wider">
              Our Methodology
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
              How We Operate
            </h1>
            <p className="text-xl text-on-surface-variant font-medium leading-relaxed max-w-3xl">
              “ASI functions through a structured organizational model designed for accountability, transparency, and sustained impact.”
            </p>
          </div>
        </div>

        {/* Operational Pillars */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            
            {/* Governance */}
            <div className="bg-surface-container-lowest p-8 md:p-10 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                <span className="material-symbols-outlined text-2xl">gavel</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-on-surface">Governance</h3>
                <p className="text-base text-on-surface-variant leading-relaxed">
                  The organization is led by a Board of Directors comprising professionals from relevant fields, providing strategic oversight and institutional credibility. Day-to-day operations are managed by a core executive team responsible for program execution, partnerships, communications, and internal administration.
                </p>
              </div>
            </div>

            {/* Volunteer Engagement */}
            <div className="bg-surface-container-lowest p-8 md:p-10 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                <span className="material-symbols-outlined text-2xl">groups</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-on-surface">Volunteer Engagement</h3>
                <p className="text-base text-on-surface-variant leading-relaxed">
                  Our volunteer structure is built on selectivity and commitment. Volunteers go through a defined onboarding and engagement pipeline to ensure that those who represent ASI are prepared, motivated, and aligned with our values. We prioritize quality of participation over quantity of enrollment.
                </p>
              </div>
            </div>

            {/* Program Delivery */}
            <div className="bg-surface-container-lowest p-8 md:p-10 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                <span className="material-symbols-outlined text-2xl">precision_manufacturing</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-on-surface">Program Delivery</h3>
                <p className="text-base text-on-surface-variant leading-relaxed">
                  Each initiative undertaken by ASI is planned with defined objectives, designated responsibilities, and accountability mechanisms. We operate with limited but carefully deployed resources, ensuring that contributions — whether financial or human — translate into meaningful outcomes.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* CTA Card */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-10 md:p-12 text-center space-y-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="max-w-xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold uppercase tracking-wider">
              Get Involved
            </span>
            <h2 className="text-3xl font-extrabold text-primary tracking-tight">Want to Make an Impact?</h2>
            <p className="text-on-surface-variant text-base leading-relaxed">
              Join us to dedicate your skills, energy, and commitment to restoring dignity to the aging population.
            </p>
            <div className="pt-4">
              <Link 
                href="/volunteer" 
                className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3.5 rounded-full text-base font-bold hover:bg-primary/95 transition-all shadow-md transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Join Our Volunteer Team
                <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
