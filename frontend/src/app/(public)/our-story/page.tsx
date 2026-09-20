import Link from "next/link";
import { getSiteContent } from "@/services/site-content.service";

export const metadata = {
  title: "Our Story — AgeSense Initiative",
  description: "The founding genesis, mission, and journey of AgeSense Initiative across Bangladesh.",
};

export default async function OurStoryPage() {
  let content = null;
  try {
    content = await getSiteContent("our_story");
  } catch (err) {
    // Graceful fallback if backend is offline or empty
  }

  const title = content?.title || "Our Story";
  const body =
    content?.body ||
    "AgeSense Initiative was founded on the conviction that aging should be a phase of dignity, respect, and deep community belonging. Across Bangladesh, our intergenerational network of youth volunteers and community leaders is transforming how society supports and values older adults.";

  return (
    <div className="bg-surface min-h-screen py-16 md:py-24">
      <div className="max-w-[900px] mx-auto px-4 md:px-8 space-y-12">
        <div className="space-y-4">
          <Link
            href="/who-we-are"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Who We Are
          </Link>
          <span className="inline-block px-4 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold uppercase tracking-wider">
            Origins &amp; Journey
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
            {title}
          </h1>
          <p className="text-lg text-on-surface-variant font-medium leading-relaxed">
            Pioneering a compassionate movement of young leaders ensuring no elder is left isolated.
          </p>
        </div>

        <article className="bg-surface-container-lowest p-8 md:p-12 rounded-3xl border border-outline-variant shadow-sm space-y-6">
          <div className="prose prose-lg max-w-none text-on-surface leading-relaxed whitespace-pre-line">
            {body}
          </div>
        </article>

        <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Explore Our Leadership</h3>
            <p className="text-sm text-surface-variant">
              Meet our Executive Committee, Advisory Board, and regional chapter directors.
            </p>
          </div>
          <Link
            href="/team"
            className="px-6 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm shrink-0"
          >
            Meet The Team
          </Link>
        </div>
      </div>
    </div>
  );
}
