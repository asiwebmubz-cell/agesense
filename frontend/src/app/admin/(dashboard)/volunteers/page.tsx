"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { getAllVolunteersAdmin, updateVolunteerStatusAdmin } from "@/services/volunteers.service";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

export default function VolunteersAdminPage() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Volunteer approved successfully.");
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted'>('pending');
  const [searchTerm, setSearchTerm] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { data: volunteers, loading, error, refetch } = useApi(getAllVolunteersAdmin);

  const handleApprove = async (id: string) => {
    try {
      await updateVolunteerStatusAdmin(id, 'Approved');
      setToastMessage("Volunteer approved successfully.");
      setShowToast(true);
      refetch();
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Failed to approve volunteer:", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateVolunteerStatusAdmin(id, 'Rejected');
      setToastMessage("Volunteer application rejected.");
      setShowToast(true);
      refetch();
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Failed to reject volunteer:", err);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/volunteers/admin/export`, {
        headers: {
          ...getAuthHeaders(),
        }
      });
      if (!response.ok) throw new Error("Excel export failed.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "volunteers.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download volunteers Excel sheet.");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "V";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getSkills = (v: any) => {
    if (Array.isArray(v.form_data_json?.skills)) return v.form_data_json.skills;
    if (typeof v.form_data_json?.skills === 'string') return [v.form_data_json.skills];
    return ["General"];
  };

  const applications = volunteers?.filter(v => v.status === 'Pending') || [];
  const acceptedVolunteers = volunteers?.filter(v => v.status === 'Approved') || [];
  const rawDisplayData = activeTab === 'pending' ? applications : acceptedVolunteers;

  const displayData = rawDisplayData.filter(v => 
    v.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          </div>
          <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Total Volunteers</h3>
          <p className="text-4xl font-bold text-primary mt-1">
            {volunteers ? volunteers.length : 0}
          </p>
        </div>
        {/* Active Volunteers */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-tertiary-fixed rounded-lg text-on-tertiary-fixed">
              <span className="material-symbols-outlined">volunteer_activism</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Approved Volunteers</h3>
          <p className="text-4xl font-bold text-tertiary mt-1">
            {acceptedVolunteers.length}
          </p>
        </div>
        {/* Pending Applications */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-container rounded-lg text-on-primary-container">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Pending Applications</h3>
          <p className="text-4xl font-bold text-primary-container mt-1">
            {applications.length}
          </p>
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
            <div className="flex items-center flex-wrap gap-2">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base w-full md:w-64 transition-transform group-focus-within:scale-105" 
                  placeholder="Search by name or email..." 
                  type="text" 
                />
              </div>
              <button 
                onClick={() => setIsHistoryOpen(true)}
                aria-label="See volunteer application logs"
                className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors flex items-center gap-2 text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">history</span>
                See History
              </button>
              <button 
                onClick={handleDownloadExcel}
                aria-label="Download Excel list of volunteers"
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold hover:shadow-md transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Download Excel
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
              Approved Volunteers ({acceptedVolunteers.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8">
            <LoadingSpinner count={3} message="Loading volunteer applications..." />
          </div>
        ) : error ? (
          <div className="p-8">
            <ErrorMessage message={error} onRetry={refetch} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant">
                  <th className="px-6 py-4 text-sm font-medium">Name</th>
                  <th className="px-6 py-4 text-sm font-medium">Email</th>
                  <th className="px-6 py-4 text-sm font-medium">Phone</th>
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
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-primary-container text-on-primary-container">
                          {getInitials(person.full_name)}
                        </div>
                        <span className="font-bold text-on-surface">{person.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-base text-on-surface-variant">{person.email}</td>
                    <td className="px-6 py-4 text-base text-on-surface-variant">{person.phone || "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {getSkills(person).map((skill: string) => (
                          <span key={skill} className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant rounded text-[12px] font-bold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                        person.status === 'Pending' 
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' 
                          : person.status === 'Approved'
                          ? 'bg-secondary-fixed text-on-secondary-fixed-variant'
                          : 'bg-error/10 text-error'
                      }`}>
                        {person.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {person.status === 'Pending' && (
                          <>
                            <button onClick={() => handleApprove(person.id)} className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors" title="Approve">
                              <span className="material-symbols-outlined">check_circle</span>
                            </button>
                            <button onClick={() => handleReject(person.id)} className="p-2 text-error hover:bg-error/10 rounded-full transition-colors" title="Reject">
                              <span className="material-symbols-outlined">cancel</span>
                            </button>
                          </>
                        )}
                        {person.status === 'Approved' && (
                          <button onClick={() => handleReject(person.id)} className="p-2 text-error hover:bg-error/10 rounded-full transition-colors" title="Revoke / Reject">
                            <span className="material-symbols-outlined">cancel</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {displayData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
          <span className="text-sm font-medium text-on-surface-variant">Showing {displayData.length} records</span>
        </div>
      </section>

      {/* See History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <header className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span>
                  Volunteer Application History Logs
                </h3>
                <p className="text-sm text-on-surface-variant font-medium">All logged submissions and operational status updates.</p>
              </div>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="p-2 hover:bg-surface-variant/20 rounded-full transition-colors text-on-surface-variant"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            
            <div className="p-6 overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant text-sm font-bold text-outline">
                    <th className="pb-3">Applicant Name</th>
                    <th className="pb-3">Email Address</th>
                    <th className="pb-3">Logged Status</th>
                    <th className="pb-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {volunteers?.map((v) => (
                    <tr key={v.id} className="text-sm">
                      <td className="py-3 font-semibold text-on-surface">{v.full_name}</td>
                      <td className="py-3 text-on-surface-variant">{v.email}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          v.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          v.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-outline">
                        {v.created_at ? new Date(v.created_at).toLocaleString() : ''}
                      </td>
                    </tr>
                  ))}
                  {(!volunteers || volunteers.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-on-surface-variant italic">
                        No volunteer records logged in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <footer className="p-6 border-t border-outline-variant flex justify-end bg-surface-container-low">
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:shadow-md transition-all"
              >
                Close Logs
              </button>
            </footer>
          </div>
        </div>
      )}

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
        <span className="text-sm font-medium">{toastMessage}</span>
      </div>
    </div>
  );
}
