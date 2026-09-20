import Link from "next/link";
import { getActiveTeam } from "@/services/team.service";
import { getActiveBranches } from "@/services/branches.service";

export const metadata = {
  title: "Our Team & Governance — AgeSense Initiative",
  description: "Meet the Executive Committee, Advisory Board, and regional leadership driving AgeSense Initiative.",
};

export default async function TeamPage() {
  let teamMembers: import("@/types").TeamMember[] = [];
  let branches: import("@/types").Branch[] = [];
  try {
    const [t, b] = await Promise.all([
      getActiveTeam(),
      getActiveBranches(),
    ]);
    teamMembers = t;
    branches = b;
  } catch (err) {}

  const execCommittee = teamMembers.filter((m) => m.committee === "Executive Committee");
  const advisoryBoard = teamMembers.filter((m) => m.committee === "Advisory Board");

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
            Leadership &amp; Governance
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
            Our Team
          </h1>
          <p className="text-lg text-on-surface-variant font-medium leading-relaxed max-w-3xl">
            Passionate change-makers, medical professionals, and community builders united to ensure dignified care for older adults across Bangladesh.
          </p>
        </div>

        {/* Executive Committee */}
        <section className="space-y-8">
          <div className="border-b border-outline-variant/30 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Executive Committee</h2>
            <p className="text-sm text-surface-variant">
              Operational directors and department leads managing national programs and regional hubs.
            </p>
          </div>

          {execCommittee.length === 0 ? (
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant text-center text-sm text-surface-variant">
              Executive Committee profiles are currently being finalized.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {execCommittee.map((member) => (
                <div
                  key={member.id}
                  className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm hover:border-primary transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-primary/20 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-on-surface leading-tight">{member.name}</h3>
                        <p className="text-xs font-semibold text-primary">{member.position}</p>
                        {member.branch_name && (
                          <span className="inline-block mt-1 text-[11px] font-medium text-surface-variant bg-surface-container px-2 py-0.5 rounded">
                            {member.branch_name}
                          </span>
                        )}
                      </div>
                    </div>
                    {member.biography && (
                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-4">
                        {member.biography}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Advisory Board */}
        <section className="space-y-8">
          <div className="border-b border-outline-variant/30 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Advisory Board</h2>
            <p className="text-sm text-surface-variant">
              Senior advisors offering strategic guidance, medical expertise, and institutional oversight.
            </p>
          </div>

          {advisoryBoard.length === 0 ? (
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant text-center text-sm text-surface-variant">
              Advisory Board appointments are currently being updated.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {advisoryBoard.map((member) => (
                <div
                  key={member.id}
                  className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm hover:border-primary transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-primary/20 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-on-surface leading-tight">{member.name}</h3>
                        <p className="text-xs font-semibold text-primary">{member.position}</p>
                        {member.branch_name && (
                          <span className="inline-block mt-1 text-[11px] font-medium text-surface-variant bg-surface-container px-2 py-0.5 rounded">
                            {member.branch_name}
                          </span>
                        )}
                      </div>
                    </div>
                    {member.biography && (
                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-4">
                        {member.biography}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
