"use client";

import { useState } from "react";

export default function VolunteerPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showCustomSkill, setShowCustomSkill] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: document.getElementById('registration-form')?.offsetTop ? document.getElementById('registration-form')!.offsetTop - 100 : 0, behavior: 'smooth' });
    } else {
      alert('Thank you for joining AgeSense! We will contact you soon.');
      // Reset form or redirect
      setCurrentStep(1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="AgeSense Partnership" className="w-full h-full object-cover brightness-[0.85]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-VAEeiTtgprGhJVVUg0n6GDoz1dKpTFak_gmL9ePPIoDm_4sh-dXA-sqgkrQQ0ZZWkHJX9lrFTw364qkW8ZC_MphHv1hKrMDzrHF3GcWSN3ZqUDGb0KfU4GgbKPmugNVJwm5u1tGXouCrRuzM8Mdh2_nXel2LFquAm7HsSc29HEGH03QWvSUjlzd8_ncjHK6_7LwT4kwZ-D4gYeTAHaXt04TF0sysQcN_gt6_TpsYkQexcij8eikhyqhPBdU_Pt5UGzV6dpLhbNoB" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent"></div>
        </div>
        <div className="relative z-10 w-full px-4 md:px-8 max-w-[1200px] mx-auto py-12">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container text-sm font-medium mb-6">Join the Movement</span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">Empower Generations through Compassion</h1>
            <p className="text-lg text-on-surface-variant mb-8">Join the AgeSense Initiative. We bridge the gap between youth and seniors, creating a future where every age is valued and connected.</p>
            <a className="bg-primary text-on-primary px-8 py-4 rounded-full text-xl font-semibold inline-flex items-center gap-2 hover:shadow-lg transform hover:-translate-y-0.5 transition-all" href="#registration-form">
              Get Started
              <span className="material-symbols-outlined">arrow_downward</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-20 px-4 md:px-8 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Registration Form Column */}
          <div className="lg:col-span-8 scroll-mt-24" id="registration-form">
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[var(--shadow-card)] border border-outline-variant">
              {/* Multi-step Indicator */}
              <div className="flex justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-highest -z-10 -translate-y-1/2"></div>
                <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-500" 
                  style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                ></div>
                
                {/* Step 1 Indicator */}
                <div className={`flex flex-col items-center gap-2 transition-opacity ${currentStep >= 1 ? '' : 'opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep > 1 ? 'bg-secondary text-on-secondary' : 'bg-primary text-on-primary'}`}>
                    {currentStep > 1 ? <span className="material-symbols-outlined">check</span> : "1"}
                  </div>
                  <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-primary' : ''}`}>Identity</span>
                </div>
                
                {/* Step 2 Indicator */}
                <div className={`flex flex-col items-center gap-2 transition-opacity ${currentStep >= 2 ? '' : 'opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep > 2 ? 'bg-secondary text-on-secondary' : currentStep === 2 ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                    {currentStep > 2 ? <span className="material-symbols-outlined">check</span> : "2"}
                  </div>
                  <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-primary' : ''}`}>Skills</span>
                </div>
                
                {/* Step 3 Indicator */}
                <div className={`flex flex-col items-center gap-2 transition-opacity ${currentStep >= 3 ? '' : 'opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep === 3 ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                    3
                  </div>
                  <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-primary' : ''}`}>Availability</span>
                </div>
              </div>

              <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                {/* Step 1: Personal Information */}
                <div className={`transition-all duration-300 ${currentStep === 1 ? 'block' : 'hidden'}`}>
                  <h3 className="text-3xl font-semibold text-on-surface mb-6">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface-variant">Full Name</label>
                      <input required={currentStep === 1} className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="e.g. John Doe" type="text" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface-variant">Email Address</label>
                      <input required={currentStep === 1} className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="john@example.com" type="email" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-on-surface-variant">Phone Number</label>
                      <input required={currentStep === 1} className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="+1 (555) 000-0000" type="tel" />
                    </div>
                  </div>
                </div>

                {/* Step 2: Skills & Interests */}
                <div className={`transition-all duration-300 ${currentStep === 2 ? 'block' : 'hidden'}`}>
                  <h3 className="text-3xl font-semibold text-on-surface mb-6">Skills & Interests</h3>
                  <p className="text-base text-on-surface-variant mb-6">How would you like to contribute to our community?</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <label className="cursor-pointer group">
                      <input className="hidden peer" type="checkbox" />
                      <div className="p-6 rounded-xl border border-outline-variant bg-surface group-hover:border-primary peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-primary transition-all flex flex-col items-center text-center gap-3 h-full">
                        <span className="material-symbols-outlined text-4xl">devices</span>
                        <span className="text-sm font-medium">Digital Literacy</span>
                      </div>
                    </label>
                    <label className="cursor-pointer group">
                      <input className="hidden peer" type="checkbox" />
                      <div className="p-6 rounded-xl border border-outline-variant bg-surface group-hover:border-primary peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-primary transition-all flex flex-col items-center text-center gap-3 h-full">
                        <span className="material-symbols-outlined text-4xl">volunteer_activism</span>
                        <span className="text-sm font-medium">Companionship</span>
                      </div>
                    </label>
                    <label className="cursor-pointer group">
                      <input className="hidden peer" type="checkbox" />
                      <div className="p-6 rounded-xl border border-outline-variant bg-surface group-hover:border-primary peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-primary transition-all flex flex-col items-center text-center gap-3 h-full">
                        <span className="material-symbols-outlined text-4xl">local_shipping</span>
                        <span className="text-sm font-medium">Logistics</span>
                      </div>
                    </label>
                    <label className="cursor-pointer group">
                      <input className="hidden peer" type="checkbox" />
                      <div className="p-6 rounded-xl border border-outline-variant bg-surface group-hover:border-primary peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-primary transition-all flex flex-col items-center text-center gap-3 h-full">
                        <span className="material-symbols-outlined text-4xl">palette</span>
                        <span className="text-sm font-medium">Graphics Designer</span>
                      </div>
                    </label>
                    <label className="cursor-pointer group">
                      <input className="hidden peer" type="checkbox" />
                      <div className="p-6 rounded-xl border border-outline-variant bg-surface group-hover:border-primary peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-primary transition-all flex flex-col items-center text-center gap-3 h-full">
                        <span className="material-symbols-outlined text-4xl">science</span>
                        <span className="text-sm font-medium">RND</span>
                      </div>
                    </label>
                    <label className="cursor-pointer group">
                      <input 
                        className="hidden peer" 
                        type="checkbox" 
                        checked={showCustomSkill}
                        onChange={(e) => setShowCustomSkill(e.target.checked)}
                      />
                      <div className="p-6 rounded-xl border border-outline-variant bg-surface group-hover:border-primary peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-primary transition-all flex flex-col items-center text-center gap-3 h-full">
                        <span className="material-symbols-outlined text-4xl">more_horiz</span>
                        <span className="text-sm font-medium">etc</span>
                      </div>
                    </label>
                  </div>
                  {showCustomSkill && (
                    <div className="mt-6 space-y-2">
                      <label className="text-sm font-medium text-on-surface-variant block">Please specify your other skills</label>
                      <input 
                        type="text" 
                        required
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                        placeholder="e.g. Photography, Cooking, Event Planning" 
                      />
                    </div>
                  )}
                </div>

                {/* Step 3: Availability */}
                <div className={`transition-all duration-300 ${currentStep === 3 ? 'block' : 'hidden'}`}>
                  <h3 className="text-3xl font-semibold text-on-surface mb-6">Availability</h3>
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-on-surface-variant block">Weekly Commitment</label>
                    <div className="flex flex-wrap gap-3">
                      <button className="rounded-full px-6 py-2 border-2 border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all focus:bg-primary focus:text-on-primary focus:border-primary" type="button">Weekends</button>
                      <button className="rounded-full px-6 py-2 border-2 border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all focus:bg-primary focus:text-on-primary focus:border-primary" type="button">Weekday Mornings</button>
                      <button className="rounded-full px-6 py-2 border-2 border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all focus:bg-primary focus:text-on-primary focus:border-primary" type="button">Weekday Evenings</button>
                      <button className="rounded-full px-6 py-2 border-2 border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all focus:bg-primary focus:text-on-primary focus:border-primary" type="button">Flexible</button>
                    </div>
                    <div className="mt-8">
                      <label className="text-sm font-medium text-on-surface-variant block mb-2">Additional Notes</label>
                      <textarea className="w-full p-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Anything else we should know?" rows={4}></textarea>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-8 border-t border-outline-variant">
                  <button 
                    onClick={handlePrev} 
                    disabled={currentStep === 1}
                    className={`rounded-full px-8 py-3 text-sm font-medium border-2 border-primary text-primary transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-primary/5'}`} 
                    type="button"
                  >
                    Previous
                  </button>
                  <button 
                    className={`rounded-full px-8 py-3 text-sm font-medium transition-all ${currentStep === totalSteps ? 'bg-secondary text-on-secondary hover:bg-secondary/90' : 'bg-primary text-on-primary hover:bg-primary/90'}`} 
                    type="submit"
                  >
                    {currentStep === totalSteps ? 'Complete Registration' : 'Next Step'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info Column (Asymmetric Layout) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-primary text-on-primary rounded-xl p-8 shadow-[var(--shadow-card)] transform lg:-translate-y-12">
              <h4 className="text-xl font-semibold mb-4">Why Volunteer with Us?</h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-secondary-container">verified</span>
                  <div>
                    <p className="text-sm font-bold">Meaningful Impact</p>
                    <p className="text-sm opacity-90">Directly improve the quality of life for seniors in your neighborhood.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-secondary-container">groups</span>
                  <div>
                    <p className="text-sm font-bold">Community Roots</p>
                    <p className="text-sm opacity-90">Build lifelong connections with experienced individuals and fellow volunteers.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-secondary-container">school</span>
                  <div>
                    <p className="text-sm font-bold">Skill Building</p>
                    <p className="text-sm opacity-90">Gain empathy, communication, and leadership skills recognized by top institutions.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container rounded-xl p-8 border border-outline-variant overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-6xl">format_quote</span>
              </div>
              <p className="text-base italic mb-4 relative z-10">&quot;Volunteering with AgeSense has completely changed my perspective on aging. I went in to teach tech, but I ended up learning so much more about life.&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed-dim"></div>
                <div>
                  <p className="text-sm font-bold">Sarah Jenkins</p>
                  <p className="text-xs text-on-surface-variant">Volunteer since 2022</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="py-12"></div>
    </>
  );
}
