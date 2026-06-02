"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { getPublishedPrograms } from "@/services/programs.service";
import { getStats } from "@/services/stats.service";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function Home() {
  const { data: allPrograms, loading, error, refetch } = useApi(getPublishedPrograms);
  const { data: stats, loading: statsLoading } = useApi(getStats);
  const programs = allPrograms?.slice(0, 3) ?? [];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play timer for carousel
  useEffect(() => {
    if (!allPrograms || allPrograms.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % allPrograms.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [allPrograms]);

  const handlePrevSlide = () => {
    if (!allPrograms || allPrograms.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + allPrograms.length) % allPrograms.length);
  };

  const handleNextSlide = () => {
    if (!allPrograms || allPrograms.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % allPrograms.length);
  };

  return (
    <>
      {/* Hero / Carousel Section */}
      <section className="relative bg-background py-0 sm:py-6 md:py-10">
        <div className="max-w-[1200px] mx-auto px-0 sm:px-4 md:px-8">
          {!allPrograms || allPrograms.length === 0 ? (
            // Fallback to static banner if no published programs exist
            <div className="relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-b sm:border border-outline-variant/20 sm:rounded-3xl">
              <img 
                src="/hero-01.png" 
                alt="AgeSense Initiative Banner" 
                className="w-full h-auto block"
              />
            </div>
          ) : (
            // Gorgeous dynamic sliding carousel
            <div className="relative h-[350px] sm:h-[450px] md:h-[520px] w-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-b sm:border border-outline-variant/20 sm:rounded-3xl bg-neutral-900 group">
              
              {/* Slides wrapper */}
              <div className="relative w-full h-full">
                {allPrograms.map((program, idx) => (
                  <div
                    key={program.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                      idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    {program.image_url ? (
                      <img
                        src={program.image_url}
                        alt={program.title}
                        className="w-full h-full object-cover brightness-[0.6]"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-primary/80 to-secondary/80 opacity-70" />
                    )}

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 md:p-16 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                      <div className="max-w-2xl space-y-4">
                        <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase bg-secondary text-on-secondary rounded-full">
                          {program.type === "Our Programs" ? "Program" : program.type}
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                          {program.title}
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-white/90 line-clamp-2 leading-relaxed">
                          {program.description}
                        </p>
                        <div className="pt-2">
                          <Link
                            href={`/programs/${program.id}`}
                            className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full text-sm font-bold hover:shadow-lg hover:bg-primary/90 transition-all transform active:scale-95"
                          >
                            Read More
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Previous Slide"
              >
                <span className="material-symbols-outlined !text-3xl">chevron_left</span>
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Next Slide"
              >
                <span className="material-symbols-outlined !text-3xl">chevron_right</span>
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {allPrograms.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? "w-8 bg-primary" : "w-2.5 bg-white/50 hover:bg-white"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 bg-surface" id="about">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-semibold text-primary">About Our Initiative</h2>
            <p className="text-base text-on-surface-variant max-w-2xl mx-auto">We are dedicated to enhancing the lives of the elderly through innovative social programs and youth-led support networks.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-low p-8 rounded-xl shadow-[var(--shadow-card)] border border-outline-variant flex flex-col items-start space-y-4 hover:border-primary transition-colors group h-full">
              <div className="bg-primary-container/10 p-4 rounded-lg">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
              </div>
              <h3 className="text-xl font-semibold text-on-surface">Who are we?</h3>
              <p className="text-base text-on-surface-variant leading-relaxed">We are a youth-led nonprofit organization dedicated to improving the quality of life and ensuring dignity for elderly individuals across Bangladesh.</p>
              <Link href="/who-we-are" className="mt-auto w-full text-center bg-primary text-on-primary hover:bg-primary/95 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 group">
                Learn More
                <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>

            <div className="bg-surface-container-low p-8 rounded-xl shadow-[var(--shadow-card)] border border-outline-variant flex flex-col items-start space-y-4 hover:border-primary transition-colors group h-full">
              <div className="bg-primary-container/10 p-4 rounded-lg">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>diversity_3</span>
              </div>
              <h3 className="text-xl font-semibold text-on-surface">What we do?</h3>
              <p className="text-base text-on-surface-variant leading-relaxed">We systematically address gaps in elderly care through structured support programs, institutional partnerships, and dedicated advocacy.</p>
              <Link href="/what-we-do" className="mt-auto w-full text-center bg-primary text-on-primary hover:bg-primary/95 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 group">
                Learn More
                <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>

            <div className="bg-surface-container-low p-8 rounded-xl shadow-[var(--shadow-card)] border border-outline-variant flex flex-col items-start space-y-4 hover:border-primary transition-colors group h-full">
              <div className="bg-primary-container/10 p-4 rounded-lg">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>engineering</span>
              </div>
              <h3 className="text-xl font-semibold text-on-surface">How we operate?</h3>
              <p className="text-base text-on-surface-variant leading-relaxed">Driven by a community of young professionals and volunteers, we operate through active regional chapters in Dhaka and Rajshahi to deliver strategic.</p>
              <Link href="/how-we-operate" className="mt-auto w-full text-center bg-primary text-on-primary hover:bg-primary/95 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 group">
                Learn More
                <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Work Section */}
      <section className="py-24 bg-surface-container-lowest" id="programs">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl space-y-4">
              <h2 className="text-3xl font-semibold text-primary">Our Programs & Work</h2>
              <p className="text-base text-on-surface-variant">Explore how we are transforming the aging experience through structured programs and creative initiatives.</p>
            </div>
            <Link href="/programs" className="text-primary text-xl font-semibold border-b-2 border-primary-container flex items-center gap-2 hover:gap-4 transition-all">
              View All Projects <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3">
                <LoadingSpinner count={3} message="Loading programs..." />
              </div>
            ) : error ? (
              <div className="col-span-3">
                <ErrorMessage message={error} onRetry={refetch} />
              </div>
            ) : programs.length === 0 ? null : (
              programs.map((item) => (
                <div key={item.id} className="bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant hover:shadow-xl transition-all duration-300 flex flex-col">
                  <div className="h-48 overflow-hidden bg-primary/10 flex items-center justify-center relative">
                    {item.image_url ? (
                      <img className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt={item.title} src={item.image_url} />
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-primary opacity-40">image</span>
                    )}
                  </div>
                  <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-xl font-semibold text-on-primary-fixed-variant">{item.title}</h4>
                      <p className="text-base text-on-surface-variant mt-2 leading-relaxed">{item.description}</p>
                    </div>
                    <Link href={`/programs/${item.id}`} className="w-full text-center border-2 border-primary text-primary py-2.5 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all mt-4 block">
                      Read More
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Impact & Get Involved Section */}
      <section className="py-24 bg-surface" id="impact">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-primary mb-4">Our Impact</h2>
            <p className="text-base text-on-surface-variant">The numbers speak to the dedication of our community and the need for our mission.</p>
          </div>
          {statsLoading ? (
            <div className="py-8">
              <LoadingSpinner count={1} message="Loading live impact metrics..." />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
              <div className="bg-surface-container-low aspect-square flex flex-col items-center justify-center p-6 rounded-xl border border-outline-variant text-center space-y-2 hover:bg-primary-container/5 transition-colors">
                <span className="text-4xl md:text-5xl font-bold text-primary">{stats?.eldersHelped || 2578}+</span>
                <span className="text-sm font-medium text-on-surface-variant">Elders Helped</span>
              </div>
              <div className="bg-surface-container-low aspect-square flex flex-col items-center justify-center p-6 rounded-xl border border-outline-variant text-center space-y-2 hover:bg-primary-container/5 transition-colors">
                <span className="text-4xl md:text-5xl font-bold text-primary">{stats?.aidDelivered || 1723}+</span>
                <span className="text-sm font-medium text-on-surface-variant">Aid Delivered</span>
              </div>
              <div className="bg-surface-container-low aspect-square flex flex-col items-center justify-center p-6 rounded-xl border border-outline-variant text-center space-y-2 hover:bg-primary-container/5 transition-colors">
                <span className="text-4xl md:text-5xl font-bold text-primary">{stats?.voluntaryHours || 4320}+</span>
                <span className="text-sm font-medium text-on-surface-variant">Voluntary Hours</span>
              </div>
              <div className="bg-surface-container-low aspect-square flex flex-col items-center justify-center p-6 rounded-xl border border-outline-variant text-center space-y-2 hover:bg-primary-container/5 transition-colors">
                <span className="text-4xl md:text-5xl font-bold text-primary">{stats?.yearsActive || 2}+</span>
                <span className="text-sm font-medium text-on-surface-variant">Years Active</span>
              </div>
            </div>
          )}

          {/* Get Involved CTA */}
          <div className="bg-inverse-surface text-surface-bright rounded-3xl p-12 overflow-hidden relative group" id="get-involved">
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold">Ready to make a difference?</h2>
                <p className="text-lg opacity-80">Whether you&apos;re a student looking to volunteer, or a senior looking for community, there&apos;s a place for you at AgeSense Initiative.</p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/volunteer" className="bg-primary-fixed-dim text-on-primary-fixed px-8 py-3 rounded-full text-xl font-semibold hover:brightness-110 transition-all text-center inline-block">
                    Become a Volunteer
                  </Link>
                  <Link href="/partner" className="border border-outline-variant text-surface-bright px-8 py-3 rounded-full text-xl font-semibold hover:bg-surface-bright/10 transition-all text-center inline-block">
                    Partner with Us
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 translate-y-8">
                <img className="rounded-xl aspect-square object-cover" alt="Gardening" src="/img/IMG-20250308-WA0024.jpg" />
                <img className="rounded-xl aspect-square object-cover" alt="Hand stack" src="/img/IMG-20250318-WA0052.jpg" />
              </div>
              <div className="space-y-4">
                <img className="rounded-xl aspect-square object-cover" alt="Laughing man" src="/img/IMG-20250318-WA0058.jpg" />
                <img className="rounded-xl aspect-square object-cover" alt="Park walk" src="/img/IMG-20250318-WA0062.jpg" />
              </div>
            </div>
          </div>
        </div>
        {/* Decorative Circle */}
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary rounded-full opacity-20 blur-3xl"></div>
      </div>
    </div >
      </section >
    </>
  );
}
