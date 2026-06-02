"use client";

import { useState } from "react";
import { submitDonationVerification } from "@/services/donors.service";

export default function DonateForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [trxId, setTrxId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await submitDonationVerification({
        name: fullName,
        email,
        amount: parseFloat(amount),
        transaction_id: trxId,
        payment_status: "Pending",
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {errorMsg && (
        <div className="p-4 rounded bg-error-container text-on-error-container text-sm">
          {errorMsg}
        </div>
      )}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2 group">
          <label className="text-sm font-medium text-on-surface group-focus-within:text-primary transition-colors" htmlFor="full_name">Full Name</label>
          <input 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required 
            className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all outline-none" 
            id="full_name" 
            placeholder="John Doe" 
            type="text" 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 group">
            <label className="text-sm font-medium text-on-surface group-focus-within:text-primary transition-colors" htmlFor="email">Email Address</label>
            <input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all outline-none" 
              id="email" 
              placeholder="john@example.com" 
              type="email" 
            />
          </div>
          <div className="space-y-2 group">
            <label className="text-sm font-medium text-on-surface group-focus-within:text-primary transition-colors" htmlFor="phone">Phone Number</label>
            <input 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all outline-none" 
              id="phone" 
              placeholder="+880 1XXX-XXXXXX" 
              type="tel" 
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 group">
            <label className="text-sm font-medium text-on-surface group-focus-within:text-primary transition-colors" htmlFor="amount">Amount (BDT)</label>
            <input 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required 
              min="1" 
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all outline-none" 
              id="amount" 
              placeholder="e.g. 5000" 
              type="number" 
            />
          </div>
          <div className="space-y-2 group">
            <label className="text-sm font-medium text-on-surface group-focus-within:text-primary transition-colors" htmlFor="trxid">Transaction ID</label>
            <input 
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              required 
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all outline-none" 
              id="trxid" 
              placeholder="8X23M19A" 
              type="text" 
            />
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
