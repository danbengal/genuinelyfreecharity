export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center">
        <a href="/" className="flex items-center gap-2.5">
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            genuinelyfreecharity
          </span>
          <span className="text-lg font-bold text-blue-600 tracking-tight">.com</span>
        </a>
      </div>
    </header>
  );
}
