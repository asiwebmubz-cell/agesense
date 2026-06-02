import Image from "next/image";

export default function PartnerPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="Partnership and Community" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/ADBb0ugnYl9NN6gpkeE9FvYrZhdNrhj82cqOSUMB7Ya53cNEKgw7T2wu0g6wjGa0uqDScMQvrv0qS6fEhrTE6XO1AgDrFm8C56OjawxpX7KDGfVUVWGMtRX4wgbusBAiUczmzcuW8c0QQWbM5Ixi0e47HEI6PaTTntFDIrlnpC2pd8U4NsyfV4-CG-tEHxDwiZ2x2jgbkQ76nPzsOMYl9d8kQPlrvLOVt0Ibw3VbvNorquc1ehzz9Cq3cCFRELk" />
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 w-full">
          <div className="max-w-2xl bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-xl shadow-xl">
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 tracking-tight">Partner With Us</h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">Scaling impact through collaboration. Join AgeSense Initiative in bridging the generational gap and delivering professional compassion to seniors everywhere.</p>
          </div>
        </div>
      </section>

      {/* Why Partner With Us? - Bento Style */}
      <section className="py-20 bg-surface-container-low">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-primary mb-2">Why Partner With Us?</h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl border border-outline-variant flex flex-col items-center text-center shadow-[var(--shadow-card)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary-container/10 rounded-full flex items-center justify-center mb-6 text-primary">
                <span className="material-symbols-outlined text-4xl">handshake</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Shared Mission</h3>
              <p className="text-on-surface-variant">Align your organization with a movement dedicated to social equity and generational connectedness.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl border border-outline-variant flex flex-col items-center text-center shadow-[var(--shadow-card)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary-container/10 rounded-full flex items-center justify-center mb-6 text-primary">
                <span className="material-symbols-outlined text-4xl">groups</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Community Reach</h3>
              <p className="text-on-surface-variant">Gain access to our extensive network of youth volunteers and senior care facilities across the nation.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl border border-outline-variant flex flex-col items-center text-center shadow-[var(--shadow-card)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary-container/10 rounded-full flex items-center justify-center mb-6 text-primary">
                <span className="material-symbols-outlined text-4xl">analytics</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Data-Driven Impact</h3>
              <p className="text-on-surface-variant">Leverage our robust impact reporting and analytics to measure the success of joint initiatives.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form & Contact Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Partnership Inquiry Form */}
            <div className="flex-1 order-2 lg:order-1">
              <div className="bg-white p-8 md:p-10 rounded-xl border border-outline-variant shadow-sm">
                <h2 className="text-3xl font-semibold text-on-surface mb-8">Partnership Inquiry</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2 group">
                      <label className="text-sm font-medium text-on-surface-variant group-focus-within:text-primary transition-colors">Organization Name</label>
                      <input className="h-12 px-4 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Global Health Corp" required type="text" />
                    </div>
                    <div className="flex flex-col gap-2 group">
                      <label className="text-sm font-medium text-on-surface-variant group-focus-within:text-primary transition-colors">Contact Person</label>
                      <input className="h-12 px-4 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Jane Doe" required type="text" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2 group">
                      <label className="text-sm font-medium text-on-surface-variant group-focus-within:text-primary transition-colors">Email</label>
                      <input className="h-12 px-4 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="jane@organization.org" required type="email" />
                    </div>
                    <div className="flex flex-col gap-2 group">
                      <label className="text-sm font-medium text-on-surface-variant group-focus-within:text-primary transition-colors">Phone Number</label>
                      <input className="h-12 px-4 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="+1 (555) 000-0000" type="tel" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 group">
                    <label className="text-sm font-medium text-on-surface-variant group-focus-within:text-primary transition-colors">Type of Partnership</label>
                    <select className="h-12 px-4 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                      <option>Corporate Partnership</option>
                      <option>Community Program Integration</option>
                      <option>Research Collaboration</option>
                      <option>Strategic Philanthropy</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2 group">
                    <label className="text-sm font-medium text-on-surface-variant group-focus-within:text-primary transition-colors">Message</label>
                    <textarea className="p-4 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="How would you like to collaborate with AgeSense?" required rows={4}></textarea>
                  </div>
                  <button className="w-full h-12 bg-primary text-on-primary rounded-lg text-lg font-semibold hover:opacity-95 transition-all shadow-md active:scale-[0.98]" type="button">
                    Send Inquiry
                  </button>
                </form>
              </div>
            </div>
            
            {/* Contact Information Sidebar */}
            <div className="lg:w-1/3 order-1 lg:order-2 space-y-8">
              <div>
                <h2 className="text-3xl font-semibold text-primary mb-6">Get In Touch</h2>
                <p className="text-on-surface-variant mb-8 text-base">Our partnership team is ready to discuss how we can work together to achieve meaningful results for our elderly community.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 text-primary">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface-variant">Email</h4>
                    <p className="text-primary text-base font-medium">info@agesense.org</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 text-primary">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface-variant">Office Address</h4>
                    <p className="text-on-surface-variant text-base">Banasree, Rampura, Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="rounded-xl overflow-hidden h-48 border border-outline-variant grayscale hover:grayscale-0 transition-all duration-500">
                <img alt="Location Map" className="w-full h-full object-cover" data-location="Innovation City" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABK-zaDIaMNBAwGFoD7vCfRZ0K5fFre3M5MgtaC9zuq4r93HfyPSkx5IqcC1gue6N2E_pOyhTJDn-NmeZEw1us2pFvFlgI9_ax-mzlpUzqOnQpo8C80KEKzXDippXkMz6TmEl83o6t3lqfFdNic0Y1y_hwznR_WJCyjiuKAQZgZk29ga-EcPqCPuNveJA5kpp7XeFoWyJxDbfcatGw7OefPqhu_GW5GVrH8UmH6mQrmglRKY1TuamNocY8NJk1tkH_1MtIEVGjwa2r" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
