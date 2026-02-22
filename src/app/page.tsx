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

function Section({
  children,
  title,
  subtitle,
  alt = false,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  alt?: boolean;
}) {
  return (
    <section className={alt ? "bg-slate-50" : "bg-white"}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{title}</h2>
          <p className="text-slate-500">{subtitle}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
            Your visit supports charity.
            <br />
            <span className="text-blue-600">No donations needed.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Answer a daily poll. We show ads. 100% of net revenue goes to verified charities like
            St.&nbsp;Jude, Doctors Without Borders, and Habitat for Humanity.
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-6 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              No signup
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              No donations
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Full transparency
            </span>
          </div>
        </div>
      </section>

      {/* Poll */}
      <section className="bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <PollModule />
        </div>
      </section>

      {/* Single ad banner */}
      <div className="bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <AdSlot slot="mid-content" format="horizontal" className="min-h-[90px]" />
        </div>
      </div>

      {/* Impact Dashboard */}
      <Section title="Impact Dashboard" subtitle="Real-time transparency into ad revenue and charitable allocations">
        <ImpactDashboard />
      </Section>

      {/* Organizations */}
      <Section title="Organizations Supported" subtitle="Lifetime and current month contributions to each charity" alt>
        <OrganizationTotals />
      </Section>

      {/* Allocation Ledger */}
      <Section title="Allocation Ledger" subtitle="Complete history of all charitable allocations with proof">
        <AllocationLedger />
      </Section>

      {/* About Charities */}
      <Section title="About the Charities" subtitle="Learn more about the organizations we support" alt>
        <AboutCharities />
      </Section>

      {/* Suggest + FAQ */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-16 sm:space-y-20">
          <div>
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Suggest a Charity</h2>
              <p className="text-slate-500">Know a great cause? Submit it for consideration in future polls.</p>
            </div>
            <CharitySubmissionForm />
          </div>

          <div>
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-slate-500">Everything you need to know about how this works.</p>
            </div>
            <FAQ />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
