import Link from "next/link";

export default function WhoWeArePage() {
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
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
              Who We Are
            </h1>
            <p className="text-xl text-on-surface-variant font-medium leading-relaxed max-w-3xl">
              “A youth-led movement securing dignity and care for the aging population.”
            </p>
          </div>
        </div>

        {/* Our Story Card */}
        <section className="bg-surface-container-lowest p-8 md:p-12 rounded-3xl border border-outline-variant shadow-sm space-y-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
            <span className="material-symbols-outlined text-primary text-3xl">menu_book</span>
            <h2 className="text-2xl font-bold text-on-surface">Our Story</h2>
          </div>
          <div className="space-y-6 text-base text-on-surface-variant leading-relaxed">
            <p>
              AgeSense Initiative (ASI) is a youth-led nonprofit organization dedicated to improving the quality of life of elderly individuals across Bangladesh. Founded on the conviction that older members of society deserve dignity, care, and sustained attention, ASI brings together a committed community of young professionals, students, and volunteers united by a shared sense of responsibility toward the aging population.
            </p>
            <p>
              Our organization was established not merely to respond to a gap in elderly care, but to systematically address it — through structured programs, institutional partnerships, and a long-term commitment to advocacy and service delivery.
            </p>
          </div>
        </section>

        {/* Structure Section */}
        <section className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-primary">How We Are Structured</h2>
            <p className="text-base text-on-surface-variant leading-relaxed max-w-3xl">
              We are organized across multiple tiers — from a governing Board of Directors to an active network of executives, officers, and field volunteers — ensuring that our work is both strategically grounded and operationally responsive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dhaka Chapter */}
            <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant hover:border-primary transition-colors flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary">hub</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3">Dhaka Chapter</h3>
                <p className="text-base text-on-surface-variant leading-relaxed">
                  Our central hub for strategic planning, national advocacy, and core service delivery.
                </p>
              </div>
            </div>

            {/* Rajshahi Chapter */}
            <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant hover:border-primary transition-colors flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary">distance</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3">Rajshahi Chapter</h3>
                <p className="text-base text-on-surface-variant leading-relaxed">
                  Expanding our reach to ensure elderly care and community support across regional demographics.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
