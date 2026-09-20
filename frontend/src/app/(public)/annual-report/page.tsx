import Link from "next/link";
import { getPublishedAnnualReports } from "@/services/annual-reports.service";

export const metadata = {
  title: "Annual Reports — AgeSense Initiative",
  description: "Download verified annual progress, operational impact, and financial transparency disclosures.",
};

export default async function AnnualReportsPage() {
  let reports: import("@/types").AnnualReport[] = [];
  try {
    reports = await getPublishedAnnualReports();
  } catch (err) {}

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
            Transparency &amp; Accountability
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
            Annual Reports
          </h1>
          <p className="text-lg text-on-surface-variant font-medium leading-relaxed max-w-2xl">
            We hold ourselves to the highest standards of civic governance. Download our yearly progress and accountability audits.
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="bg-surface-container-lowest p-12 rounded-3xl border border-outline-variant text-center space-y-4">
            <span className="material-symbols-outlined text-5xl text-primary/40">description</span>
            <h3 className="text-lg font-bold text-on-surface">Annual Reports Being Finalized</h3>
            <p className="text-sm text-surface-variant max-w-md mx-auto">
              Our inaugural comprehensive impact and financial audit reports are currently being prepared for publication. Please check back shortly.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm hover:border-primary transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex flex-col items-center justify-center text-primary shrink-0">
                    <span className="text-xs uppercase font-bold tracking-wider">Year</span>
                    <span className="text-xl font-black font-mono leading-none">{report.year}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-on-surface">{report.title}</h3>
                    {report.description && (
                      <p className="text-sm text-on-surface-variant leading-relaxed max-w-xl">
                        {report.description}
                      </p>
                    )}
                  </div>
                </div>

                {report.pdf_url ? (
                  <a
                    href={report.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm flex items-center gap-2 shrink-0 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                    <span>Download Report (PDF)</span>
                  </a>
                ) : (
                  <span className="text-xs text-surface-variant font-medium px-4 py-2 rounded-lg bg-surface-container">
                    Archived Document
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
