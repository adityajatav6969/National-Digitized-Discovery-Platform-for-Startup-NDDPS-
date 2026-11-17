import React from 'react';
import { Banknote, Building2, Receipt, Shield, Users, ExternalLink } from 'lucide-react';

const CATEGORY_ICONS = {
  'Funding/Grant': Banknote,
  Incubation: Building2,
  'Tax Exemption': Receipt,
  'IP Support': Shield,
  Mentorship: Users,
};

const formatINR = (amount) => {
  if (!amount && amount !== 0) return '—';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const RecommendationCard = ({ scheme }) => {
  if (!scheme) return null;

  const {
    title = 'Untitled Scheme',
    ministryOrBody = '',
    category = '',
    eligibleDomains = [],
    maxGrantAmount,
    deadline,
    applicationUrl = '#',
    matchScore = 0,
  } = scheme;

  const CategoryIcon = CATEGORY_ICONS[category] || Banknote;

  const borderColor =
    matchScore > 80
      ? 'border-l-green-500'
      : matchScore >= 50
      ? 'border-l-amber-500'
      : 'border-l-red-500';

  const badgeBg =
    matchScore > 80
      ? 'bg-green-100 text-green-800'
      : matchScore >= 50
      ? 'bg-amber-100 text-amber-800'
      : 'bg-red-100 text-red-800';

  return (
    <div
      className={`relative bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-5 border-l-4 ${borderColor} flex flex-col h-full`}
    >
      {/* Match score badge */}
      <div className={`absolute top-3 right-3 inline-flex items-center justify-center w-14 h-14 rounded-full text-xs font-bold ${badgeBg}`}>
        {matchScore}%
        <br />
        Match
      </div>

      {/* Title & ministry */}
      <h4 className="font-semibold text-gray-900 pr-16 leading-snug">{title}</h4>
      {ministryOrBody && (
        <p className="text-sm text-gray-500 mt-1">{ministryOrBody}</p>
      )}

      {/* Category badge */}
      {category && (
        <span className="inline-flex items-center gap-1 mt-3 rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs font-medium w-fit">
          <CategoryIcon className="h-3.5 w-3.5" />
          {category}
        </span>
      )}

      {/* Eligible domains */}
      {eligibleDomains.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {eligibleDomains.map((domain) => (
            <span
              key={domain}
              className="rounded-full bg-blue-50 text-blue-700 px-2.5 py-0.5 text-xs font-medium"
            >
              {domain}
            </span>
          ))}
        </div>
      )}

      {/* Grant & deadline */}
      <div className="mt-4 space-y-1 text-sm text-gray-600 flex-grow">
        <p>
          <span className="font-medium text-gray-700">Max Grant:</span>{' '}
          {formatINR(maxGrantAmount)}
        </p>
        <p>
          <span className="font-medium text-gray-700">Deadline:</span>{' '}
          {formatDate(deadline)}
        </p>
      </div>

      {/* Apply button */}
      <a
        href={applicationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Apply Now →
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
};

export default RecommendationCard;
