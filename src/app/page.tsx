import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import PollModule from "@/components/PollModule";
import ImpactDashboard from "@/components/ImpactDashboard";
import OrganizationTotals from "@/components/OrganizationTotals";
import AllocationLedger from "@/components/AllocationLedger";
import AboutCharities from "@/components/AboutCharities";
import CharitySubmissionForm from "@/components/CharitySubmissionForm";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Top banner ad */}
      <div className="max-w-5xl mx-auto w-full px-4 mt-6">
        <AdSlot slot="top-banner" format="horizontal" className="h-24" />
      </div>

      {/* Main content with optional side rails */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex gap-6">
          {/* Left rail ad - desktop only */}
          <aside className="hidden lg:block w-40 shrink-0">
            <div className="sticky top-4">
              <AdSlot slot="left-rail" format="vertical" className="h-[600px]" />
            </div>
          </aside>

          {/* Center content */}
          <div className="flex-1 min-w-0 space-y-8 sm:space-y-12">
            {/* Poll */}
            <section>
              <PollModule />
            </section>

            {/* Inline ad after poll - mobile only */}
            <div className="sm:hidden">
              <AdSlot slot="after-poll" format="rectangle" className="h-64" />
            </div>

            {/* Impact Dashboard */}
            <section>
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">
                  Impact Dashboard
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Real-time transparency into ad revenue and allocations
                </p>
              </div>
              <ImpactDashboard />
            </section>

            {/* Organization Totals */}
            <section>
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">
                  Organizations Supported
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Lifetime and current month contributions to each charity
                </p>
              </div>
              <OrganizationTotals />
            </section>

            {/* Inline ad before ledger - mobile only */}
            <div className="sm:hidden">
              <AdSlot slot="before-ledger" format="rectangle" className="h-64" />
            </div>

            {/* Allocation Ledger */}
            <section>
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">
                  Allocation Ledger
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Complete history of all charitable allocations with proof
                </p>
              </div>
              <AllocationLedger />
            </section>

            {/* About the Charities */}
            <section>
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">
                  About the Charities
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Learn more about the organizations in our poll
                </p>
              </div>
              <AboutCharities />
            </section>

            {/* Suggest a Charity */}
            <section>
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">
                  Suggest a Charity
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Know a great cause? Submit a charity for consideration in future polls
                </p>
              </div>
              <CharitySubmissionForm />
            </section>

            {/* FAQ */}
            <section>
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">
                  Frequently Asked Questions
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Everything you need to know about how this works
                </p>
              </div>
              <FAQ />
            </section>
          </div>

          {/* Right rail ad - desktop only */}
          <aside className="hidden lg:block w-40 shrink-0">
            <div className="sticky top-4">
              <AdSlot slot="right-rail" format="vertical" className="h-[600px]" />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
