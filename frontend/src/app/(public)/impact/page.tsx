"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { getPublishedPrograms } from "@/services/programs.service";
import { getStats } from "@/services/stats.service";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function AnimatedCounter({ target, suffix }: { target: number, suffix: string }) {
  const counterRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const counter = counterRef.current;
    if (!counter || target === 0) return;

    const speed = 200;
    const animate = () => {
      let count = 0;
      const increment = target / speed;

      const updateCount = () => {
        count += increment;
        if (count < target) {
          counter.innerText = Math.ceil(count) + suffix;
          setTimeout(updateCount, 1);
        } else {
          counter.innerText = target + suffix;
        }
      };
      updateCount();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
    return () => observer.disconnect();
  }, [target, suffix]);

  return <h3 ref={counterRef} className="text-4xl md:text-5xl font-bold text-primary">0{suffix}</h3>;
}

export default function ImpactPage() {
  const { data: stats, loading: statsLoading } = useApi(getStats);
  const { data: allPrograms, loading: programsLoading } = useApi(getPublishedPrograms);

  // Filter to only published Impact Stories, API already orders by created_at DESC
  const impactStories = allPrograms?.filter(item => item.type === "Impact Stories") ?? [];

  return (
    <>
      {/* Key Metrics */}
      <section className="py-24 bg-surface px-4 md:px-8 max-w-[1200px] mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold text-primary mb-4">Our Impact at a Glance</h2>
          <div className="h-1 w-20 bg-primary-container mx-auto rounded-full"></div>
        </div>
        {statsLoading ? (
          <LoadingSpinner count={1} message="Loading live statistics..." />
        ) : (
          <div className="flex justify-center">
            <div className="bg-secondary-container p-12 rounded-2xl border border-outline-variant shadow-[var(--shadow-card)] flex flex-col justify-center items-center text-center w-full max-w-sm">
              <span className="material-symbols-outlined text-on-secondary-container text-6xl mb-6">grid_view</span>
              <AnimatedCounter target={stats?.publishedProgramsCount || 0} suffix="+" />
              <p className="text-sm font-bold uppercase tracking-wider text-on-secondary-container mt-3">Total Programs</p>
            </div>
          </div>
        )}
      </section>

      {/* Impact Stories — fully dynamic from Admin CMS */}
      <section className="py-24 bg-surface-container-low">
        <div className="px-4 md:px-8 max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold text-primary mb-4">Stories of Change</h2>
              <p className="text-lg text-on-surface-variant">
                Real connections, real transformation. Meet the people at the heart of AgeSense Initiative.
              </p>
            </div>
          </div>

          {programsLoading ? (
            <LoadingSpinner count={1} message="Loading stories..." />
          ) : impactStories.length === 0 ? (
            <div className="text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 block opacity-40">auto_stories</span>
              <p className="text-lg italic opacity-60">No stories published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {impactStories.map((story) => (
                <div
                  key={story.id}
                  className="bg-white rounded-2xl overflow-hidden border border-outline-variant shadow-[var(--shadow-card)] flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Story image */}
                  {story.image_url && (
                    <div className="h-52 overflow-hidden">
                      <img
                        src={story.image_url}
                        alt={story.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        Impact Story
                      </span>
                      {story.created_at && (
                        <span className="text-xs text-outline">
                          {new Date(story.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>

                    <span
                      className="material-symbols-outlined text-primary-container text-3xl mb-3"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      format_quote
                    </span>

                    <p className="text-base italic text-on-surface leading-relaxed flex-grow mb-4">
                      &ldquo;{story.description}&rdquo;
                    </p>

                    <div className="text-lg font-semibold text-on-surface mt-auto">— {story.title}</div>

                    {/* Gallery images if available */}
                    {story.images && story.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {story.images.slice(0, 3).map((imgUrl, idx) => (
                          <div key={idx} className="h-16 rounded-lg overflow-hidden">
                            <img
                              src={imgUrl}
                              alt={`${story.title} gallery ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 bg-primary text-white p-10 rounded-2xl border border-outline-variant flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-semibold mb-1">Want to make an impact?</h4>
              <p className="text-base opacity-80">Join our growing community of youth making a difference.</p>
            </div>
            <Link
              href="/volunteer"
              className="shrink-0 bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-surface-bright transition-colors"
            >
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
