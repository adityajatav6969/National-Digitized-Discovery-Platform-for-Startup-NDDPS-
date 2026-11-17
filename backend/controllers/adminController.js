const Startup = require('../models/Startup');
const store = require('../utils/inMemoryStore');

// @desc    Get all pending startups
// @route   GET /api/admin/startups/pending
const getPendingStartups = async (req, res) => {
  try {
    if (global.useInMemory) {
      const pending = store.query('startups', { verificationStatus: 'Pending' });
      return res.json(pending);
    } else {
      const pending = await Startup.find({ verificationStatus: 'Pending' });
      return res.json(pending);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify (approve/reject) a startup
// @route   PATCH /api/admin/startups/:id/verify
const verifyStartup = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Approved or Rejected' });
    }

    if (global.useInMemory) {
      const startup = store.getById('startups', req.params.id);
      if (!startup) {
        return res.status(404).json({ message: 'Startup not found' });
      }

      const updated = store.update('startups', req.params.id, {
        verificationStatus: status,
        adminRemarks: adminRemarks || '',
      });

      return res.json(updated);
    } else {
      const startup = await Startup.findById(req.params.id);
      if (!startup) {
        return res.status(404).json({ message: 'Startup not found' });
      }

      startup.verificationStatus = status;
      startup.adminRemarks = adminRemarks || '';
      await startup.save();

      return res.json(startup);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getPendingStartups, verifyStartup };
