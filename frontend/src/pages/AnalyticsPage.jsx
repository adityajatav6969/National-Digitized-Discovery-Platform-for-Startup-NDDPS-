import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Building2,
  MapPin,
  Briefcase,
  Shield,
  Users,
  CheckCircle,
  Clock,
  Award,
} from 'lucide-react';
import { getAnalytics } from '../services/api';

const barColors = [
  'bg-blue-600',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-indigo-500',
  'bg-rose-500',
];

const BarChart = ({ title, icon: Icon, data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const maxVal = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-5">
        <Icon className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">
        {entries.map(([label, count], idx) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-28 sm:w-36 truncate shrink-0 text-right">
              {label}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden">
              <div
                className={`h-full rounded-full ${barColors[idx % barColors.length]} transition-all duration-500`}
                style={{ width: `${Math.max((count / maxVal) * 100, 4)}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 w-10 text-right shrink-0">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatusSegmentBar = ({ data }) => {
  const statusConfig = {
    Approved: { color: 'bg-emerald-500', label: 'Approved' },
    approved: { color: 'bg-emerald-500', label: 'Approved' },
    Pending: { color: 'bg-amber-400', label: 'Pending' },
    pending: { color: 'bg-amber-400', label: 'Pending' },
    Rejected: { color: 'bg-red-500', label: 'Rejected' },
    rejected: { color: 'bg-red-500', label: 'Rejected' },
  };

  if (!data || Object.keys(data).length === 0) {
    return <p className="text-gray-400 text-sm">No data available</p>;
  }

  const total = Object.values(data).reduce((s, v) => s + v, 0);
  if (total === 0) {
    return <p className="text-gray-400 text-sm">No startups yet</p>;
  }

  const entries = Object.entries(data).filter(([, v]) => v > 0);

  return (
    <div>
      <div className="flex rounded-full h-8 overflow-hidden bg-gray-100">
        {entries.map(([key, val]) => {
          const cfg = statusConfig[key] || { color: 'bg-gray-400', label: key };
          const pct = (val / total) * 100;
          return (
            <div
              key={key}
              className={`${cfg.color} flex items-center justify-center transition-all duration-500`}
              style={{ width: `${pct}%` }}
              title={`${cfg.label}: ${val} (${pct.toFixed(1)}%)`}
            >
              {pct > 10 && (
                <span className="text-white text-xs font-semibold">{val}</span>
              )}
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3">
        {entries.map(([key, val]) => {
          const cfg = statusConfig[key] || { color: 'bg-gray-400', label: key };
          return (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${cfg.color}`} />
              <span className="text-sm text-gray-600">
                {cfg.label}: {val} ({((val / total) * 100).toFixed(1)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, bgColor, textColor }) => (
  <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
    <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center shrink-0`}>
      <Icon className={`w-6 h-6 ${textColor}`} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
    </div>
  </div>
);

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAnalytics();
        setAnalytics(res.data || res);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <BarChart3 className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load analytics</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalStartups = analytics?.totalStartups ?? analytics?.total ?? 0;
  const approved = analytics?.approved ?? analytics?.statusBreakdown?.Approved ?? 0;
  const pending = analytics?.pending ?? analytics?.statusBreakdown?.Pending ?? 0;
  const totalSchemes = analytics?.totalSchemes ?? 0;

  const byDomain = analytics?.byDomain || analytics?.domainBreakdown || {};
  const byLocation = analytics?.byLocation || analytics?.locationBreakdown || {};
  const byFunding = analytics?.byFundingStage || analytics?.fundingBreakdown || {};
  const verificationStatus = analytics?.verificationStatus || analytics?.statusBreakdown || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Platform Analytics</h1>
          </div>
          <p className="text-gray-500 ml-13">
            Overview of startups, schemes, and ecosystem statistics
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Startups"
            value={totalStartups}
            icon={Building2}
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          />
          <StatCard
            label="Approved"
            value={approved}
            icon={CheckCircle}
            bgColor="bg-emerald-100"
            textColor="text-emerald-600"
          />
          <StatCard
            label="Pending"
            value={pending}
            icon={Clock}
            bgColor="bg-amber-100"
            textColor="text-amber-600"
          />
          <StatCard
            label="Total Schemes"
            value={totalSchemes}
            icon={Award}
            bgColor="bg-purple-100"
            textColor="text-purple-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BarChart title="Startups by Industry / Domain" icon={Briefcase} data={byDomain} />
          <BarChart title="Startups by Location" icon={MapPin} data={byLocation} />
          <BarChart title="Startups by Funding Stage" icon={TrendingUp} data={byFunding} />

          {/* Verification Status */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Verification Status</h3>
            </div>
            <StatusSegmentBar data={verificationStatus} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
