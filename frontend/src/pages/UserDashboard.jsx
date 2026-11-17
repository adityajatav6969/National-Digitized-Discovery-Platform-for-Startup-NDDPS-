import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStartups } from '../services/api';
import {
  User,
  Plus,
  Eye,
  Briefcase,
  TrendingUp,
  Building2,
  Loader2,
  Rocket,
  ArrowRight,
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchStartups = async () => {
      setLoading(true);
      setError('');
      try {
        const ownerId = user._id || user.id;
        const res = await getStartups({ owner: ownerId });
        const data = res.data?.startups || res.startups || res.data || res || [];
        setStartups(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || 'Failed to load your startups.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, [user]);

  const totalSchemes = startups.reduce(
    (acc, s) => acc + (s.matchedSchemes?.length || 0),
    0
  );

  const approvedCount = startups.filter(
    (s) => s.verificationStatus === 'Approved'
  ).length;

  const pendingCount = startups.filter(
    (s) => s.verificationStatus === 'Pending'
  ).length;

  const statusBadge = (status) => {
    const map = {
      Approved: 'bg-emerald-100 text-emerald-700',
      Pending: 'bg-amber-100 text-amber-700',
      Rejected: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-sm text-gray-500">
                Here&apos;s an overview of your startup portfolio
              </p>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Building2}
            label="Total Startups"
            value={startups.length}
            color="bg-blue-900"
          />
          <StatCard
            icon={TrendingUp}
            label="Approved"
            value={approvedCount}
            color="bg-emerald-600"
          />
          <StatCard
            icon={Briefcase}
            label="Pending Review"
            value={pendingCount}
            color="bg-amber-500"
          />
          <StatCard
            icon={Rocket}
            label="Matched Schemes"
            value={totalSchemes}
            color="bg-purple-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            to="/startup/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-sm transition"
          >
            <Plus className="h-5 w-5" />
            Register New Startup
          </Link>
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg shadow-sm transition"
          >
            <Eye className="h-5 w-5" />
            Discover Startups
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-blue-900 animate-spin" />
            <span className="ml-3 text-gray-500">Loading your startups…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && startups.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <Building2 className="h-14 w-14 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700">No startups yet</h2>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              Register your first startup to get started on the platform.
            </p>
            <Link
              to="/startup/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition"
            >
              <Plus className="h-5 w-5" />
              Register Startup
            </Link>
          </div>
        )}

        {/* Startup Cards */}
        {!loading && !error && startups.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Startups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {startups.map((startup) => {
                const sid = startup._id || startup.id;
                return (
                  <div
                    key={sid}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden"
                  >
                    <div className="p-5">
                      {/* Title & Badge */}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-base font-bold text-gray-900 leading-tight">
                          {startup.name}
                        </h3>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2 ${statusBadge(
                            startup.verificationStatus
                          )}`}
                        >
                          {startup.verificationStatus || 'Pending'}
                        </span>
                      </div>

                      {startup.tagline && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {startup.tagline}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-500">
                        {startup.domain && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                            <Briefcase className="h-3 w-3" />
                            {startup.domain}
                          </span>
                        )}
                        {startup.fundingStage && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">
                            <TrendingUp className="h-3 w-3" />
                            {startup.fundingStage}
                          </span>
                        )}
                        {startup.matchedSchemes?.length > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                            <Rocket className="h-3 w-3" />
                            {startup.matchedSchemes.length} scheme
                            {startup.matchedSchemes.length !== 1 ? 's' : ''} matched
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <Link
                          to={`/startup/${sid}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-900 hover:text-blue-700 transition"
                        >
                          <Eye className="h-4 w-4" />
                          View Profile
                        </Link>
                        <span className="text-gray-200">|</span>
                        <Link
                          to={`/startup/${sid}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                        >
                          Edit
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
