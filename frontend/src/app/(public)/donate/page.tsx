import DonateForm from "@/components/DonateForm";

export default function DonatePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Empower Our Mission</h1>
          <p className="italic text-primary-fixed-dim text-lg max-w-2xl mx-auto">Every contribution bridges the gap between generations, providing care and connection for those who need it most.</p>
        </div>
      </section>

      {/* Payment Info Section */}
      <section className="py-16 md:py-20 bg-surface-container-low">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mobile Banking Card */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-secondary-fixed rounded-full text-primary-container">
                  <span className="material-symbols-outlined text-4xl">smartphone</span>
                </div>
                <h3 className="text-3xl font-semibold text-on-surface">Mobile Banking</h3>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-start border-b border-outline-variant pb-4">
                  <div>
                    <p className="text-sm font-medium text-on-surface-variant mb-1">bKash (Merchant)</p>
                    <p className="font-bold text-xl text-primary">017XX-XXXXXX</p>
                  </div>
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">Fastest</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-on-surface-variant mb-1">Nagad (Personal)</p>
                    <p className="font-bold text-xl text-primary">019XX-XXXXXX</p>
                  </div>
                </div>
                <p className="text-base text-on-surface-variant mt-4">
                  Please use the <strong>Payment</strong> option for bKash and <strong>Send Money</strong> for Nagad. Use your phone number as a reference.
                </p>
              </div>
            </div>

            {/* Bank Transfer Card */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-secondary-fixed rounded-full text-primary-container">
                  <span className="material-symbols-outlined text-4xl">account_balance</span>
                </div>
                <h3 className="text-3xl font-semibold text-on-surface">Bank Transfer</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-on-surface-variant">Account Name</p>
                  <p className="font-bold text-lg text-on-surface">AgeSense Initiative Foundation</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface-variant">Account Number</p>
                  <p className="font-bold text-lg text-on-surface tracking-widest">123.456.7890</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface-variant">Bank Name</p>
                  <p className="font-bold text-lg text-on-surface">Standard Chartered Bank</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface-variant">Branch & Routing</p>
                  <p className="font-bold text-lg text-on-surface">Gulshan Branch | 123456789</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Form Section */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-surface-container-lowest p-8 md:p-12 rounded-xl border border-outline-variant shadow-lg">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-on-surface mb-2">Verify Your Donation</h2>
              <p className="text-on-surface-variant">Please fill out this form after completing your transfer so we can acknowledge your gift.</p>
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
            <p className="text-3xl font-semibold text-on-primary-fixed bg-primary-fixed/80 backdrop-blur-sm px-8 py-4 rounded-full inline-block">
              100% of donations go directly to senior care.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
