import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Users,
  Globe,
  Mail,
  ShieldCheck,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
  ArrowLeft,
  Edit3,
  Award,
  ExternalLink,
  Target,
} from 'lucide-react';
import { getStartupById, mapSchemes, updateStartup } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RecommendationSection from '../components/recommendations/RecommendationSection';
import EditStartupModal from '../components/startup/EditStartupModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';

const DOMAIN_COLORS = {
  FinTech: 'bg-blue-100 text-blue-800 border-blue-200',
  EdTech: 'bg-purple-100 text-purple-800 border-purple-200',
  AgriTech: 'bg-green-100 text-green-800 border-green-200',
  HealthTech: 'bg-red-100 text-red-800 border-red-200',
  'AI/ML': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  CleanTech: 'bg-teal-100 text-teal-800 border-teal-200',
  SaaS: 'bg-orange-100 text-orange-800 border-orange-200',
};

const STATUS_CONFIG = {
  Approved: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
    label: 'DPIIT Approved',
  },
  Pending: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
    label: 'Verification Pending',
  },
  Rejected: {
    bg: 'bg-red-50 text-red-700 border-red-200',
    icon: XCircle,
    label: 'Application Rejected',
  },
};

const StartupProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [startup, setStartup] = useState(null);
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schemesLoading, setSchemesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchProfileAndSchemes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStartupById(id);
      const data = res.data || res;
      setStartup(data);

      // Fetch matched schemes
      setSchemesLoading(true);
      try {
        const schemesRes = await mapSchemes(id);
        const schemesData = schemesRes.data || schemesRes;
        setMatchedSchemes(schemesData.matchedSchemes || []);
      } catch (schemeErr) {
        console.warn('Could not load mapped schemes:', schemeErr);
        setMatchedSchemes([]);
      } finally {
        setSchemesLoading(false);
      }
    } catch (err) {
      console.error('Error fetching startup:', err);
      setError(err.response?.data?.message || 'Startup profile not found.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfileAndSchemes();
  }, [fetchProfileAndSchemes]);

  const handleSaveProfile = async (formData) => {
    try {
      const res = await updateStartup(id, formData);
      const updated = res.data || res;
      setStartup(updated);
      setIsEditModalOpen(false);
      setToast({
        message: 'Startup profile updated successfully!',
        type: 'success',
      });
      // Re-map schemes if domain or stage changed
      try {
        const schemesRes = await mapSchemes(id);
        const schemesData = schemesRes.data || schemesRes;
        setMatchedSchemes(schemesData.matchedSchemes || []);
      } catch (err) {
        console.warn('Could not refresh scheme mapping:', err);
      }
    } catch (err) {
      console.error('Error updating startup:', err);
      setToast({
        message: err.response?.data?.message || 'Failed to update startup.',
        type: 'error',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <Building2 className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Startup Not Found</h2>
        <p className="text-gray-600 mb-6 max-w-md">{error || 'The requested startup profile does not exist.'}</p>
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Startup Directory
        </Link>
      </div>
    );
  }

  // Check if current user is owner or admin
  const isOwnerOrAdmin =
    user &&
    (user.role === 'admin' ||
      startup.owner === user._id ||
      startup.owner === user.id ||
      startup.email === user.email);

  const statusConfig = STATUS_CONFIG[startup.verificationStatus] || STATUS_CONFIG.Pending;
  const StatusIcon = statusConfig.icon;
  const domainClass = DOMAIN_COLORS[startup.domain] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>

          {isOwnerOrAdmin && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Manage Startup Profile
            </button>
          )}
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${domainClass} bg-white/90`}>
                    {startup.domain}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig.label}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-blue-200 border border-white/20">
                    Stage: {startup.fundingStage}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {startup.name}
                </h1>
                {startup.tagline && (
                  <p className="text-lg text-blue-100 font-light max-w-3xl">
                    {startup.tagline}
                  </p>
                )}
              </div>

              {/* DPIIT Recognition Card */}
              {startup.dpiitNumber && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shrink-0 text-right md:text-left">
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    DPIIT Recognized
                  </div>
                  <div className="text-base font-mono font-bold mt-1 text-white">
                    {startup.dpiitNumber}
                  </div>
                  <div className="text-xs text-blue-200 mt-0.5">Govt of India Startup Registry</div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-gray-100 bg-gray-50/50 divide-x divide-gray-100">
            <div className="p-4 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="text-xs text-gray-500 font-medium">Headquarters</div>
                <div className="text-sm font-semibold text-gray-900">
                  {startup.location?.city ? `${startup.location.city}, ${startup.location.state}` : startup.location?.state || 'India'}
                </div>
              </div>
            </div>

            <div className="p-4 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="text-xs text-gray-500 font-medium">Founded Year</div>
                <div className="text-sm font-semibold text-gray-900">{startup.foundedYear || 'N/A'}</div>
              </div>
            </div>

            <div className="p-4 flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="text-xs text-gray-500 font-medium">Team Size</div>
                <div className="text-sm font-semibold text-gray-900">{startup.teamSize ? `${startup.teamSize} Members` : 'N/A'}</div>
              </div>
            </div>

            <div className="p-4 flex items-center gap-3">
              <Award className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="text-xs text-gray-500 font-medium">Funding Stage</div>
                <div className="text-sm font-semibold text-gray-900">{startup.fundingStage}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Details & Founder Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview / Problem & Solution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Problem &amp; Solution Overview
              </h2>
              <div className="prose prose-blue text-gray-700 text-sm sm:text-base leading-relaxed">
                {startup.description || 'No detailed description provided by the founder yet.'}
              </div>
            </div>

            {/* Admin Remarks if any */}
            {startup.adminRemarks && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Official Moderator Remarks
                </h3>
                <p className="mt-1 text-sm">{startup.adminRemarks}</p>
              </div>
            )}
          </div>

          {/* Sidebar Contact & Founder (1 col) */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900">Founder &amp; Contact</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs text-gray-500 block">Founder / Lead:</span>
                  <span className="font-semibold text-gray-900 text-base">
                    {startup.founderName || 'Founder details on request'}
                  </span>
                </div>

                {startup.email && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <a
                      href={`mailto:${startup.email}`}
                      className="text-blue-700 hover:underline truncate"
                    >
                      {startup.email}
                    </a>
                  </div>
                )}

                {startup.website && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                    <a
                      href={startup.website.startsWith('http') ? startup.website : `https://${startup.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline flex items-center gap-1 truncate"
                    >
                      {startup.website}
                      <ExternalLink className="w-3 h-3 inline" />
                    </a>
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>

        {/* Government Schemes & Recommendation Section (Module C & D) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              Algorithm-Driven Scheme Recommendations
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              Matched Government Schemes &amp; Subsidies
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Based on {startup.name}&apos;s sector (<span className="font-semibold text-gray-900">{startup.domain}</span>), funding stage (<span className="font-semibold text-gray-900">{startup.fundingStage}</span>), and state (<span className="font-semibold text-gray-900">{startup.location?.state || 'National'}</span>).
            </p>
          </div>

          <RecommendationSection schemes={matchedSchemes} loading={schemesLoading} />
        </div>
      </div>

      {/* Edit Startup Modal */}
      <EditStartupModal
        startup={startup}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default StartupProfilePage;
