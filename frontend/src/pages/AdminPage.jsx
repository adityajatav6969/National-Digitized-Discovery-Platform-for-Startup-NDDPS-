import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPendingStartups, verifyStartup } from '../services/api';
import { Shield, CheckCircle, XCircle, Clock, Building2, Loader2, Eye, ExternalLink } from 'lucide-react';

const Toast = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all animate-pulse ${
        type === 'success' ? 'bg-emerald-600' : 'bg-red-500'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle className="h-5 w-5 shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 shrink-0" />
      )}
      {message}
    </div>
  );
};

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  // Track which row is in "action mode" and its remarks
  const [activeAction, setActiveAction] = useState(null); // { id, status }
  const [remarks, setRemarks] = useState({});
  const [processing, setProcessing] = useState(null); // id being processed

  // Admin guard
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getPendingStartups();
      setStartups(res.data || res);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to load pending startups.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPending();
    }
  }, [user, fetchPending]);

  const handleActionClick = (id, status) => {
    if (activeAction?.id === id && activeAction?.status === status) {
      // Toggle off
      setActiveAction(null);
    } else {
      setActiveAction({ id, status });
    }
  };

  const handleRemarkChange = (id, value) => {
    setRemarks((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitAction = async (id) => {
    if (!activeAction) return;
    setProcessing(id);
    try {
      await verifyStartup(id, {
        status: activeAction.status,
        adminRemarks: remarks[id] || '',
      });
      setToast({
        message: `Startup ${activeAction.status.toLowerCase()} successfully.`,
        type: 'success',
      });
      // Remove from list
      setStartups((prev) => prev.filter((s) => (s._id || s.id) !== id));
      setActiveAction(null);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || err.message || 'Action failed.',
        type: 'error',
      });
    } finally {
      setProcessing(null);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-900/10">
            <Shield className="w-6 h-6 text-blue-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">
              Review and verify pending startup registrations
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4 text-amber-500" />
          <span>
            <strong>{startups.length}</strong> startup{startups.length !== 1 ? 's' : ''} pending
            review
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-blue-900 animate-spin" />
            <span className="ml-3 text-gray-500">Loading pending startups…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-6">
            {error}
            <button
              onClick={fetchPending}
              className="ml-3 underline font-medium hover:text-red-900 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && startups.length === 0 && (
          <div className="text-center py-20">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-700">All caught up!</h2>
            <p className="text-sm text-gray-500 mt-1">
              No pending startups to review right now.
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && startups.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="py-3 px-4 text-left font-semibold whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" /> Name
                      </span>
                    </th>
                    <th className="py-3 px-4 text-left font-semibold whitespace-nowrap">Domain</th>
                    <th className="py-3 px-4 text-left font-semibold whitespace-nowrap">Location</th>
                    <th className="py-3 px-4 text-left font-semibold whitespace-nowrap">Founded</th>
                    <th className="py-3 px-4 text-left font-semibold whitespace-nowrap">DPIIT #</th>
                    <th className="py-3 px-4 text-left font-semibold whitespace-nowrap">Date Submitted</th>
                    <th className="py-3 px-4 text-center font-semibold whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {startups.map((startup) => {
                    const sid = startup._id || startup.id;
                    const isActive = activeAction?.id === sid;
                    return (
                      <React.Fragment key={sid}>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                            <Link
                              to={`/startup/${sid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 hover:text-blue-900 hover:underline inline-flex items-center gap-1.5 font-bold group"
                              title="Click to view full startup profile in new tab"
                            >
                              <span>{startup.name}</span>
                              <ExternalLink className="h-3.5 w-3.5 text-blue-500 group-hover:text-blue-700 transition" />
                            </Link>
                            {startup.tagline && (
                              <p className="text-xs text-gray-500 font-normal truncate max-w-xs">{startup.tagline}</p>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                              {startup.domain}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                            {startup.location?.city && startup.location?.state
                              ? `${startup.location.city}, ${startup.location.state}`
                              : startup.location?.state || startup.location?.city || '—'}
                          </td>
                          <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                            {startup.foundedYear || '—'}
                          </td>
                          <td className="py-3 px-4 text-gray-600 whitespace-nowrap font-mono text-xs">
                            {startup.dpiitNumber || '—'}
                          </td>
                          <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                            {startup.createdAt
                              ? new Date(startup.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '—'}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                to={`/startup/${sid}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                                title="Inspect Full Profile"
                              >
                                <Eye className="h-3.5 w-3.5" /> View
                              </Link>
                              <button
                                onClick={() => handleActionClick(sid, 'Approved')}
                                disabled={processing === sid}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                                  isActive && activeAction?.status === 'Approved'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                } disabled:opacity-50`}
                              >
                                <CheckCircle className="h-3.5 w-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => handleActionClick(sid, 'Rejected')}
                                disabled={processing === sid}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                                  isActive && activeAction?.status === 'Rejected'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                                } disabled:opacity-50`}
                              >
                                <XCircle className="h-3.5 w-3.5" /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                        {/* Remarks row */}
                        {isActive && (
                          <tr className="bg-gray-50">
                            <td colSpan={7} className="py-3 px-4">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 max-w-2xl">
                                <label className="text-sm text-gray-600 font-medium shrink-0">
                                  Remarks:
                                </label>
                                <input
                                  type="text"
                                  value={remarks[sid] || ''}
                                  onChange={(e) => handleRemarkChange(sid, e.target.value)}
                                  placeholder="Optional remarks…"
                                  className="flex-1 w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 transition"
                                />
                                <button
                                  onClick={() => handleSubmitAction(sid)}
                                  disabled={processing === sid}
                                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-semibold transition disabled:opacity-60 ${
                                    activeAction?.status === 'Approved'
                                      ? 'bg-emerald-600 hover:bg-emerald-700'
                                      : 'bg-red-600 hover:bg-red-700'
                                  }`}
                                >
                                  {processing === sid ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : activeAction?.status === 'Approved' ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <XCircle className="h-4 w-4" />
                                  )}
                                  Confirm {activeAction?.status === 'Approved' ? 'Approval' : 'Rejection'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
