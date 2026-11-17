const Scheme = require('../models/Scheme');
const store = require('../utils/inMemoryStore');

// @desc    Get all schemes with optional filters
// @route   GET /api/schemes
const getSchemes = async (req, res) => {
  try {
    const { category, domain, stage } = req.query;

    if (global.useInMemory) {
      let results = store.getAll('schemes');

      if (category) {
        results = results.filter((s) => s.category === category);
      }

      if (domain) {
        results = results.filter(
          (s) => s.eligibleDomains && s.eligibleDomains.includes(domain)
        );
      }

      if (stage) {
        results = results.filter(
          (s) => s.eligibleStages && s.eligibleStages.includes(stage)
        );
      }

      return res.json(results);
    } else {
      const query = {};

      if (category) query.category = category;
      if (domain) query.eligibleDomains = domain;
      if (stage) query.eligibleStages = stage;

      const schemes = await Scheme.find(query);
      return res.json(schemes);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single scheme by ID
// @route   GET /api/schemes/:id
const getSchemeById = async (req, res) => {
  try {
    if (global.useInMemory) {
      const scheme = store.getById('schemes', req.params.id);
      if (!scheme) {
        return res.status(404).json({ message: 'Scheme not found' });
      }
      return res.json(scheme);
    } else {
      const scheme = await Scheme.findById(req.params.id);
      if (!scheme) {
        return res.status(404).json({ message: 'Scheme not found' });
      }
      return res.json(scheme);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getSchemes, getSchemeById };
