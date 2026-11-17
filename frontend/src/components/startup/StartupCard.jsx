import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, CheckCircle, Clock, XCircle } from 'lucide-react';

const DOMAIN_COLORS = {
  FinTech: 'bg-blue-100 text-blue-800',
  EdTech: 'bg-purple-100 text-purple-800',
  AgriTech: 'bg-green-100 text-green-800',
  HealthTech: 'bg-red-100 text-red-800',
  'AI/ML': 'bg-indigo-100 text-indigo-800',
  CleanTech: 'bg-teal-100 text-teal-800',
  SaaS: 'bg-orange-100 text-orange-800',
};

const STATUS_CONFIG = {
  Approved: { color: 'bg-emerald-100 text-emerald-800', Icon: CheckCircle },
  Pending: { color: 'bg-amber-100 text-amber-800', Icon: Clock },
  Rejected: { color: 'bg-red-100 text-red-800', Icon: XCircle },
};

const StartupCard = ({ startup }) => {
  if (!startup) return null;

  const {
    _id,
    name = 'Unnamed Startup',
    tagline = '',
    description = '',
    domain = '',
    fundingStage = '',
    location = {},
    foundedYear,
    teamSize,
    verificationStatus = 'Pending',
    matchedSchemes = [],
  } = startup;

  const domainClass = DOMAIN_COLORS[domain] || 'bg-gray-100 text-gray-800';
  const statusCfg = STATUS_CONFIG[verificationStatus] || STATUS_CONFIG.Pending;
  const StatusIcon = statusCfg.Icon;
  const schemesCount = Array.isArray(matchedSchemes) ? matchedSchemes.length : 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-5 flex flex-col h-full">
      {/* Badges row */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        {domain && (
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${domainClass}`}>
            {domain}
          </span>
        )}
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusCfg.color}`}>
          <StatusIcon className="h-3.5 w-3.5" />
          {verificationStatus}
        </span>
      </div>

      {/* Title & tagline */}
      <h3 className="font-bold text-lg text-gray-900 leading-tight">{name}</h3>
      {tagline && <p className="text-sm text-gray-600 mt-1">{tagline}</p>}

      {/* Info row */}
      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-gray-500">
        {location?.city && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {location.city}
          </span>
        )}
        {foundedYear && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {foundedYear}
          </span>
        )}
        {teamSize && (
          <span className="inline-flex items-center gap-1">
            <Users className="h-4 w-4" />
            {teamSize}
          </span>
        )}
      </div>

      {/* Funding stage pill */}
      {fundingStage && (
        <div className="mt-3">
          <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs font-medium">
            {fundingStage}
          </span>
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2 flex-grow">{description}</p>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <span className="text-sm font-medium text-gray-700">
          🎯 {schemesCount} Scheme{schemesCount !== 1 ? 's' : ''} Matched
        </span>
        <Link
          to={`/startup/${_id}`}
          className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200"
        >
          View Profile →
        </Link>
      </div>
    </div>
  );
};

export default StartupCard;
