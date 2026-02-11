export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-12 sm:mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10 md:py-12 text-center">
        <p className="text-xs sm:text-sm text-slate-500">
          Supported by Google AdSense advertising
        </p>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          © {new Date().getFullYear()} genuinelyfreecharity.com
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
          <a 
            href="#" 
            className="text-xs sm:text-sm text-slate-500 hover:text-blue-600 transition-colors touch-manipulation"
          >
            Privacy
          </a>
          <a 
            href="#" 
            className="text-xs sm:text-sm text-slate-500 hover:text-blue-600 transition-colors touch-manipulation"
          >
            Terms
          </a>
          <a 
            href="#" 
            className="text-xs sm:text-sm text-slate-500 hover:text-blue-600 transition-colors touch-manipulation"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
