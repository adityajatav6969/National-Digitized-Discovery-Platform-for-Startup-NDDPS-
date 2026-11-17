import React from 'react';
import RecommendationCard from './RecommendationCard';

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-l-gray-200 animate-pulse">
    <div className="flex justify-between">
      <div className="space-y-2 flex-1 pr-16">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="w-14 h-14 bg-gray-200 rounded-full" />
    </div>
    <div className="mt-3 h-4 bg-gray-200 rounded w-1/3" />
    <div className="flex gap-1.5 mt-3">
      <div className="h-5 bg-gray-200 rounded-full w-16" />
      <div className="h-5 bg-gray-200 rounded-full w-20" />
    </div>
    <div className="mt-4 space-y-1">
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
    <div className="mt-4 h-9 bg-gray-200 rounded-lg w-full" />
  </div>
);

const RecommendationSection = ({ schemes = [], loading = false }) => {
  if (loading) {
    return (
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          🎯 Recommended Government Schemes &amp; Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      </section>
    );
  }

  if (!schemes || schemes.length === 0) {
    return (
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          🎯 Recommended Government Schemes &amp; Resources
        </h2>
        <div className="bg-white rounded-xl shadow-md p-10 text-center">
          <p className="text-gray-500 text-lg">
            No matching schemes found for this startup profile
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        🎯 Recommended Government Schemes &amp; Resources{' '}
        <span className="text-base font-normal text-gray-500">({schemes.length})</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {schemes.map((scheme, idx) => (
          <RecommendationCard key={scheme._id || idx} scheme={scheme} />
        ))}
      </div>
    </section>
  );
};

export default RecommendationSection;
