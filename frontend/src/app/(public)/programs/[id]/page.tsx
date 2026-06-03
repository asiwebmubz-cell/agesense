"use client";

import { use } from "react";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { getPublishedPrograms } from "@/services/programs.service";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ShowcaseGallery from "@/components/ui/ShowcaseGallery";

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: items, loading, error, refetch } = useApi(getPublishedPrograms);

  const program = items?.find((p) => p.id === id);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center py-20">
        <LoadingSpinner count={1} message="Loading program details..." />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center py-20">
        <div className="max-w-md w-full px-4">
          <ErrorMessage 
            message={error || "The requested program could not be found."} 
            onRetry={refetch} 
          />
          <div className="text-center mt-6">
            <Link href="/programs" className="text-primary font-bold hover:underline">
              Back to Programs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Parse list values helper
  const getList = (val?: string) => {
    if (!val) return [];
    return val.split("\n").map(line => line.trim()).filter(Boolean);
  };

  const goalsList = getList(program.goals);
  const beneficiariesList = getList(program.beneficiaries);
  const expensesList = getList(program.expense_categories);
  
  const years = program.active_years ? program.active_years.split(",").map(y => y.trim()) : [];
  const stats = program.packages_distributed ? program.packages_distributed.split(",").map(s => s.trim()) : [];

  // Gather all images (featured image first, then gallery)
  const allImages = [];
  if (program.image_url) allImages.push(program.image_url);
  if (program.images && program.images.length > 0) {
    program.images.forEach(img => {
      if (img !== program.image_url) allImages.push(img);
    });
  }

  return (
    <div className="bg-surface min-h-screen pb-24">
      {/* Top Navigation */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8 pb-4">
        <Link 
          href="/programs" 
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Programs
        </Link>
      </div>

      {/* Case Study Header */}
      <header className="max-w-[1200px] mx-auto px-4 md:px-8 pt-4 pb-10 space-y-6">
        <div className="flex flex-wrap items-center gap-3 text-sm font-bold tracking-widest uppercase text-primary">
          <span className="bg-primary/10 px-3 py-1 rounded-full">{program.type}</span>
          <span className="text-on-surface-variant/50">•</span>
          <span className="text-on-surface-variant">
            Published on {program.created_at ? new Date(program.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
          </span>
        </div>
        
        <h1 className="text-on-surface text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
          {program.title}
        </h1>
        
        {program.subtitle && (
          <p className="text-on-surface-variant text-xl md:text-2xl font-medium tracking-wide opacity-90 max-w-3xl leading-snug">
            {program.subtitle}
          </p>
        )}
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-16">
        
        {/* Premium Showcase Gallery */}
        {allImages.length > 0 && (
          <section className="w-full">
            <ShowcaseGallery images={allImages} title={program.title} />
          </section>
        )}

        {/* Two-Column Story & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12">
          
          {/* Left Column: Full Story & Video */}
          <div className="lg:col-span-7 space-y-10">
            <section className="space-y-6">
              <h2 className="text-3xl font-extrabold text-on-surface border-b border-outline-variant/30 pb-4">
                The Full Story
              </h2>
              <p className="text-lg text-on-surface-variant leading-relaxed whitespace-pre-line">
                {program.description}
              </p>
            </section>

            {/* Video Player (If provided) */}
            {program.video_url && (
              <section className="space-y-6">
                <h3 className="text-2xl font-extrabold text-on-surface">Video Coverage</h3>
                <div className="relative rounded-2xl overflow-hidden shadow-md bg-black aspect-video border border-outline-variant">
                  <video 
                    controls 
                    className="w-full h-full object-cover" 
                    src={program.video_url}
                  />
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Project Details & Stats */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Stats Banner */}
            {(program.project_areas || program.duration) && (
              <div className="bg-primary text-on-primary rounded-2xl p-6 shadow-md grid grid-cols-2 gap-4">
                {program.project_areas && (
                  <div className="space-y-1">
                    <span className="material-symbols-outlined text-3xl opacity-80">pin_drop</span>
                    <p className="text-xs uppercase tracking-wider font-bold opacity-80">Location</p>
                    <p className="font-semibold text-lg">{program.project_areas}</p>
                  </div>
                )}
                {program.duration && (
                  <div className="space-y-1">
                    <span className="material-symbols-outlined text-3xl opacity-80">schedule</span>
                    <p className="text-xs uppercase tracking-wider font-bold opacity-80">Duration</p>
                    <p className="font-semibold text-lg">{program.duration}</p>
                  </div>
                )}
              </div>
            )}

            {/* Goals */}
            {goalsList.length > 0 && (
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">verified</span>
                  Project Goals
                </h3>
                <ul className="space-y-3">
                  {goalsList.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-on-surface-variant font-medium leading-relaxed">
                      <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0">check_box</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Beneficiaries */}
            {beneficiariesList.length > 0 && (
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">elderly</span>
                  Beneficiaries
                </h3>
                <ul className="space-y-3">
                  {beneficiariesList.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-on-surface-variant font-medium leading-relaxed">
                      <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0">person</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Expense Categories */}
            {expensesList.length > 0 && (
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">payments</span>
                  Resource Allocation
                </h3>
                <ul className="space-y-3">
                  {expensesList.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-on-surface-variant font-medium leading-relaxed">
                      <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0">category</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>

        {/* Stats Timeline Table */}
        {years.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-outline-variant/30">
            <h3 className="text-2xl font-extrabold text-on-surface text-center">Impact Timeline</h3>
            <div className="overflow-hidden rounded-2xl border border-outline-variant shadow-sm bg-surface-container-low max-w-4xl mx-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container/50">
                    <th className="p-4 font-bold text-primary text-sm text-left border-r border-outline-variant">Metric</th>
                    {years.map((year, i) => (
                      <th key={i} className="p-4 text-on-surface text-sm font-extrabold tracking-wider">{year}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 text-primary text-sm font-bold text-left border-r border-outline-variant">Packages Distributed</td>
                    {stats.map((stat, i) => (
                      <td key={i} className="p-4 text-on-surface-variant text-base font-semibold">{stat}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Legacy External Galleries */}
        {(program.gallery_title_1 || program.gallery_title_2) && (
          <section className="space-y-8 py-10 bg-surface-container-lowest rounded-3xl border border-outline-variant px-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-extrabold text-on-surface">External Archives</h2>
              {program.gallery_description && (
                <p className="text-sm text-on-surface-variant/80 italic max-w-2xl mx-auto leading-relaxed">
                  {program.gallery_description}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {program.gallery_title_1 && (
                <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant flex items-center justify-between hover:shadow-md transition-all group">
                  <span className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">{program.gallery_title_1}</span>
                  <a 
                    href={program.gallery_link_1 || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 bg-white text-primary border border-primary/20 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    View Archive <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  </a>
                </div>
              )}
              {program.gallery_title_2 && (
                <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant flex items-center justify-between hover:shadow-md transition-all group">
                  <span className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">{program.gallery_title_2}</span>
                  <a 
                    href={program.gallery_link_2 || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 bg-white text-primary border border-primary/20 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    View Archive <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Call to Action Banner */}
        <div className="bg-gradient-to-r from-primary to-primary-container text-white rounded-3xl p-10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl mt-16 transform transition-transform hover:-translate-y-1">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight">Support Our Mission</h2>
            <p className="text-white/90 text-lg font-medium">Your contribution helps us continue this vital work in the community.</p>
          </div>
          <Link 
            href="/donate" 
            className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap"
          >
            Donate Today
          </Link>
        </div>

      </main>
    </div>
  );
}
