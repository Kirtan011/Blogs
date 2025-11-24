export default function Footer() {
  return (
    <footer className="w-full mt-20 border-t border-zinc-800/70 bg-zinc-900/80 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-zinc-400 text-sm">
        {/* Left */}
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} My Blog. Made and designed by Kirtan
          Suthar
        </p>

        {/* Right */}
        <div className="flex gap-4 mt-3 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
