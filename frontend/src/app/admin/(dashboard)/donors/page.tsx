"use client";

import { useState } from "react";

export default function DonorsAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const donors = [
    { id: 1, initials: "EH", name: "Eleanor Henderson", email: "eleanor.h@example.com", amount: "$500.00", txId: "TXN-94021-X", date: "Oct 24, 2023", status: "Completed", bg: "bg-secondary-container text-on-secondary-container" },
    { id: 2, initials: "MK", name: "Marcus Knight", email: "m.knight@foundation.org", amount: "$1,250.00", txId: "TXN-88102-L", date: "Oct 23, 2023", status: "Completed", bg: "bg-primary-container text-on-primary-container" },
    { id: 3, initials: "SW", name: "Sarah Willow", email: "sarah.willow@web.me", amount: "$50.00", txId: "TXN-77341-M", date: "Oct 22, 2023", status: "Completed", bg: "bg-tertiary-fixed text-on-tertiary-fixed" },
    { id: 4, initials: "JP", name: "Julian Pearce", email: "jpearce@techcorp.com", amount: "$2,500.00", txId: "TXN-10034-Z", date: "Oct 21, 2023", status: "Pending", bg: "bg-secondary-fixed text-on-secondary-fixed" },
    { id: 5, initials: "AL", name: "Anita Lee", email: "anita.lee@design.io", amount: "$150.00", txId: "TXN-45621-R", date: "Oct 20, 2023", status: "Completed", bg: "bg-on-secondary-container text-on-secondary" }
  ];

  const filteredDonors = donors.filter(donor => 
    donor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.txId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-on-surface">Donor Records</h1>
          <p className="text-base text-on-surface-variant mt-1">Manage and track contributions from our community partners.</p>
        </div>
        {/* Search Bar */}
        <div className="relative w-full md:w-96 group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-base group-focus-within:shadow-sm" 
            placeholder="Search by name, email or TXN ID..." 
            type="text" 
          />
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-between h-32 hover:border-primary/30 transition-colors">
          <span className="text-sm font-medium text-secondary uppercase tracking-wider">Total Revenue</span>
          <span className="text-xl font-semibold text-on-surface">$142,500.00</span>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-between h-32 hover:border-primary/30 transition-colors">
          <span className="text-sm font-medium text-secondary uppercase tracking-wider">Active Donors</span>
          <span className="text-xl font-semibold text-on-surface">1,284</span>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-between h-32 hover:border-primary/30 transition-colors">
          <span className="text-sm font-medium text-secondary uppercase tracking-wider">Avg Donation</span>
          <span className="text-xl font-semibold text-on-surface">$110.98</span>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-between h-32 hover:border-primary/30 transition-colors">
          <span className="text-sm font-medium text-secondary uppercase tracking-wider">Monthly Growth</span>
          <span className="text-xl font-semibold text-primary">+12.4%</span>
        </div>
      </div>

      {/* Transactions Table Card */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
          <h3 className="text-xl font-semibold text-on-surface">Recent Donations</h3>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-surface-variant/20 rounded-lg transition-colors border border-outline-variant">
              <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
            </button>
            <button className="p-2 hover:bg-surface-variant/20 rounded-lg transition-colors border border-outline-variant">
              <span className="material-symbols-outlined text-on-surface-variant">download</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low/30 border-b border-outline-variant">
                <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider">Donor Name</th>
                <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-sm font-medium text-outline uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {filteredDonors.map((donor) => (
                <tr key={donor.id} className="hover:bg-surface-container-low transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${donor.bg}`}>
                        {donor.initials}
                      </div>
                      <span className="text-base font-semibold text-on-surface">{donor.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-base text-on-surface-variant">{donor.email}</td>
                  <td className="px-6 py-4 text-base font-bold text-on-surface text-right">{donor.amount}</td>
                  <td className="px-6 py-4 text-base font-mono text-outline">{donor.txId}</td>
                  <td className="px-6 py-4 text-base text-on-surface-variant">{donor.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase ${donor.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-surface-container-highest text-outline'}`}>
                      {donor.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredDonors.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">
                    No donors found matching &quot;{searchTerm}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-6 border-t border-outline-variant flex items-center justify-between bg-surface-container-low/30">
          <p className="text-sm font-medium text-on-surface-variant">Showing 1 to {filteredDonors.length} of 1,284 entries</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-variant/20 transition-colors">Previous</button>
            <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">Next</button>
          </div>
        </div>
      </section>

      {/* Featured Donor Insight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-primary-container p-8 rounded-xl text-on-primary-container relative overflow-hidden group">
          <div className="relative z-10">
            <h4 className="text-3xl font-bold mb-4">Donor Appreciation Month</h4>
            <p className="text-lg max-w-lg mb-6 opacity-90">Our &apos;Platinum&apos; donor tier has increased by 15% this quarter. Consider reaching out to our top 50 donors for the upcoming annual gala event.</p>
            <button className="px-6 py-3 bg-white text-primary font-bold rounded-lg hover:shadow-xl transition-all">View Top Donors</button>
          </div>
          {/* Decorative Element */}
          <div className="absolute -right-12 -bottom-12 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined !text-[240px]">volunteer_activism</span>
          </div>
        </div>
        <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant flex flex-col justify-center items-center text-center hover:border-primary/50 transition-colors">
          <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-on-secondary-container !text-3xl">mail</span>
          </div>
          <h4 className="text-xl font-bold text-on-surface mb-2">Email Campaigns</h4>
          <p className="text-base text-on-surface-variant mb-6">Schedule the monthly impact report to all active donors.</p>
          <button className="w-full py-3 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors">Setup Campaign</button>
        </div>
      </div>
    </div>
  );
}
