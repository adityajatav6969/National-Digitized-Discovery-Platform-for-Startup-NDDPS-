import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, ExternalLink, Calendar, Filter, Briefcase, IndianRupee, Tag } from 'lucide-react';
import { getSchemes } from '../services/api';

const CATEGORIES = [
  'All',
  'Funding/Grant',
  'Incubation',
  'Tax Exemption',
  'IP Support',
  'Mentorship',
];

const categoryColors = {
  'Funding/Grant': 'bg-emerald-100 text-emerald-800',
  'Incubation': 'bg-blue-100 text-blue-800',
  'Tax Exemption': 'bg-amber-100 text-amber-800',
  'IP Support': 'bg-purple-100 text-purple-800',
  'Mentorship': 'bg-rose-100 text-rose-800',
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'No deadline';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'No deadline';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const SchemesPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        const res = await getSchemes(params);
        const data = res.data || res;
        setSchemes(Array.isArray(data) ? data : data.schemes || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch schemes');
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading schemes…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Award className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Government Schemes</h1>
          </div>
          <p className="text-gray-500 ml-13">
            Explore funding, incubation, and support schemes for startups
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Filter className="w-4 h-4" />
              <span>Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {schemes.length} scheme{schemes.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>

        {/* Schemes Grid */}
        {schemes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No schemes found</h3>
            <p className="text-gray-400">
              {selectedCategory !== 'All'
                ? `No schemes available in the "${selectedCategory}" category.`
                : 'No schemes are currently available.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <div
                key={scheme._id || scheme.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2">
                      {scheme.title}
                    </h3>
                    {scheme.category && (
                      <span
                        className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          categoryColors[scheme.category] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {scheme.category}
                      </span>
                    )}
                  </div>

                  {scheme.ministryOrBody && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Briefcase className="w-4 h-4 shrink-0" />
                      <span className="line-clamp-1">{scheme.ministryOrBody}</span>
                    </div>
                  )}

                  {scheme.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{scheme.description}</p>
                  )}
                </div>

                {/* Card Body */}
                <div className="px-5 pb-4 flex-1 space-y-3">
                  {/* Max Grant */}
                  {(scheme.maxGrantAmount || scheme.maxGrantAmount === 0) && (
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-sm font-semibold text-emerald-700">
                        Up to {formatCurrency(scheme.maxGrantAmount)}
                      </span>
                    </div>
                  )}

                  {/* Deadline */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-sm text-gray-600">
                      Deadline: {formatDate(scheme.deadline)}
                    </span>
                  </div>

                  {/* Eligible Domains */}
                  {scheme.eligibleDomains && scheme.eligibleDomains.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {scheme.eligibleDomains.map((domain, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md font-medium"
                        >
                          <Tag className="w-3 h-3" />
                          {domain}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-5 pb-5">
                  {scheme.applicationUrl ? (
                    <a
                      href={scheme.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Apply Now
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                    >
                      No Application Link
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemesPage;
