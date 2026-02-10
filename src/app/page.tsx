import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import PollModule from "@/components/PollModule";
import ImpactDashboard from "@/components/ImpactDashboard";
import OrganizationTotals from "@/components/OrganizationTotals";
import AllocationLedger from "@/components/AllocationLedger";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Top banner ad */}
      <div className="max-w-5xl mx-auto w-full px-4 mt-4">
        <AdSlot slot="top-banner" format="horizontal" className="h-24" />
      </div>

      {/* Main content with optional side rails */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex gap-6">
          {/* Left rail ad - desktop only */}
          <aside className="hidden lg:block w-40 flex-shrink-0">
            <div className="sticky top-4">
              <AdSlot slot="left-rail" format="vertical" className="h-[600px]" />
            </div>
          </aside>

          {/* Center content */}
          <div className="flex-1 min-w-0 space-y-10">
            {/* Poll */}
            <section>
              <PollModule />
            </section>

            {/* Inline ad after poll */}
            <AdSlot slot="after-poll" format="rectangle" className="h-64 sm:hidden" />

            {/* Impact Dashboard */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Impact Dashboard</h2>
              <ImpactDashboard />
            </section>

            {/* Organization Totals */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Organizations Supported</h2>
              <OrganizationTotals />
            </section>

            {/* Inline ad before ledger - mobile */}
            <AdSlot slot="before-ledger" format="rectangle" className="h-64 sm:hidden" />

            {/* Allocation Ledger */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Allocation Ledger</h2>
              <AllocationLedger />
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <FAQ />
            </section>
          </div>

          {/* Right rail ad - desktop only */}
          <aside className="hidden lg:block w-40 flex-shrink-0">
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
