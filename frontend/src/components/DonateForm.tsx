"use client";

import { useState } from "react";

export default function DonateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Integrate with backend to save donation verification
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2 group">
          <label className="text-sm font-medium text-on-surface group-focus-within:text-primary transition-colors" htmlFor="full_name">Full Name</label>
          <input required className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all outline-none" id="full_name" placeholder="John Doe" type="text" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 group">
            <label className="text-sm font-medium text-on-surface group-focus-within:text-primary transition-colors" htmlFor="email">Email Address</label>
            <input required className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all outline-none" id="email" placeholder="john@example.com" type="email" />
          </div>
          <div className="space-y-2 group">
            <label className="text-sm font-medium text-on-surface group-focus-within:text-primary transition-colors" htmlFor="phone">Phone Number</label>
            <input required className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all outline-none" id="phone" placeholder="+880 1XXX-XXXXXX" type="tel" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 group">
            <label className="text-sm font-medium text-on-surface group-focus-within:text-primary transition-colors" htmlFor="amount">Amount (BDT)</label>
            <input required min="1" className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all outline-none" id="amount" placeholder="e.g. 5000" type="number" />
          </div>
          <div className="space-y-2 group">
            <label className="text-sm font-medium text-on-surface group-focus-within:text-primary transition-colors" htmlFor="trxid">Transaction ID</label>
            <input required className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all outline-none" id="trxid" placeholder="8X23M19A" type="text" />
          </div>
        </div>
      </div>
      <div className="pt-4">
        <button 
          disabled={isSubmitting || isSuccess}
          className={`font-bold py-3 px-10 rounded-lg transition-all transform active:scale-95 flex items-center gap-2 text-white ${isSuccess ? 'bg-green-600' : 'bg-primary hover:bg-primary-container'}`} 
          type="submit"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined animate-spin" style={{ fontVariationSettings: "'FILL' 1" }}>progress_activity</span> Processing...
            </>
          ) : isSuccess ? (
            <>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Verified Successfully!
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Submit Verification
            </>
          )}
        </button>
      </div>
    </form>
  );
}
