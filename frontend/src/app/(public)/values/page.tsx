import Link from "next/link";
import { getSiteContent } from "@/services/site-content.service";

export const metadata = {
  title: "Our Values — AgeSense Initiative",
  description: "Core organizational values and ethical commitments guiding AgeSense Initiative.",
};

export default async function ValuesPage() {
  let content = null;
  try {
    content = await getSiteContent("values");
  } catch (err) {}

  const title = content?.title || "Our Values";
  const body =
    content?.body ||
    "Dignity & Compassion: Respecting the lifelong contribution of seniors.\nInclusion & Equity: Ensuring accessible support across all regions.\nCommunity Partnership: Empowering local leaders to drive elder care.\nTransparency & Accountability: Operating with integrity in every initiative.";

  // Split lines into structured bullet items if separated by newlines
  const valueItems = body.split("\n").filter((line) => line.trim().length > 0);

  return (
    <div className="bg-surface min-h-screen py-16 md:py-24">
      <div className="max-w-[960px] mx-auto px-4 md:px-8 space-y-12">
        <div className="space-y-4">
          <Link
            href="/who-we-are"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Who We Are
          </Link>
          <span className="inline-block px-4 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold uppercase tracking-wider">
            Guiding Principles
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
            {title}
          </h1>
          <p className="text-lg text-on-surface-variant font-medium leading-relaxed">
            The enduring ethical anchors informing every outreach, program, and regional expansion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {valueItems.map((val, idx) => {
            const [boldPart, ...rest] = val.split(":");
            return (
              <div
                key={idx}
                className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm hover:border-primary transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <span className="material-symbols-outlined text-2xl">
                      {idx === 0
                        ? "favorite"
                        : idx === 1
                        ? "public"
                        : idx === 2
                        ? "handshake"
                        : "verified_user"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-on-surface mb-2">
                    {rest.length > 0 ? boldPart.trim() : `Value ${idx + 1}`}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {rest.length > 0 ? rest.join(":").trim() : val.trim()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Institutional Policies</h3>
            <p className="text-sm text-surface-variant">
              Read our safeguarding protocols and operational code of conduct.
            </p>
          </div>
          <Link
            href="/policies"
            className="px-6 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm shrink-0"
          >
            View Policies
          </Link>
        </div>
      </div>
    </div>
  );
}
