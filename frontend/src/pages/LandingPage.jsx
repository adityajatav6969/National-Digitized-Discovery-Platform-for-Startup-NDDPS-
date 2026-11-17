import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Rocket, TrendingUp, Users, Shield, Award, Building2,
  ChevronRight, Globe, Briefcase, Search
} from 'lucide-react';
import { getStartups } from '../services/api';

const domains = [
  { name: 'FinTech', icon: '💰' },
  { name: 'EdTech', icon: '📚' },
  { name: 'AgriTech', icon: '🌾' },
  { name: 'HealthTech', icon: '🏥' },
  { name: 'AI/ML', icon: '🤖' },
  { name: 'CleanTech', icon: '🌿' },
  { name: 'SaaS', icon: '☁️' },
];

const stats = [
  { label: '20,000+ Startup Architecture', icon: Building2, color: 'text-amber-400' },
  { label: '50+ Govt Schemes', icon: Award, color: 'text-emerald-400' },
  { label: 'Pan-India Coverage', icon: Globe, color: 'text-blue-300' },
  { label: '100+ Incubators', icon: Briefcase, color: 'text-pink-400' },
];

const steps = [
  { step: '01', title: 'Register', desc: 'Create your startup profile with key details like domain, funding stage, and location.', icon: Rocket },
  { step: '02', title: 'Get Matched', desc: 'Our platform matches your startup with eligible government schemes and resources.', icon: Search },
  { step: '03', title: 'Grow', desc: 'Access funding, mentorship, and incubation support to scale your startup.', icon: TrendingUp },
];

export default function LandingPage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getStartups({ status: 'Approved', limit: 3, sort: 'newest' });
        setFeatured(res.data.startups || []);
      } catch (err) {
        console.error('Failed to fetch featured startups:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-700/40 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-blue-600/30">
              <Rocket className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-blue-100">National Platform for Startup Discovery</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              India&apos;s National Digitized Discovery Platform for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Startups
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Connecting Indian startups with government schemes, incubators, and resources. 
              Discover, register, and grow with India&apos;s largest startup ecosystem platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/discover"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-blue-900 px-8 py-3.5 rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5"
              >
                <Search className="w-5 h-5" />
                Discover Startups
              </Link>
              <Link
                to="/startup/register"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-3.5 rounded-xl font-bold text-lg transition-all hover:-translate-y-0.5"
              >
                Register Your Startup
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors">
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <p className="text-sm font-medium text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Pills */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Explore by Domain</h2>
            <p className="text-gray-600">Find startups in your area of interest</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {domains.map((domain) => (
              <button
                key={domain.name}
                onClick={() => navigate(`/discover?domain=${domain.name}`)}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-800 px-5 py-2.5 rounded-full font-medium transition-all hover:shadow-md hover:-translate-y-0.5 border border-blue-100"
              >
                <span className="text-lg">{domain.icon}</span>
                {domain.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Startups */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Startups</h2>
            <p className="text-gray-600">Discover verified and approved startups on our platform</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((startup) => (
                <Link
                  key={startup._id || startup.id}
                  to={`/startup/${startup._id || startup.id}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {startup.domain}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                      <Shield className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                    {startup.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{startup.tagline || startup.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    {startup.location && (
                      <span>{startup.location.city}, {startup.location.state}</span>
                    )}
                    {startup.fundingStage && <span>• {startup.fundingStage}</span>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No featured startups yet. Be the first to register!</p>
          )}
          <div className="text-center mt-8">
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 font-semibold transition-colors"
            >
              View all startups
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-600">Get started in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-16 h-16 bg-blue-100 group-hover:bg-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                  <item.icon className="w-8 h-8 text-blue-700" />
                </div>
                <div className="text-xs font-bold text-amber-500 mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Next Opportunity?</h2>
          <p className="text-blue-200 mb-8 text-lg">Join thousands of startups already growing with NDDPS.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-blue-900 px-8 py-3.5 rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Get Started Today
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
