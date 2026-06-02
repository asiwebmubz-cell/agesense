"use client";

import { useState } from "react";

export default function VolunteersAdminPage() {
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted'>('pending');
  
  const [applications, setApplications] = useState([
    { id: 1, initials: "JS", name: "James Sullivan", email: "j.sullivan@example.com", skills: ["Medical", "Logistics"], bg: "bg-secondary-container text-on-secondary-container", status: "Pending" },
    { id: 2, initials: "MR", name: "Maria Rodriguez", email: "m.rodriguez@domain.org", skills: ["Elderly Care", "Spanish"], bg: "bg-primary-fixed text-on-primary-fixed-variant", status: "Pending" },
    { id: 3, initials: "AL", name: "Arthur Lee", email: "lee.arthur@webmail.com", skills: ["Driver"], bg: "bg-on-tertiary-fixed-variant text-white", status: "Pending" }
  ]);

  const [acceptedVolunteers, setAcceptedVolunteers] = useState([
    { id: 4, initials: "SJ", name: "Sarah Jenkins", email: "sarah.j@email.com", skills: ["IT Support"], bg: "bg-primary-container text-on-primary-container", status: "Active" },
    { id: 5, initials: "DK", name: "David Kim", email: "dkim88@webmail.com", skills: ["Gardening", "Driver"], bg: "bg-tertiary-container text-on-tertiary-container", status: "Active" }
  ]);

  const handleApprove = (id: number) => {
    const appToApprove = applications.find(app => app.id === id);
    if (appToApprove) {
      // Move to accepted
      setAcceptedVolunteers(prev => [...prev, { ...appToApprove, status: "Active" }]);
      // Remove from pending
      setApplications(prev => prev.filter(app => app.id !== id));
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleReject = (id: number) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const displayData = activeTab === 'pending' ? applications : acceptedVolunteers;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto w-full">
      {/* Bento Grid Header: Key Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Volunteers */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container rounded-lg text-on-secondary-container">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-primary font-bold text-sm">+12% vs last month</span>
          </div>
          <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Total Volunteers</h3>
          <p className="text-4xl font-bold text-primary mt-1">{1284 + acceptedVolunteers.length}</p>
        </div>
        {/* Recent Donors */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-tertiary-fixed rounded-lg text-on-tertiary-fixed">
              <span className="material-symbols-outlined">volunteer_activism</span>
            </div>
            <span className="text-tertiary font-bold text-sm">24 new today</span>
          </div>
          <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Recent Donors</h3>
          <p className="text-4xl font-bold text-tertiary mt-1">452</p>
        </div>
        {/* Active Programs */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-container rounded-lg text-on-primary-container">
              <span className="material-symbols-outlined">rocket_launch</span>
            </div>
            <div className="flex -space-x-2">
              <img className="w-8 h-8 rounded-full border-2 border-surface" alt="Leader" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd5dpO0N1Fr9HAu4D1NZbt82E5DDR2EqZWI8VOaa42HPVbb5jd--Ks9ok5E7EuSGGQ18BfA3b88fdjns2aiFVxF8PCop7KKxRQivWb357WALrQC9G8Q9x8jeATbGUM780vMg52J1BUPvdSHk7xeL0B-I6fd90htM2tBaBZ3owiWgaMlGyptJcjF4VZWJ7w554NzTB29UtQiDPHuiTOcaXoHf0fqEGWuOw-f5jqWjN5h_2od0RTEYyPy5VA3HqL2459cSYaTfAo48_6" />
              <img className="w-8 h-8 rounded-full border-2 border-surface" alt="Coordinator" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzIZKQWGyei_J9a9ZCpCGJRaYjH5e8zj559dXnNtG6YtDAQstddjzWLutcfsjdGZLECD0JMbLOrkqSeQBNBoUxhKz_ADK3yLYnjgOkFjEbC_4Cyjng_9tX6_xqeV9zJCMPo2mG0l5437RBcfaL55Ih-yUrv71kwm7VUtHFz9cjhDhDYLj41K0GeNEkVeLMa2jaum4BD1ATPfBzxEd7tAVD3EI1-DT2jpXKxgnqiWqJGb0lCOTxAUqrWlEthbbgPcVNBIzSsx7xbz40" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Active Programs</h3>
          <p className="text-4xl font-bold text-primary-container mt-1">18</p>
        </div>
      </section>

      {/* Main Table Section */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        
        {/* Header & Tabs */}
        <div className="px-6 pt-5 border-b border-outline-variant flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-on-surface">Volunteer Management</h3>
              <p className="text-sm font-medium text-on-surface-variant">Review new applications and manage active volunteers.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input className="pl-10 pr-4 py-2 bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base w-full md:w-64 transition-transform group-focus-within:scale-105" placeholder="Search..." type="text" />
              </div>
              <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-6 mt-2">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
            >
              Pending Applications ({applications.length})
            </button>
            <button 
              onClick={() => setActiveTab('accepted')}
              className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'accepted' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
            >
              Accepted Volunteers ({acceptedVolunteers.length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant">
                <th className="px-6 py-4 text-sm font-medium">Name</th>
                <th className="px-6 py-4 text-sm font-medium">Email</th>
                <th className="px-6 py-4 text-sm font-medium">Skills</th>
                <th className="px-6 py-4 text-sm font-medium text-center">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {displayData.map((person) => (
                <tr key={person.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${person.bg}`}>
                        {person.initials}
                      </div>
                      <span className="font-bold text-on-surface">{person.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-base text-on-surface-variant">{person.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {person.skills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant rounded text-[12px] font-bold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {person.status === 'Pending' ? (
                      <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-[12px] font-bold">{person.status}</span>
                    ) : (
                      <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-[12px] font-bold">{person.status}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {activeTab === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(person.id)} className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors" title="Approve">
                            <span className="material-symbols-outlined">check_circle</span>
                          </button>
                          <button onClick={() => handleReject(person.id)} className="p-2 text-error hover:bg-error/10 rounded-full transition-colors" title="Reject">
                            <span className="material-symbols-outlined">cancel</span>
                          </button>
                        </>
                      )}
                      {activeTab === 'accepted' && (
                        <button className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors" title="Edit Assignment">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      )}
                      <button className="p-2 text-outline hover:bg-surface-variant/20 rounded-full transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {displayData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                    No records found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
          <span className="text-sm font-medium text-on-surface-variant">Showing {displayData.length} records</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-medium hover:bg-surface transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-medium hover:bg-surface transition-colors disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </section>

      {/* Featured Visual: Mission Banner */}
      <section className="relative h-48 rounded-2xl overflow-hidden group">
        <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Community Center" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDR90J_YsbPTeJjk7wWgowj4V1-Un6CFfOXf1LQLdrcvq44kNtnqUZRTsQZOLadAXEBZ8AOFXP5gnmnrqbvH8QC4aiYZeJgmyZNdw2YLCNzpJ71tq-EDcymyw4NkAhYQUN4e9Nzk28cTWvisrtlQ85DlB_fDRmBRF2DgefDHLPu3gPRCiO1jL_Y7oc151HMrAK942b3SnkHCIryO8zehHqmsiKOtCpF_tx5XC5DdXTw8pJO9Kcd2X0gCyUv-R4jVTJZw7zHn_AX9N0l" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent flex items-center px-6 md:px-12">
          <div className="max-w-md">
            <h4 className="text-white text-xl font-semibold mb-2">Build a Stronger Community</h4>
            <p className="text-white/80 text-base">Your review ensures every volunteer is matched with the right senior beneficiary, fostering compassionate connections.</p>
          </div>
        </div>
      </section>

      {/* Success Toast Notification */}
      <div className={`fixed bottom-8 right-8 bg-on-surface text-surface px-6 py-4 rounded-xl shadow-[var(--shadow-card)] flex items-center gap-3 transition-all duration-300 z-50 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <span className="material-symbols-outlined text-primary-fixed-dim">check_circle</span>
        <span className="text-sm font-medium">Volunteer approved successfully.</span>
      </div>
    </div>
  );
}
