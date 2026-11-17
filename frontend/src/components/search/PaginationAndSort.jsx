import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Alphabetical A-Z', value: 'alphabetical' },
  { label: 'Funding Stage', value: 'fundingStage' },
];

const PaginationAndSort = ({ page = 1, pages = 1, total = 0, limit = 6, sort = 'newest', onPageChange, onSortChange }) => {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const nums = [];
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) nums.push(i);
      return nums;
    }
    nums.push(1);
    if (page > 3) nums.push('...');
    const rangeStart = Math.max(2, page - 1);
    const rangeEnd = Math.min(pages - 1, page + 1);
    for (let i = rangeStart; i <= rangeEnd; i++) nums.push(i);
    if (page < pages - 2) nums.push('...');
    nums.push(pages);
    return nums;
  };

  return (
    <div className="space-y-4">
      {/* Top row: Sort + count */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-gray-600">
          {total === 0 ? (
            'No startups found'
          ) : (
            <>
              Showing <span className="font-semibold">{start}–{end}</span> of{' '}
              <span className="font-semibold">{total}</span> Startups
            </>
          )}
        </p>
      </div>

      {/* Pagination buttons */}
      {pages > 1 && (
        <nav className="flex items-center justify-center gap-1 flex-wrap" aria-label="Pagination">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-100"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>

          {getPageNumbers().map((num, idx) =>
            num === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 py-2 text-sm text-gray-400 select-none">
                …
              </span>
            ) : (
              <button
                key={num}
                onClick={() => onPageChange(num)}
                className={`min-w-[2.25rem] rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  num === page
                    ? 'bg-blue-800 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-current={num === page ? 'page' : undefined}
              >
                {num}
              </button>
            )
          )}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === pages}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-100"
            aria-label="Next page"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
};

export default PaginationAndSort;
