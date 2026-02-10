export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 px-4 text-center text-sm text-gray-500">
      <p>Supported by Google AdSense advertising</p>
      <p className="mt-2">© {new Date().getFullYear()} genuinelyfreecharity.com</p>
      <div className="mt-2 space-x-4">
        <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
        <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
        <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
      </div>
    </footer>
  );
}
