const Startup = require('../models/Startup');
const Scheme = require('../models/Scheme');
const store = require('../utils/inMemoryStore');

// @desc    Map eligible schemes for a startup with match scores
// @route   GET /api/schemes/map/:startupId
const mapSchemesForStartup = async (req, res) => {
  try {
    const { startupId } = req.params;

    if (global.useInMemory) {
      const startup = store.getById('startups', startupId);
      if (!startup) {
        return res.status(404).json({ message: 'Startup not found' });
      }

      const allSchemes = store.getAll('schemes');
      const matchedSchemes = [];

      for (const scheme of allSchemes) {
        const domainMatch =
          scheme.eligibleDomains && scheme.eligibleDomains.includes(startup.domain);
        const stageMatch =
          scheme.eligibleStages && scheme.eligibleStages.includes(startup.fundingStage);

        if (domainMatch && stageMatch) {
          let matchScore = 0;
          if (domainMatch) matchScore += 40;
          if (stageMatch) matchScore += 35;

          const startupState = startup.location && startup.location.state;
          const stateMatch =
            startupState &&
            scheme.eligibleStates &&
            scheme.eligibleStates.includes(startupState);
          if (stateMatch) matchScore += 25;

          matchedSchemes.push({
            ...scheme,
            matchScore,
          });
        }
      }

      // Sort by matchScore descending
      matchedSchemes.sort((a, b) => b.matchScore - a.matchScore);

      return res.json({ startup, matchedSchemes });
    } else {
      const startup = await Startup.findById(startupId);
      if (!startup) {
        return res.status(404).json({ message: 'Startup not found' });
      }

      const allSchemes = await Scheme.find({
        eligibleDomains: startup.domain,
        eligibleStages: startup.fundingStage,
      });

      const matchedSchemes = allSchemes.map((scheme) => {
        let matchScore = 0;

        const domainMatch = scheme.eligibleDomains.includes(startup.domain);
        if (domainMatch) matchScore += 40;

        const stageMatch = scheme.eligibleStages.includes(startup.fundingStage);
        if (stageMatch) matchScore += 35;

        const startupState = startup.location && startup.location.state;
        const stateMatch =
          startupState && scheme.eligibleStates && scheme.eligibleStates.includes(startupState);
        if (stateMatch) matchScore += 25;

        return {
          ...scheme.toObject(),
          matchScore,
        };
      });

      // Sort by matchScore descending
      matchedSchemes.sort((a, b) => b.matchScore - a.matchScore);

      return res.json({ startup, matchedSchemes });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { mapSchemesForStartup };
