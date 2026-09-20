import Link from "next/link";
import { getSiteContent } from "@/services/site-content.service";

export const metadata = {
  title: "Founder's Statement — AgeSense Initiative",
  description: "Official inaugural address and vision statement from the founder of AgeSense Initiative.",
};

export default async function FoundersStatementPage() {
  let content = null;
  try {
    content = await getSiteContent("founder_statement");
  } catch (err) {}

  const title = content?.title || "Founder's Statement";
  const body =
    content?.body ||
    `When I founded AgeSense Initiative, I believed that every older person deserves to age with dignity, respect, and the support of a caring community. Today, that belief continues to guide every project we undertake and every decision we make.

The 2025–26 financial year has been one of meaningful growth for our organization. Together with our volunteers, donors, partners, and well-wishers, we delivered five major programs, expanded our work beyond Dhaka by establishing our first regional branch in Rajshahi, and reached more than 1,100 individuals and families. More importantly, we strengthened the foundation of an organization that is committed to creating lasting impact for older adults across Bangladesh.

While these achievements are encouraging, they also remind us how much work remains. Thousands of older people continue to face challenges related to health, financial insecurity, loneliness, and social exclusion. Addressing these issues requires more than one-time assistance—it requires long-term commitment, innovation, partnerships, and stronger connections between generations.

This year, we also took important steps toward that future by strengthening our internal systems, expanding our volunteer network, and laying the groundwork for new initiatives focused on healthy ageing, community engagement, and sustainable impact. These efforts reflect our commitment to building an organization that can serve older adults more effectively for years to come.

None of this would have been possible without the dedication of our volunteers, the generosity of our donors, the trust of our beneficiaries, and the encouragement of our partners. I extend my heartfelt gratitude to everyone who has stood beside AgeSense Initiative throughout this journey.

As we look ahead, we remain committed to advancing healthy ageing, dignity, social inclusion, and stronger connections between generations through community action, innovation, and partnerships. We invite you to continue this journey with us as we work toward an age-inclusive Bangladesh where every older person can live with dignity, purpose, and hope.

Azraf Khan Zarif
Founder & Executive Director
AgeSense Initiative`;
  const portraitUrl = content?.metadata?.image_url || "";

  return (
    <div className="bg-surface min-h-screen py-16 md:py-24">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 space-y-12">
        <div className="space-y-4">
          <Link
            href="/who-we-are"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Who We Are
          </Link>
          <span className="inline-block px-4 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold uppercase tracking-wider">
            Vision &amp; Leadership
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
            {title}
          </h1>
          <p className="text-lg text-on-surface-variant font-medium leading-relaxed">
            The foundational conviction inspiring the AgeSense movement across Bangladesh.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-8 md:p-12 rounded-3xl border border-outline-variant shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Portrait Column */}
          <div className="md:col-span-4 flex flex-col items-center text-center space-y-4">
            {portraitUrl ? (
              <img
                src={portraitUrl}
                alt="Founder Portrait"
                className="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover border-2 border-primary/20 shadow-md"
              />
            ) : (
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl bg-surface-container flex flex-col items-center justify-center border-2 border-dashed border-outline-variant text-surface-variant">
                <span className="material-symbols-outlined text-5xl mb-2 text-primary/40">person</span>
                <span className="text-xs font-medium">Founder Portrait</span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-on-surface">AgeSense Leadership</h3>
              <p className="text-xs text-surface-variant">Office of the Founder &amp; Board</p>
            </div>
          </div>

          {/* Statement Body Column */}
          <div className="md:col-span-8 space-y-6">
            <div className="flex items-center gap-2 text-primary/30">
              <span className="material-symbols-outlined text-4xl">format_quote</span>
            </div>
            <div className="prose prose-lg max-w-none text-on-surface leading-relaxed whitespace-pre-line text-base md:text-lg">
              {body}
            </div>
            <div className="pt-6 border-t border-outline-variant/30 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-primary">AgeSense Initiative</p>
                <p className="text-xs text-surface-variant">Dhaka &amp; Rajshahi, Bangladesh</p>
              </div>
              <Link
                href="/regional-chapters"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Explore Regional Chapters &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
