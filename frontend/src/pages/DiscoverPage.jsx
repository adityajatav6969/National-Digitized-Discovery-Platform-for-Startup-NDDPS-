import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/search/FilterPanel';
import PaginationAndSort from '../components/search/PaginationAndSort';
import StartupCard from '../components/startup/StartupCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { getStartups } from '../services/api';
import { Rocket, SlidersHorizontal, RefreshCw } from 'lucide-react';

const DiscoverPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    domain: searchParams.get('domain') ? [searchParams.get('domain')] : [],
    fundingStage: searchParams.get('fundingStage') ? [searchParams.get('fundingStage')] : [],
    location: searchParams.get('location') ? [searchParams.get('location')] : [],
    status: searchParams.get('status') || 'All',
  });
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const limit = 6;

  // Data states
  const [startups, setStartups] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync URL params when filters change
  const fetchStartupsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        sort,
      };

      if (search.trim()) params.search = search.trim();
      if (filters.domain && filters.domain.length > 0) {
        params.domain = filters.domain.join(',');
      }
      if (filters.fundingStage && filters.fundingStage.length > 0) {
        params.fundingStage = filters.fundingStage.join(',');
      }
      if (filters.location && filters.location.length > 0) {
        params.location = filters.location.join(',');
      }
      if (filters.status && filters.status !== 'All') {
        params.status = filters.status;
      }

      const res = await getStartups(params);
      const data = res.data || res;
      setStartups(data.startups || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error('Error fetching startups:', err);
      setError(err.response?.data?.message || 'Failed to load startups. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, filters, sort, page, limit]);

  useEffect(() => {
    fetchStartupsData();
  }, [fetchStartupsData]);

  // Handlers
  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearch('');
    setPage(1);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      domain: [],
      fundingStage: [],
      location: [],
      status: 'All',
    });
    setSearch('');
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/60 text-xs font-semibold uppercase tracking-wider text-blue-200 mb-2">
                <Rocket className="w-3.5 h-3.5" />
                Discovery Engine • Real-Time Directory
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                National Startup Directory
              </h1>
              <p className="mt-1 text-sm sm:text-base text-blue-200 max-w-2xl">
                Explore, filter, and discover vetted startups across India. Real-time multi-dimensional search with scheme matching.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchStartupsData}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium text-white transition-colors"
                title="Refresh Results"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Search bar inside hero */}
          <div className="mt-6">
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              onClear={handleSearchClear}
            />
          </div>
        </div>

        {/* Content Layout: Sidebar Filters + Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main List Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sorting & Stats Top Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <PaginationAndSort
                page={page}
                pages={pages}
                total={total}
                limit={limit}
                sort={sort}
                onPageChange={handlePageChange}
                onSortChange={handleSortChange}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Loading state */}
            {loading ? (
              <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200">
                <LoadingSpinner />
              </div>
            ) : startups.length === 0 ? (
              <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-200">
                <EmptyState
                  icon={Rocket}
                  title="No Startups Match Your Search"
                  description="Try broadening your filters, clearing keywords, or searching for other domains like FinTech, EdTech, or CleanTech."
                  actionLabel="Clear All Filters"
                  actionLink="#"
                  onAction={handleClearFilters}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {startups.map((startup) => (
                  <StartupCard key={startup._id || startup.id} startup={startup} />
                ))}
              </div>
            )}

            {/* Bottom Pagination */}
            {!loading && total > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <PaginationAndSort
                  page={page}
                  pages={pages}
                  total={total}
                  limit={limit}
                  sort={sort}
                  onPageChange={handlePageChange}
                  onSortChange={handleSortChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
