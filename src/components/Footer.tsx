export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <span className="font-semibold text-slate-900">genuinelyfreecharity</span>
          <span className="font-semibold text-blue-600">.com</span>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Supported by Google AdSense advertising. 100% of net ad revenue goes to verified charities.
        </p>
        <div className="flex items-center justify-center gap-6 mb-6">
          <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
            Terms of Use
          </a>
          <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
            Contact
          </a>
        </div>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} genuinelyfreecharity.com. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
