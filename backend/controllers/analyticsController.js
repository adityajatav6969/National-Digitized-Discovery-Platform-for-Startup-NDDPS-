const Startup = require('../models/Startup');
const Scheme = require('../models/Scheme');
const store = require('../utils/inMemoryStore');

// @desc    Get analytics overview
// @route   GET /api/analytics/overview
const getOverview = async (req, res) => {
  try {
    if (global.useInMemory) {
      const startups = store.getAll('startups');
      const schemes = store.getAll('schemes');

      // Count by domain
      const byDomain = {};
      startups.forEach((s) => {
        if (s.domain) {
          byDomain[s.domain] = (byDomain[s.domain] || 0) + 1;
        }
      });

      // Count by location (state)
      const byLocation = {};
      startups.forEach((s) => {
        const state = s.location && s.location.state;
        if (state) {
          byLocation[state] = (byLocation[state] || 0) + 1;
        }
      });

      // Count by funding stage
      const byFundingStage = {};
      startups.forEach((s) => {
        if (s.fundingStage) {
          byFundingStage[s.fundingStage] = (byFundingStage[s.fundingStage] || 0) + 1;
        }
      });

      // Count by verification status
      const byStatus = {};
      startups.forEach((s) => {
        if (s.verificationStatus) {
          byStatus[s.verificationStatus] = (byStatus[s.verificationStatus] || 0) + 1;
        }
      });

      return res.json({
        byDomain,
        byLocation,
        byFundingStage,
        byStatus,
        totalStartups: startups.length,
        totalSchemes: schemes.length,
        totalApproved: startups.filter((s) => s.verificationStatus === 'Approved').length,
      });
    } else {
      const totalStartups = await Startup.countDocuments();
      const totalSchemes = await Scheme.countDocuments();
      const totalApproved = await Startup.countDocuments({ verificationStatus: 'Approved' });

      // Aggregate by domain
      const domainAgg = await Startup.aggregate([
        { $group: { _id: '$domain', count: { $sum: 1 } } },
      ]);
      const byDomain = {};
      domainAgg.forEach((d) => {
        if (d._id) byDomain[d._id] = d.count;
      });

      // Aggregate by location (state)
      const locationAgg = await Startup.aggregate([
        { $group: { _id: '$location.state', count: { $sum: 1 } } },
      ]);
      const byLocation = {};
      locationAgg.forEach((l) => {
        if (l._id) byLocation[l._id] = l.count;
      });

      // Aggregate by funding stage
      const stageAgg = await Startup.aggregate([
        { $group: { _id: '$fundingStage', count: { $sum: 1 } } },
      ]);
      const byFundingStage = {};
      stageAgg.forEach((s) => {
        if (s._id) byFundingStage[s._id] = s.count;
      });

      // Aggregate by status
      const statusAgg = await Startup.aggregate([
        { $group: { _id: '$verificationStatus', count: { $sum: 1 } } },
      ]);
      const byStatus = {};
      statusAgg.forEach((s) => {
        if (s._id) byStatus[s._id] = s.count;
      });

      return res.json({
        byDomain,
        byLocation,
        byFundingStage,
        byStatus,
        totalStartups,
        totalSchemes,
        totalApproved,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getOverview };
