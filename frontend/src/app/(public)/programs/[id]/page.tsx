"use client";

import { use } from "react";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { getPublishedPrograms } from "@/services/programs.service";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

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

  return (
    <div className="bg-surface min-h-screen pb-24">
      {/* Premium Header Banner */}
      <header className="bg-inverse-surface py-20 text-center px-4 md:px-8 shadow-sm">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-surface-bright text-4xl md:text-5xl font-extrabold tracking-tight">
            {program.title}
          </h1>
          {program.subtitle && (
            <p className="text-surface-variant text-lg font-medium tracking-wide opacity-90">
              {program.subtitle}
            </p>
          )}
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 mt-16 space-y-16">
        
        {/* Navigation & Introduction */}
        <div className="flex justify-between items-center">
          <Link 
            href="/programs" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Back to Programs
          </Link>
        </div>

        {/* Two-Column About & Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: About & Video */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-3xl font-extrabold text-primary border-b border-outline-variant/30 pb-4">
              About The Initiative
            </h2>

            {/* Video Player */}
            {program.video_url ? (
              <div className="relative rounded-2xl overflow-hidden shadow-md bg-black aspect-video border border-outline-variant">
                <video 
                  controls 
                  className="w-full h-full object-cover" 
                  src={program.video_url}
                />
              </div>
            ) : program.image_url ? (
              <div className="relative rounded-2xl overflow-hidden shadow-md aspect-video border border-outline-variant">
                <img 
                  alt={program.title} 
                  className="w-full h-full object-cover" 
                  src={program.image_url} 
                />
              </div>
            ) : null}

            <p className="text-base text-on-surface-variant leading-relaxed whitespace-pre-line">
              {program.description}
            </p>
          </div>

          {/* Right Column: Cards (Goals, Beneficiaries, etc.) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Goals */}
            {goalsList.length > 0 && (
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant space-y-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">verified</span>
                  Project Goals & Objective
                </h3>
                <ul className="space-y-3">
                  {goalsList.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-on-surface-variant font-medium leading-relaxed">
                      <span className="material-symbols-outlined text-primary text-[20px]">check_box</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Beneficiaries */}
            {beneficiariesList.length > 0 && (
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant space-y-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">elderly</span>
                  Beneficiaries
                </h3>
                <ul className="space-y-3">
                  {beneficiariesList.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-on-surface-variant font-medium leading-relaxed">
                      <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Expense Categories */}
            {expensesList.length > 0 && (
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant space-y-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">payments</span>
                  Expense Categories
                </h3>
                <ul className="space-y-3">
                  {expensesList.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-on-surface-variant font-medium leading-relaxed">
                      <span className="material-symbols-outlined text-primary text-[20px]">check_box</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Project Areas */}
            {program.project_areas && (
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant space-y-3">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">pin_drop</span>
                  Project Areas
                </h3>
                <div className="flex gap-3 text-sm text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                  <span>{program.project_areas}</span>
                </div>
              </div>
            )}

            {/* Duration */}
            {program.duration && (
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant space-y-3">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">schedule</span>
                  Duration
                </h3>
                <div className="flex gap-3 text-sm text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-primary text-[20px]">access_time</span>
                  <span>{program.duration}</span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Stats Table */}
        {years.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-outline-variant shadow-sm bg-surface-container-low">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container/30">
                  <th className="p-4 font-bold text-primary text-sm">Active Years</th>
                  {years.map((year, i) => (
                    <th key={i} className="p-4 text-on-surface text-sm font-semibold">{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 text-primary text-sm font-bold">Food Packages Distributed</td>
                  {stats.map((stat, i) => (
                    <td key={i} className="p-4 text-on-surface-variant text-sm font-semibold">{stat}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Call to Action Banner */}
        <div className="bg-inverse-surface text-surface-bright rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-md">
          <span className="text-xl font-bold">Help Us Deliver More Warmth</span>
          <Link 
            href="/donate" 
            className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold hover:bg-primary/95 transition-all text-center"
          >
            Donate
          </Link>
        </div>

        {/* Dynamic Gallery Grid */}
        {program.images && program.images.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-3xl font-extrabold text-primary text-center">Showcase Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6 bg-surface-container-low rounded-2xl border border-outline-variant">
              {program.images.map((imgUrl, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-xl bg-primary/10 border border-outline-variant shadow-sm hover:shadow-md transition-shadow group">
                  <img
                    src={imgUrl}
                    alt={`${program.title} showcase ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {(program.gallery_title_1 || program.gallery_title_2) && (
          <section className="space-y-8">
            <h2 className="text-3xl font-extrabold text-primary text-center">Legacy Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {program.gallery_title_1 && (
                <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant flex items-center justify-between shadow-sm">
                  <span className="text-xl font-bold text-on-surface">{program.gallery_title_1}</span>
                  <a 
                    href={program.gallery_link_1 || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="border border-primary text-primary px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-colors"
                  >
                    View Gallery
                  </a>
                </div>
              )}
              {program.gallery_title_2 && (
                <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant flex items-center justify-between shadow-sm">
                  <span className="text-xl font-bold text-on-surface">{program.gallery_title_2}</span>
                  <a 
                    href={program.gallery_link_2 || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="border border-primary text-primary px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-colors"
                  >
                    View Gallery
                  </a>
                </div>
              )}
            </div>
            {program.gallery_description && (
              <p className="text-sm text-on-surface-variant/80 italic text-center max-w-3xl mx-auto leading-relaxed">
                {program.gallery_description}
              </p>
            )}
          </section>
        )}

      </main>
    </div>
  );
}
