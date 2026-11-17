import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-900 to-blue-950 text-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <Rocket className="w-6 h-6 text-amber-400" />
              NDDPS
            </Link>
            <p className="text-sm text-blue-300">
              National Digitized Discovery Platform for Startups — connecting India&apos;s startups with government schemes and resources.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-white transition-colors">About</Link></li>
              <li><Link to="/discover" className="text-sm hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/schemes" className="text-sm hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.startupindia.gov.in" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">
                  Startup India
                </a>
              </li>
              <li>
                <a href="https://dpiit.gov.in" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">
                  DPIIT
                </a>
              </li>
              <li>
                <a href="https://www.meity.gov.in" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">
                  MeitY
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li><span className="text-sm cursor-pointer hover:text-white transition-colors">Privacy Policy</span></li>
              <li><span className="text-sm cursor-pointer hover:text-white transition-colors">Terms of Service</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-blue-400">
            © 2026 NDDPS — Final Year Project (2026-27-WD-04) | Built with ❤️ by Team NDDPS
          </p>
        </div>
      </div>
    </footer>
  );
}
