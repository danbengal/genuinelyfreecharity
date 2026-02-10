export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-sm text-slate-500">
          Supported by Google AdSense advertising
        </p>
        <p className="mt-2 text-sm text-slate-400">
          © {new Date().getFullYear()} genuinelyfreecharity.com
        </p>
        <div className="mt-4 flex items-center justify-center gap-6">
          <a 
            href="#" 
            className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            Privacy
          </a>
          <a 
            href="#" 
            className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            Terms
          </a>
          <a 
            href="#" 
            className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
