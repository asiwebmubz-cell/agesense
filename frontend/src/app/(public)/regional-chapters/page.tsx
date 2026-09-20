import Link from "next/link";
import { getActiveBranches } from "@/services/branches.service";
import { getActiveTeam } from "@/services/team.service";

export const metadata = {
  title: "Regional Chapters — AgeSense Initiative",
  description: "Discover AgeSense regional chapters across Bangladesh, including Dhaka headquarters and Rajshahi.",
};

export default async function RegionalChaptersPage() {
  let branches: import("@/types").Branch[] = [];
  let team: import("@/types").TeamMember[] = [];
  try {
    const [b, t] = await Promise.all([
      getActiveBranches(),
      getActiveTeam(),
    ]);
    branches = b;
    team = t;
  } catch (err) {}

  return (
    <div className="bg-surface min-h-screen py-16 md:py-24">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 space-y-16">
        <div className="space-y-4">
          <Link
            href="/who-we-are"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Who We Are
          </Link>
          <span className="inline-block px-4 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold uppercase tracking-wider">
            Nationwide Presence
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
            Regional Chapters
          </h1>
          <p className="text-lg text-on-surface-variant font-medium leading-relaxed max-w-3xl">
            From our central headquarters in Dhaka to our pioneering regional chapter in Rajshahi, our decentralized chapters empower local youth to protect elderly citizens.
          </p>
        </div>

        {branches.length === 0 ? (
          <div className="bg-surface-container-lowest p-12 rounded-3xl border border-outline-variant text-center text-surface-variant">
            Regional chapter details are currently being updated.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {branches.map((branch) => {
              const branchMembers = team.filter((m) => m.branch_id === branch.id);

              return (
                <div
                  key={branch.id}
                  className="bg-surface-container-lowest rounded-3xl border border-outline-variant overflow-hidden shadow-sm hover:border-primary transition-all flex flex-col justify-between"
                >
                  <div>
                    {branch.image_url ? (
                      <div className="h-48 w-full overflow-hidden">
                        <img
                          src={branch.image_url}
                          alt={branch.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-32 bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-primary/40">location_city</span>
                      </div>
                    )}

                    <div className="p-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {branch.division} Division
                        </span>
                        {branch.location && (
                          <span className="text-xs text-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">pin_drop</span>
                            {branch.location}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold text-on-surface">{branch.name}</h2>

                      {branch.description && (
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                          {branch.description}
                        </p>
                      )}

                      {branchMembers.length > 0 && (
                        <div className="pt-4 border-t border-outline-variant/30">
                          <p className="text-xs font-semibold text-surface-variant mb-2">
                            Active Chapter Leadership ({branchMembers.length}):
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {branchMembers.slice(0, 4).map((bm) => (
                              <span
                                key={bm.id}
                                className="text-xs px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-medium"
                              >
                                {bm.name} ({bm.position})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-8 pt-0 flex items-center justify-between">
                    <Link
                      href={`/volunteer?branch=${branch.id}`}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      Volunteer in {branch.name.split(" ")[0]} &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-surface-container-low p-8 md:p-12 rounded-3xl border border-outline-variant text-center space-y-4">
          <h3 className="text-2xl font-bold text-primary">Start a Chapter in Your City</h3>
          <p className="text-sm text-surface-variant max-w-xl mx-auto">
            Are you a student or young professional passionate about elder care in Chittagong, Sylhet, Khulna, or beyond? Partner with AgeSense to establish a local chapter.
          </p>
          <div className="pt-2">
            <Link
              href="/partner"
              className="inline-block px-6 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm"
            >
              Propose a Regional Partnership
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
