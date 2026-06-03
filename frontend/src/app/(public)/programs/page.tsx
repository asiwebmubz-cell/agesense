"use client";

import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { getPublishedPrograms } from "@/services/programs.service";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import EmptyState from "@/components/ui/EmptyState";

export default function ProgramsPage() {
  const { data: items, loading, error, refetch } = useApi(getPublishedPrograms);

  return (
    <>
      {/* Hero Section */}
      <header className="bg-inverse-surface py-20 md:py-32 flex flex-col items-center justify-center text-center px-4 md:px-8">
        <h1 className="text-surface-bright text-4xl md:text-5xl font-bold max-w-3xl">
          Ways we Help People
        </h1>
        <p className="text-surface-variant mt-6 text-lg max-w-2xl opacity-90">
          Bridging generational gaps through compassionate care, digital literacy, and community-led companionship programs.
        </p>
      </header>

      {/* Programs Grid Section */}
      <section className="py-16 md:py-24 max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center mb-12 md:mb-16">
          <h2 className="text-3xl font-semibold text-on-surface text-center">
            All of Our Programs
          </h2>
          <div className="h-1 w-20 bg-primary-container mt-4 rounded-full"></div>
        </div>

        <div className="space-y-6">
          {(() => {
            // Filter: only show "Our Programs" and "Our Work" on this page.
            // "Impact Stories" have their own dedicated /impact page.
            const programItems = items?.filter(
              (item) => item.type === "Our Programs" || item.type === "Our Work"
            ) ?? [];

            if (loading) return <LoadingSpinner count={4} message="Loading programs..." />;
            if (error) return <ErrorMessage message={error} onRetry={refetch} />;
            if (programItems.length === 0)
              return (
                <EmptyState
                  icon="category"
                  title="No programs yet"
                  description="Our programs will appear here once they are published by the team."
                />
              );

            return programItems.map((item) => (
              <div key={item.id} className="bg-surface-container-low rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border border-outline-variant/30">
                <div className="w-full md:w-1/3 aspect-[4/3] overflow-hidden rounded-lg shadow-sm bg-primary/10 flex items-center justify-center relative">
                  {item.image_url ? (
                    <img alt={item.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" src={item.image_url} />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-primary opacity-40">image</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold text-on-surface">{item.title}</h3>
                    <span className="bg-secondary-container text-on-secondary-container px-3 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase">{item.type === 'Our Programs' ? 'Program' : 'Work'}</span>
                  </div>
                  <p className="text-on-surface-variant text-base mb-6 leading-relaxed">
                    {item.description}
                  </p>
                  <Link className="text-primary font-bold flex items-center gap-2 group" href={`/programs/${item.id}`}>
                    Learn More
                    <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ));
          })()}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-container text-on-primary-container py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-4">Interested in participating?</h2>
          <p className="text-lg mb-8 opacity-90">Whether you&apos;re looking for support or want to offer your time as a volunteer, we have a place for you in the AgeSense family.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/volunteer" className="border-2 border-surface-container-lowest text-surface-container-lowest px-8 py-3 rounded-full font-bold text-sm hover:bg-surface-container-lowest/10 transition-all active:scale-95 inline-block">Become a Volunteer</Link>
          </div>
        </div>
      </section>
    </>
  );
}
