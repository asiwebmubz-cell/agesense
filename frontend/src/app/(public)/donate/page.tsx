"use client";

import { useState } from "react";
import DonateForm from "@/components/DonateForm";

export default function DonatePage() {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => {
      setCopiedLabel(null);
    }, 2000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* SECTION 1: Support AgeSense Initiative (Hero Section) */}
      <section className="bg-brand-navy text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center relative z-10">
          <span className="bg-primary/20 text-primary-fixed-dim px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block border border-primary/30">
            Make an Impact
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Support AgeSense Initiative</h1>
          <p className="text-primary-fixed-dim text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
            Your contribution helps us deliver humanitarian assistance, community development programs, emergency response initiatives, and long-term social impact projects.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection("donor-membership")}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary rounded-xl font-bold hover:shadow-lg hover:bg-primary-container transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">volunteer_activism</span>
              Become a Donor Member
            </button>
            <button
              onClick={() => scrollToSection("verify-donation")}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">verified</span>
              Verify Donation
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: Donor Member Section */}
      <section id="donor-membership" className="py-20 bg-surface-container-low scroll-mt-6">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 md:p-12 shadow-md flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <span className="material-symbols-outlined text-4xl">diversity_1</span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface">Become a Donor Member</h2>
              </div>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Join our growing community of supporters and help sustain long-term impact. By becoming a registered donor member, you establish a consistent pillar of support for dignity-focused care initiatives.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-primary text-2xl shrink-0">check_circle</span>
                  <div>
                    <h4 className="font-semibold text-on-surface">Direct Impact</h4>
                    <p className="text-sm text-on-surface-variant">Your contributions go straight to field operations and senior care packages.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-primary text-2xl shrink-0">check_circle</span>
                  <div>
                    <h4 className="font-semibold text-on-surface">Transparency Logs</h4>
                    <p className="text-sm text-on-surface-variant">Receive audited impact logs, financial transparency reporting, and stories of change.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-96 p-8 bg-surface-container-low rounded-xl border border-outline-variant/60 flex flex-col justify-center text-center space-y-6 shrink-0">
              <span className="material-symbols-outlined text-6xl text-primary mx-auto">card_membership</span>
              <div>
                <h3 className="text-xl font-bold text-on-surface">Apply Now</h3>
                <p className="text-sm text-on-surface-variant mt-1">Submit your details to join our official members panel.</p>
              </div>
              <a
                href="https://forms.gle/TnqqFr6EUMn78xx97"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-xl transition-all shadow hover:shadow-md text-center block"
              >
                Apply as Donor Member
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Donation Accounts */}
      <section className="py-20 bg-surface-container-lowest border-y border-outline-variant/30">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-on-surface">Donation Accounts</h2>
            <p className="text-on-surface-variant mt-3 text-base">
              Use any of the official payment pathways listed below to make your transaction. Please copy details directly to avoid entry mistakes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mobile Banking Card */}
            <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3.5 bg-primary/10 rounded-2xl text-primary">
                    <span className="material-symbols-outlined text-4xl">phone_iphone</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-on-surface">Mobile Banking</h3>
                    <p className="text-sm text-on-surface-variant">Send Money transactions</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* bKash / Nagad */}
                  <div className="border-b border-outline-variant/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">bKash / Nagad</p>
                      <a href="tel:01603704398" className="font-mono text-2xl font-bold text-on-surface hover:text-primary transition-colors block">
                        01603704398
                      </a>
                      <p className="text-xs text-on-surface-variant mt-1">Transaction Type: <span className="font-semibold">Send Money</span></p>
                    </div>
                    <div className="flex gap-2">
                      <a href="tel:01603704398" className="sm:hidden px-4 py-2 border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface-variant/20 flex items-center gap-2 text-on-surface">
                        <span className="material-symbols-outlined text-[18px]">call</span> Call
                      </a>
                      <button
                        onClick={() => handleCopy("01603704398", "m1")}
                        className="px-4 py-2.5 bg-surface-container-highest text-on-surface-variant font-bold rounded-lg text-sm hover:bg-outline-variant/20 transition-all flex items-center gap-2 border border-outline-variant"
                      >
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                        {copiedLabel === "m1" ? "Copied ✓" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Rocket */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Rocket</p>
                      <a href="tel:01754492199" className="font-mono text-2xl font-bold text-on-surface hover:text-primary transition-colors block">
                        01754492199
                      </a>
                      <p className="text-xs text-on-surface-variant mt-1">Transaction Type: <span className="font-semibold">Send Money</span></p>
                    </div>
                    <div className="flex gap-2">
                      <a href="tel:01754492199" className="sm:hidden px-4 py-2 border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface-variant/20 flex items-center gap-2 text-on-surface">
                        <span className="material-symbols-outlined text-[18px]">call</span> Call
                      </a>
                      <button
                        onClick={() => handleCopy("01754492199", "m2")}
                        className="px-4 py-2.5 bg-surface-container-highest text-on-surface-variant font-bold rounded-lg text-sm hover:bg-outline-variant/20 transition-all flex items-center gap-2 border border-outline-variant"
                      >
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                        {copiedLabel === "m2" ? "Copied ✓" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Transfer Card */}
            <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3.5 bg-primary/10 rounded-2xl text-primary">
                  <span className="material-symbols-outlined text-4xl">account_balance</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-on-surface">Bank Transfer</h3>
                  <p className="text-sm text-on-surface-variant">Direct bank remittance</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase">Account Name</p>
                  <p className="font-bold text-lg text-on-surface mt-0.5">AZRAF KHAN ZARIF</p>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase">Account Number</p>
                    <p className="font-mono font-bold text-lg text-on-surface mt-0.5">1077272370001</p>
                  </div>
                  <button
                    onClick={() => handleCopy("1077272370001", "b1")}
                    className="p-2 bg-surface-container-highest border border-outline-variant rounded-lg text-on-surface-variant hover:bg-outline-variant/20 transition-colors"
                    title="Copy Account Number"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {copiedLabel === "b1" ? "done" : "content_copy"}
                    </span>
                  </button>
                </div>

                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase">Bank Name</p>
                  <p className="font-bold text-lg text-on-surface mt-0.5">BRAC Bank PLC</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase">Branch Name</p>
                  <p className="font-bold text-lg text-on-surface mt-0.5">SOUTH BONOSREE SUB BRANCH</p>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase">Routing Number</p>
                    <p className="font-mono font-bold text-lg text-on-surface mt-0.5">060260727</p>
                  </div>
                  <button
                    onClick={() => handleCopy("060260727", "b2")}
                    className="p-2 bg-surface-container-highest border border-outline-variant rounded-lg text-on-surface-variant hover:bg-outline-variant/20 transition-colors"
                    title="Copy Routing Number"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {copiedLabel === "b2" ? "done" : "content_copy"}
                    </span>
                  </button>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase">SWIFT Code</p>
                    <p className="font-mono font-bold text-lg text-on-surface mt-0.5">BRAKBDDH</p>
                  </div>
                  <button
                    onClick={() => handleCopy("BRAKBDDH", "b3")}
                    className="p-2 bg-surface-container-highest border border-outline-variant rounded-lg text-on-surface-variant hover:bg-outline-variant/20 transition-colors"
                    title="Copy SWIFT Code"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {copiedLabel === "b3" ? "done" : "content_copy"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Donation Verification Form */}
      <section id="verify-donation" className="py-20 bg-surface-container-low scroll-mt-6">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-surface-container-lowest p-8 md:p-12 rounded-2xl border border-outline-variant shadow-lg">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-3xl font-bold text-on-surface mb-2">Verify Your Donation</h2>
              <p className="text-on-surface-variant text-base">Please fill out this form after completing your transfer so we can acknowledge your gift.</p>
            </div>
            <DonateForm />
          </div>
        </div>
      </section>

      {/* Impact Visual (Atmospheric) */}
      <section className="h-80 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-primary opacity-20"></div>
        <img className="w-full h-full object-cover grayscale mix-blend-overlay" alt="Impact Visual" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVj-fyGnFa-itDnavJRRm899JLjHZMxYVSlef9Co0eRATbYbyMQaHdA6dzZxH0buaea-ypzWoZ5tVsFCXtTaXAW4u0XN1VKln_pKTpSBEa2akRtWbg98jnvY6uTNi5kPgx9zffneNPr-EG-Gr0zQfdxgsKBtCmdUbwAUVofLI2i5gN-optD9hUxTdAa7fClZZ47Q9bq433VHshoTfST1mxWlFeeI_ZGUVJq7uv_M5BMK7VWSyOVbzi9tHqTOyFw--5k0m4TjdGd341" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-2xl md:text-3xl font-semibold text-on-primary-fixed bg-primary-fixed/80 backdrop-blur-sm px-8 py-4 rounded-full inline-block shadow">
              Check Our Fund Usage Policy
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
