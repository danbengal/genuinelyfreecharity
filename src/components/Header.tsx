export default function Header() {
  return (
    <header className="relative overflow-hidden border-b border-slate-200 bg-white">
      {/* Subtle gradient accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500" />
      
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10 md:py-12 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight px-2">
          genuinelyfreecharity.com
        </h1>
        <p className="mt-2 sm:mt-3 text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
          Answer a daily poll. Ad revenue supports charities. Full transparency, always.
        </p>
        <p className="mt-1.5 sm:mt-2 text-xs text-slate-400 font-medium uppercase tracking-wide">
          One response per person every 24 hours
        </p>
      </div>
    </header>
  );
}
