import Link from "next/link";
import { getPublishedPolicies } from "@/services/policies.service";

export const metadata = {
  title: "Policies & Standards — AgeSense Initiative",
  description: "Official institutional governance, elder safeguarding, and operational policies of AgeSense Initiative.",
};

export default async function PoliciesPage() {
  let policies: import("@/types").Policy[] = [];
  try {
    policies = await getPublishedPolicies();
  } catch (err) {}

  // Group by category
  const categories = Array.from(new Set(policies.map((p) => p.category || "General Governance")));

  return (
    <div className="bg-surface min-h-screen py-16 md:py-24">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 space-y-12">
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Home
          </Link>
          <span className="inline-block px-4 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold uppercase tracking-wider">
            Governance &amp; Safeguarding
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
            Policies &amp; Disclosures
          </h1>
          <p className="text-lg text-on-surface-variant font-medium leading-relaxed max-w-2xl">
            Our operational rules, ethics declarations, elder protection protocols, and financial accountability charters.
          </p>
        </div>

        {policies.length === 0 ? (
          <div className="bg-surface-container-lowest p-12 rounded-3xl border border-outline-variant text-center space-y-4">
            <span className="material-symbols-outlined text-5xl text-primary/40">policy</span>
            <h3 className="text-lg font-bold text-on-surface">Policies Under Annual Review</h3>
            <p className="text-sm text-surface-variant max-w-md mx-auto">
              Our organizational safeguarding policies and codes of conduct are currently undergoing scheduled board review.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {categories.map((cat) => {
              const catPolicies = policies.filter((p) => (p.category || "General Governance") === cat);

              return (
                <section key={cat} className="space-y-4">
                  <h2 className="text-xl font-bold text-primary border-b border-outline-variant/30 pb-2">
                    {cat}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {catPolicies.map((p) => (
                      <div
                        key={p.id}
                        className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:border-primary transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <h3 className="text-base font-bold text-on-surface">{p.title}</h3>
                          {p.description && (
                            <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                              {p.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-4 mt-2 border-t border-outline-variant/20 flex items-center justify-between">
                          {p.document_url ? (
                            <a
                              href={p.document_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-sm">open_in_new</span> Read Full Policy
                            </a>
                          ) : (
                            <span className="text-xs text-surface-variant">Internal Document</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
