const Startup = require('../models/Startup');
const store = require('../utils/inMemoryStore');

// @desc    Create a new startup
// @route   POST /api/startups
const createStartup = async (req, res) => {
  try {
    if (global.useInMemory) {
      const startup = store.create('startups', {
        ...req.body,
        owner: req.user._id || req.user.id,
        verificationStatus: 'Pending',
        matchedSchemes: [],
      });
      return res.status(201).json(startup);
    } else {
      const startup = await Startup.create({
        ...req.body,
        owner: req.user._id,
      });
      return res.status(201).json(startup);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all startups with filters, search, sort, pagination
// @route   GET /api/startups
const getStartups = async (req, res) => {
  try {
    const { search, domain, fundingStage, location, status, owner, sort, page = 1, limit = 6 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 6;

    if (global.useInMemory) {
      let results = store.getAll('startups');

      // Owner filter
      if (owner) {
        results = results.filter((s) => String(s.owner) === String(owner));
      }

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        results = results.filter(
          (s) =>
            (s.name && s.name.toLowerCase().includes(searchLower)) ||
            (s.tagline && s.tagline.toLowerCase().includes(searchLower)) ||
            (s.description && s.description.toLowerCase().includes(searchLower)) ||
            (s.domain && s.domain.toLowerCase().includes(searchLower))
        );
      }

      // Domain filter (supports single value or comma-separated)
      if (domain) {
        const domainList = domain.split(',').map((d) => d.trim());
        results = results.filter((s) => domainList.includes(s.domain));
      }

      // Funding stage filter (supports single value or comma-separated)
      if (fundingStage) {
        const stageList = fundingStage.split(',').map((st) => st.trim());
        results = results.filter((s) => stageList.includes(s.fundingStage));
      }

      // Location (state/city) filter (supports single value or comma-separated)
      if (location) {
        const locList = location.split(',').map((l) => l.trim().toLowerCase());
        results = results.filter(
          (s) =>
            (s.location && s.location.state && locList.includes(s.location.state.toLowerCase())) ||
            (s.location && s.location.city && locList.includes(s.location.city.toLowerCase()))
        );
      }

      // Status filter
      if (status && status !== 'All') {
        results = results.filter((s) => s.verificationStatus === status);
      }

      // Sort
      if (sort === 'newest') {
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sort === 'oldest') {
        results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sort === 'alphabetical') {
        results.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === 'fundingStage') {
        const stageOrder = { 'Bootstrapped': 1, 'Pre-Seed': 2, 'Seed': 3, 'Series A': 4, 'Series B+': 5 };
        results.sort((a, b) => (stageOrder[a.fundingStage] || 0) - (stageOrder[b.fundingStage] || 0));
      }

      const total = results.length;
      const pages = Math.ceil(total / limitNum) || 1;
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedResults = results.slice(startIndex, startIndex + limitNum);

      return res.json({
        startups: paginatedResults,
        page: pageNum,
        pages,
        total,
      });
    } else {
      const query = {};

      if (owner) {
        query.owner = owner;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { tagline: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { domain: { $regex: search, $options: 'i' } },
        ];
      }

      if (domain) {
        const domainList = domain.split(',').map((d) => d.trim());
        query.domain = domainList.length > 1 ? { $in: domainList } : domainList[0];
      }

      if (fundingStage) {
        const stageList = fundingStage.split(',').map((st) => st.trim());
        query.fundingStage = stageList.length > 1 ? { $in: stageList } : stageList[0];
      }

      if (location) {
        const locList = location.split(',').map((l) => l.trim());
        query.$or = [
          { 'location.state': locList.length > 1 ? { $in: locList } : locList[0] },
          { 'location.city': locList.length > 1 ? { $in: locList } : locList[0] },
        ];
      }

      if (status && status !== 'All') {
        query.verificationStatus = status;
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'newest') sortOption = { createdAt: -1 };
      else if (sort === 'oldest') sortOption = { createdAt: 1 };
      else if (sort === 'alphabetical') sortOption = { name: 1 };
      else if (sort === 'fundingStage') sortOption = { fundingStage: 1 };

      const total = await Startup.countDocuments(query);
      const pages = Math.ceil(total / limitNum) || 1;

      const startups = await Startup.find(query)
        .sort(sortOption)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      return res.json({
        startups,
        page: pageNum,
        pages,
        total,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single startup by ID
// @route   GET /api/startups/:id
const getStartupById = async (req, res) => {
  try {
    if (global.useInMemory) {
      const startup = store.getById('startups', req.params.id);
      if (!startup) {
        return res.status(404).json({ message: 'Startup not found' });
      }

      // Populate matchedSchemes
      const populated = { ...startup };
      if (startup.matchedSchemes && startup.matchedSchemes.length > 0) {
        populated.matchedSchemes = startup.matchedSchemes
          .map((schemeId) => store.getById('schemes', schemeId))
          .filter(Boolean);
      }

      return res.json(populated);
    } else {
      const startup = await Startup.findById(req.params.id).populate('matchedSchemes');
      if (!startup) {
        return res.status(404).json({ message: 'Startup not found' });
      }
      return res.json(startup);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update startup
// @route   PUT /api/startups/:id
const updateStartup = async (req, res) => {
  try {
    if (global.useInMemory) {
      const startup = store.getById('startups', req.params.id);
      if (!startup) {
        return res.status(404).json({ message: 'Startup not found' });
      }

      const updated = store.update('startups', req.params.id, req.body);
      return res.json(updated);
    } else {
      const startup = await Startup.findById(req.params.id);
      if (!startup) {
        return res.status(404).json({ message: 'Startup not found' });
      }

      const updated = await Startup.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(updated);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete startup
// @route   DELETE /api/startups/:id
const deleteStartup = async (req, res) => {
  try {
    if (global.useInMemory) {
      const startup = store.getById('startups', req.params.id);
      if (!startup) {
        return res.status(404).json({ message: 'Startup not found' });
      }

      store.remove('startups', req.params.id);
      return res.json({ message: 'Startup removed' });
    } else {
      const startup = await Startup.findById(req.params.id);
      if (!startup) {
        return res.status(404).json({ message: 'Startup not found' });
      }

      await Startup.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Startup removed' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createStartup, getStartups, getStartupById, updateStartup, deleteStartup };
