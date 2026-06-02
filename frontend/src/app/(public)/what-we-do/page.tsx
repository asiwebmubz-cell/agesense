import Link from "next/link";

export default function WhatWeDoPage() {
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
              Our Action
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
              What We Do
            </h1>
            <p className="text-xl text-on-surface-variant font-medium leading-relaxed max-w-3xl">
              “ASI operates at the intersection of direct service, community engagement, and systemic advocacy for the elderly population of Bangladesh.”
            </p>
          </div>
        </div>

        {/* Direct & Community Grid */}
        <div className="space-y-8">
          {/* Direct Elderly Support */}
          <div className="bg-surface-container-lowest p-8 md:p-12 rounded-3xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface">Direct Elderly Support</h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-base text-on-surface-variant leading-relaxed">
                We design and deliver programs that address the practical and emotional needs of older adults — including social engagement initiatives, health awareness efforts, and livelihood support for economically vulnerable seniors. Our programs are built around the reality that aging in Bangladesh often means reduced access to resources, institutional neglect, and social isolation. We work to reverse that.
              </p>
            </div>
          </div>

          {/* Community Mobilization */}
          <div className="bg-surface-container-lowest p-8 md:p-12 rounded-3xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">diversity_3</span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface">Community Mobilization</h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-base text-on-surface-variant leading-relaxed">
                ASI engages youth as active participants in elderly care — not as passive bystanders. Through structured volunteer programs, we equip young people with the awareness, skills, and organizational support to make a measurable difference in their communities. We believe that building a culture of care for the elderly begins with the next generation.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <section className="bg-primary text-on-primary rounded-3xl p-10 md:p-14 text-center space-y-6 relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight">See Our Work In Action</h2>
            <p className="opacity-90 text-base leading-relaxed">
              Explore the direct impact of our active programs, field initiatives, and regional operations.
            </p>
            <div className="pt-4">
              <Link 
                href="/programs" 
                className="inline-flex items-center gap-2 bg-on-primary-container text-primary-container px-8 py-3.5 rounded-full text-base font-bold hover:opacity-95 transition-all shadow-md transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                View Our Projects
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
            </div>
          </div>
          {/* Background vector accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-xl"></div>
        </section>

      </div>
    </div>
  );
}
