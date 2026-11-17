import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Menu, X, LogIn, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/discover', label: 'Discover Startups' },
    { to: '/schemes', label: 'Schemes & Policies' },
    { to: '/analytics', label: 'Analytics' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 shadow-lg border-b border-blue-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl hover:opacity-90 transition-opacity">
            <Rocket className="w-6 h-6 text-amber-400" />
            <span>NDDPS</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-blue-100 hover:text-white hover:bg-blue-700/50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-amber-300 hover:text-amber-200 px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-500/10 border border-amber-400/30 transition-colors"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1 text-blue-100 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-700/40 transition-colors"
                >
                  <User className="w-4 h-4" />
                  {user.name}
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="flex items-center gap-1 bg-blue-700/50 hover:bg-blue-700 text-blue-100 hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/register"
                  className="text-blue-100 hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-blue-700/50"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-blue-900 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-blue-700/50 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-blue-900/95 backdrop-blur-sm border-t border-blue-700">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block text-blue-100 hover:text-white hover:bg-blue-700/50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-amber-300 hover:text-amber-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
            <hr className="border-blue-700 my-2" />
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-blue-100 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <User className="w-4 h-4" />
                  {user.name}
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}
                  className="flex items-center gap-2 text-blue-100 hover:text-white px-3 py-2 rounded-lg text-sm font-medium w-full text-left transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block text-blue-100 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 bg-amber-500 text-blue-900 px-3 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
