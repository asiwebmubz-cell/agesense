"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function AnimatedCounter({ target, suffix }: { target: number, suffix: string }) {
  const counterRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const counter = counterRef.current;
    if (!counter) return;

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

type ContentItem = {
  id: string;
  type: string;
  title: string;
  content: string;
  date: string;
  status: "Published" | "Draft";
};

export default function ImpactPage() {
  const [dynamicStories, setDynamicStories] = useState<ContentItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("asi_content");
    if (saved) {
      const allContent: ContentItem[] = JSON.parse(saved);
      const stories = allContent.filter(item => item.type === "Impact Stories" && item.status === "Published");
      setDynamicStories(stories);
    }
  }, []);

  return (
    <>


      {/* Key Metrics Bento Grid */}
      <section className="py-24 bg-surface px-4 md:px-8 max-w-[1200px] mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold text-primary mb-4">2023 at a Glance</h2>
          <div className="h-1 w-20 bg-primary-container mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Large Card */}
          <div className="md:col-span-2 bg-surface-container-low p-8 rounded-xl border border-outline-variant shadow-[var(--shadow-card)] flex flex-col justify-between">
            <div>
              <span className="material-symbols-outlined text-primary text-4xl mb-4">groups</span>
              <AnimatedCounter target={2500} suffix="+" />
              <p className="text-xl font-semibold text-on-surface-variant">Seniors Supported</p>
            </div>
            <p className="text-base mt-6 opacity-75">Providing consistent companionship and digital literacy support to elders in assisted living and private homes.</p>
          </div>
          {/* Vertical Tall Card */}
          <div className="bg-secondary-container p-8 rounded-xl border border-outline-variant shadow-[var(--shadow-card)] flex flex-col justify-center items-center text-center">
            <span className="material-symbols-outlined text-on-secondary-container text-5xl mb-4">schedule</span>
            <AnimatedCounter target={12} suffix="k+" />
            <p className="text-sm font-bold uppercase tracking-wider text-on-secondary-container">Volunteer Hours</p>
          </div>
          {/* Split Cards */}
          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-highest p-6 rounded-xl flex-1 border border-outline-variant flex items-center gap-4">
              <div className="p-3 bg-white rounded-lg"><span className="material-symbols-outlined text-primary">volunteer_activism</span></div>
              <div>
                <AnimatedCounter target={1200} suffix="+" />
                <div className="text-sm font-medium">Youth Volunteers</div>
              </div>
            </div>
            <div className="bg-primary p-6 rounded-xl flex-1 text-white border border-outline-variant flex items-center gap-4">
              <div className="p-3 bg-primary-container rounded-lg"><span className="material-symbols-outlined">location_on</span></div>
              <div>
                <AnimatedCounter target={45} suffix="" />
                <div className="text-sm font-medium">Cities Reached</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 bg-surface-container-low">
        <div className="px-4 md:px-8 max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold text-primary mb-4">Stories of Change</h2>
              <p className="text-lg text-on-surface-variant">Real connections, real transformation. Meet the people at the heart of AgeSense Initiative.</p>
            </div>
            <button className="text-sm font-bold text-primary flex items-center gap-2 hover:underline">
              View All Stories <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Dynamic Stories from Admin */}
            {dynamicStories.map((story) => (
              <div key={story.id} className="lg:col-span-12 bg-white rounded-2xl overflow-hidden border border-outline-variant shadow-[var(--shadow-card)]">
                <div className="p-8 md:p-12">
                  <div className="bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-2 py-1 rounded mb-4 inline-block w-fit">NEW STORY</div>
                  <span className="material-symbols-outlined text-primary-container text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                  <p className="text-lg italic text-on-surface mb-6">"{story.content}"</p>
                  <div className="text-xl font-semibold">— {story.title}</div>
                  <p className="text-sm text-outline mt-2">{story.date}</p>
                </div>
              </div>
            ))}

            {/* Featured Story */}
            <div className="lg:col-span-7 bg-white rounded-2xl overflow-hidden border border-outline-variant shadow-[var(--shadow-card)]">
              <div className="grid md:grid-cols-2 h-full">
                <div className="relative h-64 md:h-full">
                  <img className="absolute inset-0 w-full h-full object-cover" alt="Martha and Arthur" src="/img/IMG-20250318-WA0076.jpg" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-2 py-1 rounded mb-4 inline-block w-fit">SENIOR SPOTLIGHT</div>
                  <span className="material-symbols-outlined text-primary-container text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                  <p className="text-lg italic text-on-surface mb-6">"I didn't just get help with my phone; I gained a grandson. Arthur visits me every Tuesday, and we share stories over tea. I feel young again."</p>
                  <div className="text-xl font-semibold">— Martha, 82</div>
                </div>
              </div>
            </div>
            {/* Secondary Story */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="bg-white p-8 rounded-2xl border border-outline-variant shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center flex-shrink-0 text-outline-variant">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant">person</span>
                  </div>
                  <div>
                    <div className="text-xl font-semibold">Arthur, 19</div>
                    <div className="text-sm font-medium text-primary">Volunteer Lead</div>
                  </div>
                </div>
                <p className="text-base text-on-surface-variant italic mb-0">"Volunteering with AgeSense changed my career path. I've learned that wisdom has no expiration date. It's the most rewarding part of my week."</p>
              </div>
              <div className="bg-primary text-white p-8 rounded-2xl border border-outline-variant flex flex-col items-center justify-center text-center">
                <h4 className="text-xl font-semibold mb-2">Want to make an impact?</h4>
                <p className="text-base opacity-80 mb-6">Join 1,200+ youth making a difference.</p>
                <Link href="/volunteer" className="w-full bg-white text-primary font-bold py-3 rounded-lg hover:bg-surface-bright transition-colors">Become a Volunteer</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
